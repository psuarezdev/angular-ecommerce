import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import auth from '../middlewares/auth.middleware';

const router = Router();

router.get('/', auth, OrderController.findAll);

export default router;
