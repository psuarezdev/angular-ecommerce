import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import auth from '../middlewares/auth.middleware';

const router = Router();

router.get('/profile', auth, AuthController.profile);
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;
