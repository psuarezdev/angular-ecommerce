import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import auth from '../middlewares/auth.middleware';

const router = Router();

router.get('/', auth, UserController.findAll);
router.get('/:id', auth, UserController.findOne);
router.patch('/:id', auth, UserController.update);
router.delete('/:id', auth, UserController.delete);

export default router;
