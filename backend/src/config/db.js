import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './env.js';

// Configure public DNS servers to prevent SRV lookup failures on Windows/certain local routers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Use default system DNS if setServers is restricted
}

let isConnecting = false;

/**
 * Initialize centralized MongoDB Atlas connection via Mongoose
 */
export async function connectDb() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (isConnecting) {
    return;
  }

  const uri = env.mongodbUri;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined. Please set it in backend/.env');
  }

  try {
    isConnecting = true;
    console.log('Connecting to MongoDB Atlas...');

    const connectionOptions = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      autoIndex: true
    };

    await mongoose.connect(uri, connectionOptions);
    console.log(`✓ Connected successfully to MongoDB Atlas database [${mongoose.connection.name}].`);
    return mongoose.connection;
  } catch (err) {
    console.error('⚠️ MongoDB Atlas connection error:', err.message);
    throw new Error(`MongoDB connection failed: ${err.message}`);
  } finally {
    isConnecting = false;
  }
}

/**
 * Close MongoDB connection gracefully
 */
export async function disconnectDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('✓ MongoDB connection disconnected.');
  }
}

/**
 * Check if MongoDB connection is active
 */
export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}

export function getDbEngine() {
  return 'mongodb';
}

// Connection event monitors
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection established.');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose connection disconnected.');
});

export const db = {
  connectDb,
  disconnectDb,
  isDbConnected,
  getDbEngine,
  connection: mongoose.connection
};

export default db;
