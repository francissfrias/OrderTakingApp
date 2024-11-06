import * as z from 'zod';
import { metadataSchema } from './metadata';

export const createSku = z
  .object({
    name: z.string(),
    code: z.string(),
    unitPrice: z.number(),
  })
  .merge(metadataSchema);

export type CreateSkuSchema = z.infer<typeof createSku>;

export const PartialSkuSchemaZod = createSku.partial();

export type UpdateSkuSchema = z.infer<typeof PartialSkuSchemaZod>;
