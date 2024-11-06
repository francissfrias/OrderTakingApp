import mongoose, { Schema, Document } from 'mongoose';

export interface PurchaseItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  purchaseDate: Date;
}
const PurchaseItemSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
});

export const PurchaseItemModel = mongoose.model<PurchaseItem & Document>(
  'PurchaseItem',
  PurchaseItemSchema
);
