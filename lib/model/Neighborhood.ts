import {  model, models, Model, Document } from 'mongoose';
import connectToDatabase from '../db';

// Connect to the database
const db = await connectToDatabase();

interface INeighborhood extends Document {
  name: string;
}

// Define the Neighborhood schema
const neighborhoodSchema = new db.Schema<INeighborhood>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

// Use the existing model if it exists, otherwise create a new one
const Neighborhood: Model<INeighborhood> = models.Neighborhood || model<INeighborhood>('Neighborhood', neighborhoodSchema);

export { Neighborhood };
