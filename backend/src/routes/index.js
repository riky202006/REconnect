import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import requestRoutes from './requestRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import communityRoutes from './communityRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import { db } from '../config/db.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  const connected = db.isDbConnected();
  if (connected) {
    return res.json({
      status: 'ok',
      database: 'mongodb',
      databaseConnected: true,
      timestamp: new Date().toISOString()
    });
  } else {
    return res.status(503).json({
      status: 'error',
      database: 'mongodb',
      databaseConnected: false,
      message: 'MongoDB Atlas is not connected',
      timestamp: new Date().toISOString()
    });
  }
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/resources', resourceRoutes);
router.use('/requests', requestRoutes);
router.use('/transactions', transactionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/community', communityRoutes);
router.use('/upload', uploadRoutes);

export default router;
