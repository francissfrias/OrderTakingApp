'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import Image from 'next/image';
import fallbackImage from '@/public/fallbackimage.webp';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const EditItemOrderForm = ({
  selectedItem,
  setCart,
  productItems,
}: {
  selectedItem: { skuId: string; quantity: number; price: number };
  setCart: React.Dispatch<
    React.SetStateAction<
      {
        skuId: string;
        quantity: number;
        price: number;
      }[]
    >
  >;
  productItems: { name: string; code: string; price: number; image: string }[];
}) => {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(selectedItem.quantity);

  const findProductItem = productItems.find(
    (item) => item.code === selectedItem.skuId
  );

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const handleConfirm = () => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.skuId === selectedItem.skuId
          ? {
              ...item,
              quantity,
              price: quantity * (findProductItem?.price ?? 0),
            }
          : item
      )
    );
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button variant='outline' onClick={() => setOpen(true)}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className=' overflow-auto min-w-[50rem]'>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogClose
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
          onClick={() => setOpen(false)}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </DialogClose>
        <div
          key={findProductItem?.code}
          className='flex items-center justify-between p-2 border-b'
        >
          <div className='flex items-center justify-start gap-4 '>
            <Image
              src={findProductItem?.image || fallbackImage}
              alt={findProductItem?.name || 'Product Image'}
              height={100}
              width={100}
              className='mr-2'
            />
            <div>
              <p className='font-medium mb-2'>
                Product Name: {findProductItem?.name}
              </p>
              <p className='text-sm text-gray-500'>
                Product Code: {findProductItem?.code}
              </p>
            </div>
            <p className='mr-4'>
              Product Price: PHP {findProductItem?.price.toFixed(2)}
            </p>
            <Label>Quantity: </Label>
            <Input
              type='number'
              min='1'
              value={quantity}
              onChange={handleQuantityChange}
              className='w-16 text-center border rounded-md mr-4'
            />
            <Button variant='outline' onClick={handleConfirm}>
              Confirm
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemOrderForm;
