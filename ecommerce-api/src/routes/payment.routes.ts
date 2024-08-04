import { Router, raw } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import auth from '../middlewares/auth.middleware';

const router = Router();

router.post('/create-session', auth, PaymentController.createSession);
router.post('/webhook', raw({ type: 'application/json' }), PaymentController.webhook);

export default router;
