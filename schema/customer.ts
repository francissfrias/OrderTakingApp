import * as z from 'zod';
import { metadataSchema } from './metadata';

export const createCustomer = z
  .object({
    firstName: z.string({ required_error: 'First Name is required' }).min(2, {
      message: 'First Name must be at least 2 characters long',
    }),
    lastName: z.string({ required_error: 'Last Name is required' }).min(2, {
      message: 'Last Name must be at least 2 characters long',
    }),
    mobileNumber: z
      .string({
        required_error: 'Mobile number is required',
      })
      .regex(/[0-9]/, { message: 'Mobile number must be 10 digits' })
      .min(10, { message: 'Phone number must be 10 digits' })
      .max(10, { message: 'Phone number must be 10 digits' }),
    city: z.string({ required_error: 'City is required' }).min(2, {
      message: 'City must be at least 2 characters long',
    }),
  })
  .merge(metadataSchema);

export type CreateCustomerSchema = z.infer<typeof createCustomer>;

export const PartialCustomerSchemaZod = createCustomer.partial();

export type UpdateCustomerSchema = z.infer<typeof PartialCustomerSchemaZod>;

export const customerDefaultValues: CreateCustomerSchema = {
  firstName: '',
  lastName: '',
  mobileNumber: '',
  city: '',
};
