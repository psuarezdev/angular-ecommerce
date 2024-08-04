import { Request, Response } from 'express';
import { JwtService } from '../lib/jwt';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';

export class OrderController {
  static async findAll(req: Request, res: Response) {
    const authUser = JwtService.getUserFromRequest(req);

    if(!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userFound = await User.findById(authUser._id).select('-password');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const orders = await Order.find({ user: authUser._id }).populate('products.product');

      if(!orders) {
        return res.status(404).json({ message: 'Orders not found' });
      }

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting orders' });
    }
  }
}
