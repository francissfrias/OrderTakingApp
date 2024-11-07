import { model, models, Model, Schema } from 'mongoose';
import connectToDatabase from '../db';
import { CreatePurchaseOrderSchema } from '@/schema/purchaseOrder';

// Connect to the database
const db = await connectToDatabase();

// Define the Customer schema based on Zod schema fields
const purchaseOrder = new db.Schema<CreatePurchaseOrderSchema>(
  {
    customerId: { type: String, required: true },
    customerName: { type: String, required: true },
    dateOfDelivery: { type: Date, required: true },
    status: { type: String, required: true },
    amountDue: { type: Number, required: true },
    cartOrders: [Schema.Types.Mixed],

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
const PurchaseOrder: Model<CreatePurchaseOrderSchema> =
  models.PurchaseOrder ||
  model<CreatePurchaseOrderSchema>('PurchaseOrder', purchaseOrder);

export { PurchaseOrder };
