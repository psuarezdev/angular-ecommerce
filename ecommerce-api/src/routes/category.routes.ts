import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router = Router();

router.get('/', CategoryController.findAll);

export default router;
