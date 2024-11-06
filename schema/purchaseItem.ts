import * as z from 'zod';
import { metadataSchema } from './metadata';

export const createPurchaseItem = z
  .object({
    purchaseOrderId: z.string(),
    skuId: z.string(),
    quantity: z.number(),
    price: z.number(),
  })
  .merge(metadataSchema);

export type CreatePurchaseItemSchema = z.infer<typeof createPurchaseItem>;

export const PartialPurchaseItemSchemaZod = createPurchaseItem.partial();

export type UpdatePurchaseItemSchema = z.infer<
  typeof PartialPurchaseItemSchemaZod
>;
