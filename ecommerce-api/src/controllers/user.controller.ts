import { Request, Response } from 'express';
import { UtilsService } from '../lib/utils';
import { JwtService } from '../lib/jwt';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { RegisterDTO } from '../models/DTOs/auth.dto';

export class UserController {
  static async findAll(req: Request, res: Response) {
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const isAdmin = await UtilsService.isUserAdmin(authUser._id);

      if (!isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const users = await User.find().select('-password').populate('role');
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching users' });
    }
  }

  static async findOne(req: Request, res: Response) {
    const id = req.params.id;
    const authUser = JwtService.getUserFromRequest(req);

    try {
      const userFound = await User.findById(id)
        .select('-password')
        .populate('favoriteProducts')
        .populate('role');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isAdmin = await UtilsService.isUserAdmin(userFound._id);

      if (!isAdmin && (!authUser || authUser._id.toString() !== id)) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      return res.status(200).json(userFound);
    } catch (error) {
      return res.status(500).json({ message: 'Error getting user' });
    }
  }

  static async create(req: Request, res: Response) {
    const body = req.body as RegisterDTO;
    const authUser = JwtService.getUserFromRequest(req);
    const errors: Partial<RegisterDTO> = {};

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const isAdmin = await UtilsService.isUserAdmin(authUser._id);

      if (!isAdmin) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error creating user' });
    }

    if (!body.firstName || body.firstName.length < 3) {
      errors.firstName = 'First name must be at least 3 characters';
    }

    if (!body.lastName || body.lastName.length < 3) {
      errors.lastName = 'Last name must be at least 3 characters';
    }

    if (!body.address || body.address.length < 3) {
      errors.address = 'Address must be at least 3 characters';
    }

    if (!body.password || body.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!UtilsService.isEmail(body.email)) {
      errors.email = 'Email format is invalid';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }
    try {
      body.password = await UtilsService.hashPassword(body.password);
      const newUser = await User.create({ ...body, favoriteProducts: [] });
      const { password, ...user } = (await newUser.populate('role')).toJSON();
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error creating user' });
    }
  }

  static async update(req: Request, res: Response) {
    const id = req.params.id;
    const body = req.body as Partial<RegisterDTO>;
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userFound = await User.findOne({ _id: id });

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isAdmin = await UtilsService.isUserAdmin(userFound._id);

      if (!isAdmin && authUser._id.toString() !== id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (body.password) {
        body.password = await UtilsService.hashPassword(body.password);
      }

      if (isAdmin && body.role) {
        const roleExists = await Role.findOne({ _id: body.role });

        if (!roleExists) {
          return res.status(404).json({ message: 'Role not found' });
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        userFound._id,
        {
          firstName: body.firstName ?? userFound.firstName,
          lastName: body.lastName ?? userFound.lastName,
          email: body.email ?? userFound.email,
          password: body.password ?? userFound.password,
          address: body.address ?? userFound.address,
          role: isAdmin && body.role ? body.role : userFound.role
        },
        { new: true }
      ).select('-password').populate('role');

      if (!updatedUser) {
        return res.status(500).json({ message: 'Error updating user' });
      }

      const user = updatedUser.toJSON();

      const token = JwtService.createToken(user);

      return res.status(200).json({ user, token });
    } catch (error) {
      console.log('Error:', error);
      return res.status(500).json({ message: 'Error updating user' });
    }
  }

  static async delete(req: Request, res: Response) {
    const id = req.params.id;
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const userFound = await User.findById(id).select('-password');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isAdmin = await UtilsService.isUserAdmin(userFound._id);

      if (!isAdmin && authUser._id.toString() !== id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const deletedUser = await User.findByIdAndDelete(userFound._id);

      if (!deletedUser) {
        return res.status(500).json({ message: 'Error deleting user' });
      }

      return res.status(200).json({ message: 'User deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting user' });
    }
  }
}
