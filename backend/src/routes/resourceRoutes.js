import { Router } from 'express';
import { resourceController } from '../controllers/resourceController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.get('/', resourceController.getAll);
router.get('/:id', resourceController.getById);
router.post('/', authenticate, resourceController.create);
router.put('/:id', authenticate, resourceController.update);
router.patch('/:id/status', authenticate, resourceController.updateStatus);
router.delete('/:id', authenticate, resourceController.delete);

export default router;

