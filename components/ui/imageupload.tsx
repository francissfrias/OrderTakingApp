import { FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import FallbackImage from '@/public/fallbackimage.webp';
import Image from 'next/image';
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { useController } from 'react-hook-form';
import { v4 as uuidV4 } from 'uuid';

function extractFileName(filePath: string) {
  if (!filePath) return;
  return filePath.split('\\').pop();
}

function useImagePreview(
  imageFile: File | null,
  setImagePreview?: (file: string) => void
) {
  const [previewSrc, setPreviewSrc] = useState('');

  useEffect(() => {
    if (!imageFile) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewSrc(result);
      if (setImagePreview) {
        setImagePreview(result);
      }
    };
    reader.readAsDataURL(imageFile);

    return () => {
      reader.abort();
    };
  }, [imageFile, setImagePreview]);

  return previewSrc;
}

interface Props {
  name: string;
  control: any;
  label: string;
  disabled?: boolean;
  readOnly?: boolean;
  setImagePreview?: (file: string) => void;
}

type Ref = HTMLInputElement;

const ImageUploader = forwardRef<Ref, Props>(
  (
    { name, control, label, setImagePreview, disabled, readOnly, ...props },
    ref
  ) => {
    const {
      field: { onChange, value },
      fieldState: { error },
    } = useController({
      name,
      control,
    });
    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [fallbackImage, setFallbackImage] = useState(null);
    const [sizeExceedError, setSizeExceedError] = useState(false);
    const [previousImageFile] = useState(value);
    const previewSrc = useImagePreview(imageFile, setImagePreview);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (!files || !files.item(0)) return;

      const file = files.item(0);
      if (!file) return; // Double check to satisfy TypeScript

      if (file.size / 1024 / 1024 > 4.5) {
        if (value) {
          onChange(value);
          setImageFile(previousImageFile);
        }
        e.target.value = '';
        setImageFile(null);
        setSizeExceedError(true);
        return;
      }
      const randomString = uuidV4();
      const filenameArray = file.name.split('.');
      const formattedName = `${filenameArray[0]}-${randomString}.${filenameArray[1]}`;

      const renamedFile = [
        new File([file], formattedName, { type: file.type }),
      ];
      onChange(renamedFile);
      setImageFile(file);
      setSizeExceedError(false);
    };

    const handleDivClick = () => {
      inputRef?.current?.click();
    };

    return (
      <>
        <FormLabel
          htmlFor='picture'
          className={cn(error?.message && 'text-red-500')}
        >
          {label}
        </FormLabel>
        <div className='container flex flex-row w-full   items-center justify-center gap-6'>
          {!imageFile && value ? (
            <>
              {value[0]?.url && (
                <Image
                  src={value[0].url}
                  alt='upload your image'
                  width={125}
                  height={125}
                  quality={100}
                  onError={() => setFallbackImage(fallbackImage)}
                  layout='fixed'
                  className={cn(
                    'rounded-full object-cover ring-1 ring-gray-200 max-h-[125px] max-w-[125px] aspect-1',
                    readOnly && 'ring-2 ring-yellow-200'
                  )}
                />
              )}
              <button
                type='button'
                onClick={handleDivClick}
                disabled={disabled}
                className={cn(
                  'flex-1 flex h-full  w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer overflow-hidden file:border-0 file:bg-transparent file:text-sm hover:bg-accent hover:text-accent-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  readOnly && 'disabled:opacity-100 ring-1 ring-yellow-200'
                )}
              >
                <p>{value[0]?.name}</p>
                <p className='ml-2 font-semibold'>Click to Update Photo</p>
              </button>
            </>
          ) : (
            <>
              <Image
                src={previewSrc || FallbackImage}
                alt='upload your image'
                width={125}
                height={125}
                quality={100}
                layout='fixed'
                className={cn(
                  'rounded-full object-cover ring-1 ring-gray-200 max-h-[125px] max-w-[125px] aspect-1'
                )}
              />
              <button
                type='button'
                onClick={handleDivClick}
                disabled={disabled}
                className={cn(
                  'flex-1 flex h-full  w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background cursor-pointer overflow-hidden file:border-0 file:bg-transparent file:text-sm hover:bg-accent hover:text-accent-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                  readOnly && 'disabled:opacity-100 ring-1 ring-yellow-200'
                )}
              >
                {!inputRef.current?.value ? (
                  <p className='ml-2 font-semibold'> Click to Upload Photo</p>
                ) : (
                  <>
                    <p> {extractFileName(inputRef?.current?.value)}</p>
                    <p className='ml-2 font-semibold'>
                      - Click to Update Photo
                    </p>
                  </>
                )}
              </button>
            </>
          )}

          <Input
            type='file'
            accept='image/*'
            onChange={handleChange}
            ref={inputRef}
            className={'hidden'}
            disabled={disabled}
            {...props}
          />
        </div>
        {fallbackImage && value && (
          <FormMessage className='text-red-500 mt-2'>
            Image is broken, please re-upload to fix.
          </FormMessage>
        )}
        {error && (
          <FormMessage className='text-red-500 mt-2'>
            {error.message}
          </FormMessage>
        )}
        {sizeExceedError && (
          <FormMessage className='text-red-500 mt-2'>
            Image size must not be greater than 4.5mb
          </FormMessage>
        )}
      </>
    );
  }
);

ImageUploader.displayName = 'ImageUploader';

export { ImageUploader };
