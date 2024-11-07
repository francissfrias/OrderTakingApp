'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import fallbackImage from '@/public/fallbackimage.webp';
import { DialogTrigger } from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface IAddItemOrderForm {
  cart: { skuId: string; quantity: number; price: number; subTotal: number }[];
  setCart: React.Dispatch<
    React.SetStateAction<
      {
        skuId: string;
        quantity: number;
        price: number;
        subTotal: number;
      }[]
    >
  >;
  productItems: { name: string; code: string; price: number; image: string }[];
}

const AddItemOrderForm = ({
  cart,
  setCart,
  productItems,
}: IAddItemOrderForm) => {
  const [open, setOpen] = useState(false);

  const isProductInCart = (skuId: string) => {
    return cart.some((item) => item.skuId === skuId);
  };

  const handleAddToCart = (item: { code: string; price: number }) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (cartItem) => cartItem.skuId === item.code
      );
      if (existingItem) {
        // If the item is already in the cart, increase its quantity
        return prevCart.map((cartItem) =>
          cartItem.skuId === item.code
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // If the item is not in the cart, add it
        return [
          ...prevCart,
          {
            skuId: item.code,
            quantity: 1,
            price: item.price,
            subTotal: item.price,
          },
        ];
      }
    });
  };

  // Filter out items that are already in the cart
  const availableProductItems = productItems.filter(
    (item) => !isProductInCart(item.code)
  );

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button variant='outline' onClick={() => setOpen(true)}>
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent
        className='w-full overflow-auto'
        onInteractOutside={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>Add Item</DialogTitle>
        <DialogClose
          className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
          onClick={() => setOpen(false)}
        >
          <X className='h-4 w-4' />
          <span className='sr-only'>Close</span>
        </DialogClose>
        <div>
          {availableProductItems.length === 0 && (
            <p className='text-center'>No items available</p>
          )}
          {productItems.map(
            (item) =>
              !isProductInCart(item.code) && (
                <div
                  key={item.code}
                  className='flex items-center justify-between p-2 border-b'
                >
                  <div className='flex items-center'>
                    <Image
                      src={item?.image || fallbackImage}
                      alt={item?.name || 'Product Image'}
                      height={100}
                      width={100}
                      className=' mr-2'
                    />
                    <div>
                      <p className='font-medium'>{item.name}</p>
                      <p className='text-sm text-gray-500'>{item.code}</p>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <p className='mr-4'>PHP {item.price.toFixed(2)}</p>
                    <Button
                      variant='outline'
                      onClick={() => handleAddToCart(item)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemOrderForm;
