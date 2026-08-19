import mongoose from 'mongoose';

export const connectDB = async (): Promise<boolean> => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ MONGODB_URI not provided. Operating in zero-latency In-Memory MERN Database mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ [MongoDB Atlas] Connected successfully to host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.log('⚠️ [MongoDB Atlas] Connection notice:', error?.message || error);
    console.log('ℹ️ Using high-speed In-Memory MERN fallback. Tip: Ensure IP 0.0.0.0/0 is added in MongoDB Atlas Network Access.');
    return false;
  }
};

