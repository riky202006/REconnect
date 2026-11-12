import { connectDb, disconnectDb } from '../config/db.js';
import {
  User,
  Resource,
  Request,
  Transaction,
  UserBadge,
  RewardHistory,
  Notification,
  CommunityInfo
} from '../models/index.js';

export async function runMigrations() {
  console.log('Synchronizing MongoDB Atlas schemas & indexes...');
  await connectDb();

  await Promise.all([
    User.syncIndexes(),
    Resource.syncIndexes(),
    Request.syncIndexes(),
    Transaction.syncIndexes(),
    UserBadge.syncIndexes(),
    RewardHistory.syncIndexes(),
    Notification.syncIndexes(),
    CommunityInfo.syncIndexes()
  ]);

  console.log('✓ MongoDB Atlas indexes synchronized successfully.');
}

export default runMigrations;
