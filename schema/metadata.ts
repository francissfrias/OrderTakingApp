import * as z from 'zod';

export const metadataSchema = z.object({
  dateCreated: z.date().optional(),
  createdBy: z.string().optional(),
  timestamp: z.date().optional(),
  isActive: z.boolean().optional(),
  userId: z.string().optional(),
});

export type MetadataSchema = z.infer<typeof metadataSchema>;
