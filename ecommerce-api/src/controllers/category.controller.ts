import { Request, Response } from 'express';
import { Category } from '../models/category.nodel';

export class CategoryController {
  static async findAll(_: Request, res: Response) {
    try {
      return res.status(200).json(await Category.find());
    } catch (error) {
      return res.status(500).json({ message: 'Error getting categories' });
    }
  }
}
