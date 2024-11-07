import { model, models, Model } from 'mongoose';
import connectToDatabase from '../db';
import { CreatePurchaseItemSchema } from '@/schema/purchaseItem';

// Connect to the database
const db = await connectToDatabase();

// Define the Customer schema based on Zod schema fields
const purchaseItem = new db.Schema<CreatePurchaseItemSchema>(
  {
    purchaseOrderId: { type: String, required: true },
    skuId: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },

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
const PurchaseItem: Model<CreatePurchaseItemSchema> =
  models.PurchaseItem ||
  model<CreatePurchaseItemSchema>('PurchaseItem', purchaseItem);

export { PurchaseItem };
