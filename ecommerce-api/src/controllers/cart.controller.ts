import { Request, Response } from 'express';
import { JwtService } from '../lib/jwt';
import { User } from '../models/user.model';
import { Cart } from '../models/cart.model';

export class CartController {
  static async getCart(req: Request, res: Response) {
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userFound = await User.findById(authUser._id).select('-password');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const cart = await Cart.findOne({ user: authUser._id }).populate('products.product');

      if (!cart) {
        const cartCreated = await Cart.create({ user: authUser._id, products: [] });

        if (!cartCreated) {
          return res.status(500).json({ message: 'Error creating cart' });
        }

        return res.status(200).json(cartCreated);
      }

      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting cart' });
    }
  }

  static async addProductToCart(req: Request, res: Response) {
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Missing productId or quantity' });
    }

    try {
      const userFound = await User.findById(authUser._id).select('-password');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      let cart = await Cart.findOne({ user: authUser._id });

      if (!cart) {
        cart = await Cart.create({ user: authUser._id, products: [] });

        if (!cart) {
          return res.status(500).json({ message: 'Error creating cart' });
        }
      }

      const productIndex = cart.products.findIndex(({ product }) => product.toString() === productId);

      if (productIndex === -1) {
        cart.products.push({ product: productId, quantity });
      } else {
        cart.products[productIndex].quantity += quantity as number;
      }

      await cart.save();

      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: 'Error adding product to cart' });
    }
  }

  static async decreaseProductByOne(req: Request, res: Response) {
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Missing Id' });
    }

    try {
      const userFound = await User.findById(authUser._id).select('-password');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const cart = await Cart.findOne({ user: authUser._id });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const productIndex = cart.products.findIndex(({ product }) => product.toString() === id);

      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      if (cart.products[productIndex].quantity === 1) {
        cart.products.splice(productIndex, 1);
      } else {
        cart.products[productIndex].quantity -= 1;
      }

      await cart.save();

      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: 'Error decreasing product quantity' });
    }
  }

  static async removeProductFromCart(req: Request, res: Response) {
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Missing Id' });
    }

    try {
      const userFound = await User.findById(authUser._id).select('-password');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const cart = await Cart.findOne({ user: authUser._id });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const productIndex = cart.products.findIndex(({ product }) => product.toString() === id);

      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      cart.products.splice(productIndex, 1);

      await cart.save();

      return res.status(200).json(cart);
    } catch (error) {
      return res.status(500).json({ message: 'Error removing product from cart' });
    }
  }

  static async clearCart(req: Request, res: Response) {
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userFound = await User.findById(authUser._id).select('-password');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const cart = await Cart.findOne({ user: authUser._id });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const cartUpdated = await Cart.findByIdAndUpdate(cart._id, { products: [] }, { new: true });

      if(!cartUpdated) {
        return res.status(500).json({ message: 'Error clearing cart' });
      }

      return res.status(200).json(cartUpdated);
    } catch (error) {
      return res.status(500).json({ message: 'Error clearing cart' });
    }
  }
}
