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
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  customerDefaultValues,
  createCustomer,
  CreateCustomerSchema,
} from '@/schema/customer';
import { useToast } from '@/hooks/use-toast';

const CreateCustomerForm = () => {
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

      await router.push('/');
      await router.refresh();
      toast({
        title: 'Success',
        description: 'Customer Created Successfully',
      });
    } catch (e) {
      console.log(e);
      toast({
        title: 'Something went wrong...',
        description: e.error || 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

          <Button className={'md:max-w-min'} disabled={loading} type={'submit'}>
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
    </>
  );
};

export default CreateCustomerForm;
