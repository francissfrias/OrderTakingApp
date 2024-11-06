import * as z from 'zod';
import { metadataSchema } from './metadata';

export const createPurchaseOrder = z
  .object({
    customerId: z.string(),
    dateOfDelivery: z.date(),
    status: z.enum(['new', 'completed', 'cancelled']),
    amountDue: z.number(),
    cartOrders: z.array(
      z.object({
        skuId: z.string(),
        quantity: z.number(),
        price: z.number(),
      })
    ),
  })
  .merge(metadataSchema);

export type CreatePurchaseOrderSchema = z.infer<typeof createPurchaseOrder>;

export const PartialPurchaseOrderSchemaZod = createPurchaseOrder.partial();

export type UpdatePurchaseOrderSchema = z.infer<
  typeof PartialPurchaseOrderSchemaZod
>;
