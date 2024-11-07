import * as z from 'zod';
import { metadataSchema } from './metadata';

export const createPurchaseOrder = z
  .object({
    customerId: z.string(),
    customerName: z.string(),
    dateOfDelivery: z
      .date({
        required_error: 'Date of delivery is required',
      })
      .refine(
        (date) => {
          const today = new Date();
          const tomorrow = new Date(today.setDate(today.getDate()));
          return date >= tomorrow;
        },
        {
          message: 'Date of delivery must be at least 1 day ahead',
        }
      ),
    status: z.enum(['new', 'completed', 'cancelled']),
    amountDue: z.number(),
    cartOrders: z
      .array(
        z.object({
          skuId: z.string(),
          quantity: z.number(),
          price: z.number(),
        })
      )
      .optional(),
  })
  .merge(metadataSchema);

export type CreatePurchaseOrderSchema = z.infer<typeof createPurchaseOrder>;

export const PartialPurchaseOrderSchemaZod = createPurchaseOrder.partial();

export type UpdatePurchaseOrderSchema = z.infer<
  typeof PartialPurchaseOrderSchemaZod
>;

export const purchaseOrderDefaultValues: CreatePurchaseOrderSchema = {
  customerId: '',
  customerName: '',
  dateOfDelivery: new Date(new Date().setDate(new Date().getDate() + 1)),
  status: 'new',
  amountDue: 0,
  cartOrders: [],
};
