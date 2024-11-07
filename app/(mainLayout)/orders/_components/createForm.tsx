'use client';

import { Autocomplete } from '@/components/ui/autocomplete';
import { Button } from '@/components/ui/button';
import { DatePickerSingle } from '@/components/ui/datepickersingle';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import {
  createPurchaseOrder,
  CreatePurchaseOrderSchema,
  purchaseOrderDefaultValues,
} from '@/schema/purchaseOrder';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AddItemOrderForm from './addItemOrderForm';
import EditItemOrderForm from './editItemOrderForm';
import { statusOptions } from './util';

const CreatePurchaseOrderForm = ({
  productItems,
  customerItems,
}: {
  productItems: {
    _id: string;
    name: string;
    code: string;
    price: number;
    image: string;
  }[];
  customerItems: { label: string; value: string }[];
}) => {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<
    {
      skuId: string;
      quantity: number;
      price: number;
      subTotal: number;
    }[]
  >([]);
  const router = useRouter();
  const form = useForm({
    mode: 'onChange',
    defaultValues: purchaseOrderDefaultValues,
    resolver: zodResolver(createPurchaseOrder),
  });
  const { toast } = useToast();

  const onSubmit = async (data: CreatePurchaseOrderSchema) => {
    setLoading(true);
    try {
      const customer = customerItems.find(
        (item) => item.value === data.customerId
      );
      const dataToSend = {
        ...data,
        customerName: customer ? customer.label : '',
        amountDue: cart.reduce((acc, item) => acc + (item.subTotal || 0), 0),
        cartOrders: cart,
      };

      const response = await fetch('/api/purchaseOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw errorData;
      }

      await router.refresh();
      await router.push('/orders');
      toast({
        title: 'Success',
        description: 'Customer Created Successfully',
      });
      form.reset();
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='customerId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer</FormLabel>
              <FormControl>
                <Autocomplete
                  options={customerItems}
                  placeholder='Select your Customer'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='dateOfDelivery'
          render={({ field }) => (
            <FormItem className='flex flex-col w-full'>
              <FormLabel>Delivery Date</FormLabel>
              <FormControl>
                <DatePickerSingle {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(value)}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder='Stest'
                      onBlur={field.onBlur}
                      ref={field.ref}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {statusOptions.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <AddItemOrderForm
          cart={cart}
          setCart={setCart}
          productItems={productItems}
        />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.map((item) => (
              <TableRow key={item.skuId}>
                <TableHead>{item.skuId}</TableHead>
                <TableHead>{item.quantity}</TableHead>
                <TableHead>PHP {item.price * item.quantity}</TableHead>
                <TableHead className='p-2 w-20'>
                  <EditItemOrderForm
                    productItems={productItems}
                    selectedItem={item}
                    setCart={setCart}
                    key={item.skuId}
                  />
                </TableHead>
              </TableRow>
            ))}
            <TableRow className='bg-slate-50'>
              <TableHead>Total</TableHead>
              <TableHead>
                {cart.reduce((acc, item) => acc + item.quantity, 0)}
              </TableHead>
              <TableHead>
                PHP{' '}
                {cart
                  .reduce((acc, item) => acc + (item.subTotal || 0), 0)
                  .toFixed(2)}
              </TableHead>
            </TableRow>
          </TableBody>
        </Table>

        <Button className={'md:max-w-min'} disabled={loading} type={'submit'}>
          {!loading ? (
            'Create Order'
          ) : (
            <>
              {'Please Wait'}
              <Loader2 className={'ml-2 animate-spin'} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreatePurchaseOrderForm;
