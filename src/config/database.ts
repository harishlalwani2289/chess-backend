import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // Use cloud database by default, fallback to local if cloud is not available
    const mongoURI = process.env.MONGODB_URI_CLOUD || process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
