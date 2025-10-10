import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config()

const dbURI = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process with failure
  }
}

export default connectDB;