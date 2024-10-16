import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dbUrl = process.env.MONGO_URI || 'mongodb+srv://API:Harry752861@cluster0.bingluk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/'

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(dbUrl);
    console.log('MongoDB connected', process.env.MONGO_URI);
  } catch (err) {
    console.error('MongoDB connection error:', err, process.env.MONGO_URI);
    process.exit(1);
  }
};

export default connectDB;
