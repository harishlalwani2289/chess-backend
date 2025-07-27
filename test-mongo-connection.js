const mongoose = require('mongoose');

// Test the MongoDB connection string format
const testConnection = async () => {
  const mongoURI = 'mongodb+srv://harishlalwani2289:QyHbz5agvdoVagjp@cluster0.z4gweuh.mongodb.net/chess-game';
  
  console.log('🧪 Testing MongoDB connection...');
  console.log('URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//[USER]:[PASSWORD]@'));
  
  try {
    const conn = await mongoose.connect(mongoURI);
    console.log('✅ Connection successful!');
    console.log('📊 Database name:', conn.connection.db.databaseName);
    console.log('🏠 Host:', conn.connection.host);
    console.log('🆔 Connection ID:', conn.connection.id);
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

testConnection();
