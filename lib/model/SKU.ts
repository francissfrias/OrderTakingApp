import { model, models, Model, Schema } from 'mongoose';
import connectToDatabase from '../db';

// Connect to the database
const db = await connectToDatabase();

interface SkuModelSchema {
  name: string;
  code: string;
  unitPrice: number;
  imageUrl: any[];
  createdBy?: string | undefined;
  dateCreated?: Date | undefined;
  timestamp?: Date | undefined;
  userId?: string | undefined;
  isActive?: boolean | undefined;
}

// Define the SKU schema based on Zod schema fields
const skuSchema = new db.Schema<SkuModelSchema>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
    unitPrice: { type: Number, required: true },
    imageUrl: [Schema.Types.Mixed],

    // Metadata fields
    createdBy: { type: String, required: false },
    dateCreated: { type: Date, required: false, default: Date.now },
    timestamp: { type: Date, required: false, default: Date.now },
    userId: { type: String, required: false },
    isActive: { type: Boolean, required: false, default: true },
  },
  { versionKey: false, timestamps: true }
);

// Use the existing model if it exists, otherwise create a new one
const Sku: Model<SkuModelSchema> =
  models.Sku || model<SkuModelSchema>('Sku', skuSchema);

export { Sku };
