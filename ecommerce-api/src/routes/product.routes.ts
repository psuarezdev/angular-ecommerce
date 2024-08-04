import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';

const router = Router();

router.get('/', ProductController.findAll);
router.get('/:id', ProductController.findOne);
router.post('/', ProductController.create);
router.patch('/:id', ProductController.update);
router.patch('/:id/favorite', ProductController.favorite);
router.delete('/:id', ProductController.delete);

export default router;
