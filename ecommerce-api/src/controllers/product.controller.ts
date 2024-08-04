import { Request, Response } from 'express';
import { JwtService } from '../lib/jwt';
import { UtilsService } from '../lib/utils';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { ProductDTO } from '../models/DTOs/product.dto';

export class ProductController {
  static async findAll(req: Request, res: Response) {
    const { search, category } = req.query;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (category) {
      query = { category };
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search as string, $options: 'i' } }
        ]
      };
    }

    try {
      const products = await Product.find(query).skip(skip).limit(limit);
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting products' });
    }
  }

  static async findOne(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json(product.toJSON());
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error getting product' });
    }
  }

  static async create(req: Request, res: Response) {
    const body = req.body as Omit<ProductDTO, '_id'>;
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userFound = await User.findById(authUser._id)
        .select('-password')
        .populate('role');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isAdmin = await UtilsService.isUserAdmin(userFound._id);

      if (!isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const newProduct = await Product.create(body);

      if (!newProduct) {
        return res.status(400).json({ message: 'Error creating product' });
      }

      return res.status(201).json(newProduct.toJSON());
    } catch (error) {
      return res.status(500).json({ message: 'Error creating product' });
    }
  }

  static async update(req: Request, res: Response) {
    const body = req.body as Partial<Omit<ProductDTO, '_id'>>;
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userFound = await User.findById(authUser._id)
        .select('-password')
        .populate('role');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isAdmin = await UtilsService.isUserAdmin(userFound._id);

      if (!isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const productFound = await Product.findById(req.params.id);

      if (!productFound) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const productUpdated = await Product.findByIdAndUpdate(
        req.params.id,
        {
          category: body.category ?? productFound.category,
          name: body.name ?? productFound.name,
          price: body.price ?? productFound.price,
          stock: body.stock ?? productFound.stock,
          specifications: body.specifications ?? productFound.specifications,
          images: body.images ?? productFound.images
        },
        { new: true }
      );

      if (!productUpdated) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json(productUpdated.toJSON());
    } catch (error) {
      return res.status(500).json({ message: 'Error updating product' });
    }
  }

  static async favorite(req: Request, res: Response) {
    const id = req.params.id;
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userFound = await User.findById(authUser._id).select('-password');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const productExists = await Product.findById(id);

      if (!productExists) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const isFavorite = userFound.favoriteProducts.includes(id as any);

      if (isFavorite) {
        userFound.favoriteProducts = userFound.favoriteProducts.filter(p => p.toString() !== id);
      } else {
        userFound.favoriteProducts.push(id as any);
      }

      const updatedUser = await User.findByIdAndUpdate(
        userFound._id,
        { favoriteProducts: userFound.favoriteProducts },
        { new: true }
      )
        .select('-password')
        .populate('favoriteProducts');

      if (!updatedUser) {
        return res.status(500).json({ message: 'Error updating favorite products' });
      }

      return res.status(200).json(updatedUser);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating favorite products' });
    }
  }

  static async delete(req: Request, res: Response) {
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userFound = await User.findById(authUser._id).select('-password');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isAdmin = await UtilsService.isUserAdmin(userFound._id);

      if (!isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const productDeleted = await Product.findByIdAndDelete(req.params.id);

      if (!productDeleted) {
        return res.status(404).json({ message: 'Product not found' });
      }

      return res.status(200).json();
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting product' });
    }
  }
}
