'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Pencil, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { skuDefaultValues, updateSku, UpdateSkuSchema } from '@/schema/sku';
import { ImageUploader } from '@/components/ui/imageupload';
import { useGetId } from '@/hooks/useGetId';

const UpdateSkuForm = ({ id }: { id: string }) => {
  const sku = useGetId({ id: id, module: 'sku' });
  const skuData: UpdateSkuSchema = sku.data!;

  console.log(skuData);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    mode: 'onChange',
    defaultValues: skuDefaultValues,
    resolver: zodResolver(updateSku),
  });
  const { toast } = useToast();

  useEffect(() => {
    if (!sku.data) return;

    Object.keys(skuData).forEach((key) => {
      const _key = key as keyof UpdateSkuSchema;
      form.setValue(_key, skuData[_key]);
    });
  }, [skuData, form, sku.data]);

  const onSubmit = async (data: UpdateSkuSchema) => {
    setLoading(true);
    try {
      const formData = new FormData();
      const imageData = data.imageUrl
        ? {
            url: data.imageUrl[0].url,
            name: data.imageUrl[0].name,
            lastModified: data.imageUrl[0].lastModified,
            lastModifiedDate: data.imageUrl[0].lastModifiedDate,
            size: data.imageUrl[0].size,
            type: data.imageUrl[0].type,
          }
        : {};

      if (data.name) formData.append('name', data.name);
      if (data.code) formData.append('code', data.code);
      if (data.unitPrice)
        formData.append('unitPrice', data.unitPrice.toString());
      if (data.imageUrl && data.imageUrl[0]) {
        formData.append('file', data.imageUrl[0]);
        formData.append('filename', data.imageUrl[0].name);
        formData.append('imageUrl', JSON.stringify([imageData]));
      }

      const response = await fetch(`/api/sku/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw errorData;
      }

      if (skuData.imageUrl?.[0]?.url) {
        await fetch('/api/blob/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: skuData.imageUrl[0].url }),
        });
      }
      await router.refresh();
      toast({
        title: 'Success',
        description: 'SKU Created Successfully',
      });
      setOpen(false);
    } catch (e) {
      console.log(e);
      toast({
        title: 'Something went wrong...',
        description:
          (e as { error: string }).error || 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button variant='outline' onClick={() => setOpen(true)}>
          <Pencil className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create SKU</DialogTitle>
        <DialogClose
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
          onClick={() => setOpen(false)}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </DialogClose>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter Code' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='unitPrice'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Enter Unit Price'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <ImageUploader
                label='Product Image'
                name='imageUrl'
                control={form.control}
              />
            </FormItem>

            <Button
              className={'md:max-w-min'}
              disabled={loading}
              type={'submit'}
            >
              {!loading ? (
                'Update SKU'
              ) : (
                <>
                  {'Please Wait'}
                  <Loader2 className={'ml-2 animate-spin'} />
                </>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateSkuForm;
