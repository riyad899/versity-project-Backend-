import mongoose from 'mongoose';
import envVars from '../../config/env.js';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(envVars.databaseUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
