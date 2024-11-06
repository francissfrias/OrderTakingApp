import { model, models, Model } from 'mongoose';
import connectToDatabase from '../db';
import { CreateCustomerSchema } from '@/schema/customer';

// Connect to the database
const db = await connectToDatabase();

// Define the Customer schema based on Zod schema fields
const customerSchema = new db.Schema<CreateCustomerSchema>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    city: { type: String, required: true },

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
const Customer: Model<CreateCustomerSchema> =
  models.Customer || model<CreateCustomerSchema>('Customer', customerSchema);

export { Customer };
