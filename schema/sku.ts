import * as z from 'zod';
import { metadataSchema } from './metadata';

export const createSku = z
  .object({
    name: z.string({ required_error: 'Name is required' }).min(3, {
      message: 'Name must be at least 3 characters',
    }),
    code: z.string({ required_error: 'Code is required' }).min(3, {
      message: 'Code must be at least 3 characters',
    }),
    unitPrice: z
      .string({
        required_error: 'Unit price is required',
      })
      .nullable()
      .transform((value, ctx) => {
        const num = parseInt(value ?? '');

        if (isNaN(num)) {
          ctx.addIssue({
            code: 'invalid_type',
            message: 'Unit price must be a number',
            expected: 'number',
            received: typeof value,
          });
          return z.NEVER;
        }

        if (num < 1) {
          ctx.addIssue({
            code: 'invalid_type',
            message: 'Unit price must be at least 1',
            expected: 'number',
            received: typeof value,
          });
          return z.NEVER;
        }

        if (!value) {
          ctx.addIssue({
            code: 'invalid_type',
            message: 'Unit price must be at least 1',
            expected: 'number',
            received: typeof value,
          });
          return z.NEVER;
        }

        return String(num);
      }),
    imageUrl: z
      .array(z.any(), { required_error: 'Image is requireds' })
      .min(1, { message: 'Image is required' }),
    imageBlob: z
      .object({
        url: z.string(),
      })
      .optional(),
  })
  .merge(metadataSchema);

export type CreateSkuSchema = z.infer<typeof createSku>;

export const updateSku = createSku.partial().omit({
  dateCreated: true,
  createdBy: true,
  timestamp: true,
  isActive: true,
  userId: true,
});

export type UpdateSkuSchema = z.infer<typeof updateSku>;

export const skuDefaultValues: CreateSkuSchema = {
  name: '',
  code: '',
  unitPrice: '0',
  imageUrl: [],
};
