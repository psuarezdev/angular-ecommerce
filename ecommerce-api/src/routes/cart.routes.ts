import { Router } from 'express';
import auth from '../middlewares/auth.middleware';
import { CartController } from '../controllers/cart.controller';

const router = Router();

router.get('/', auth, CartController.getCart);
router.post('/', auth, CartController.addProductToCart);
router.delete('/clear', auth, CartController.clearCart);
router.delete('/remove/:id', auth, CartController.removeProductFromCart);
router.delete('/decrease/:id', auth, CartController.decreaseProductByOne);

export default router;
