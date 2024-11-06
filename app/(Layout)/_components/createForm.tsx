'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  customerDefaultValues,
  createCustomer,
  CreateCustomerSchema,
} from '@/schema/customer';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

const CreateCustomerForm = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm({
    mode: 'onChange',
    defaultValues: customerDefaultValues,
    resolver: zodResolver(createCustomer),
  });
  const { toast } = useToast();

  const onSubmit = async (data: CreateCustomerSchema) => {
    console.log(data);
    setLoading(true);
    try {
      const response = await fetch('/api/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw errorData;
      }

      await router.refresh();
      toast({
        title: 'Success',
        description: 'Customer Created Successfully',
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
        <Button variant='ghost' onClick={() => setOpen(true)}>
          Create Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Create Customer</DialogTitle>
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
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter First Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter Last Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='mobileNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Enter Mobile Number'
                      type='number'
                      aria-label='Mobile Number'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Please enter your 10 digit mobile number
                    <br /> Ex: 9876543210
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='city'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter City' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className={'md:max-w-min'}
              disabled={loading}
              type={'submit'}
            >
              {!loading ? (
                'Create Customer'
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

export default CreateCustomerForm;
