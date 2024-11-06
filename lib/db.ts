import mongoose, { Mongoose } from 'mongoose';

// Cached connection to avoid multiple connections to the database
let cachedDb: Mongoose | null = null;

/**
 * Connect to the MongoDB database using Mongoose.
 * This is a wrapper around the Mongoose connect function that caches the database connection so it can be reused.
 * @return {Promise<Mongoose>} A promise that resolves to the MongoDB database.
 * @note You must use await when calling this function or the promise syntax with .then() and .catch().
 */
const connectToDatabase = async (): Promise<Mongoose> => {
  // If cachedDb is already defined, return it to reuse the existing connection
  if (cachedDb) {
    return cachedDb;
  }

  /*
  Connect to the MongoDB database using Mongoose
  The connection string is constructed from environment variables
  */
  const db = await mongoose.connect(process.env.MONGODB_URI as string, {
    writeConcern: { w: 'majority' },
  });

  /*
  Cache the database connection and return it
  This ensures that the same connection is reused across multiple requests,
  minimizing the overhead of connecting to the database
  */
  cachedDb = db;
  return db;
};

export default connectToDatabase;
