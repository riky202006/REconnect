import { Router } from 'express';
import { communityController } from '../controllers/communityController.js';

const router = Router();

router.get('/', communityController.getInfo);

export default router;

