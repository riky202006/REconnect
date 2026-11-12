import { Router } from 'express';
import { requestController } from '../controllers/requestController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.use(authenticate);

router.get('/', requestController.getAll);
router.post('/', requestController.create);
router.patch('/:id/status', requestController.updateStatus);
router.delete('/:id', requestController.cancel);

export default router;

