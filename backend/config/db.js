import mongoose from 'mongoose';

/**
 * Reusable MongoDB Connection Function using Mongoose
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Error] Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
