import { Router } from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import resourceRoutes from './resourceRoutes.js';
import requestRoutes from './requestRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import communityRoutes from './communityRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import db from '../config/db.js';

const router = Router();

// Health check endpoint
router.get('/health', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT 1 as healthy');
    return res.json({
      status: 'ok',
      database: db.getDbEngine(),
      databaseConnected: rows.length > 0,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      database: db.getDbEngine(),
      message: err.message
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

