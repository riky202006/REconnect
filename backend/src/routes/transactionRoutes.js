import { Router } from 'express';
import { transactionController } from '../controllers/transactionController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', transactionController.getAll);
router.get('/:id', transactionController.getById);
router.post('/:id/complete', transactionController.complete);
router.post('/:id/return', transactionController.confirmReturn);

export default router;

