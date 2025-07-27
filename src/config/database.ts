import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    // Use MONGODB_URI environment variable (should be set to Atlas connection string in production)
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    console.log('🔍 Environment variables check:');
    console.log('- MONGODB_URI:', process.env.MONGODB_URI ? 'SET' : 'NOT SET');
    console.log('- Final mongoURI being used:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//[USER]:[PASSWORD]@')); // Hide credentials
    
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database name: ${conn.connection.db?.databaseName || 'undefined'}`);
    console.log(`🔗 Connection string used: ${mongoURI.split('/').pop()?.split('?')[0]}`); // Show only DB name part
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
