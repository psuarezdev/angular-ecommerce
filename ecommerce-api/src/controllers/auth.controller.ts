import { Request, Response } from 'express';
import { UtilsService } from '../lib/utils';
import { JwtService } from '../lib/jwt';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { RegisterDTO, LoginDTO } from '../models/DTOs/auth.dto';

export class AuthController {
  static async login(req: Request, res: Response) {
    const body = req.body as LoginDTO;

    if (!UtilsService.isEmail(body.email)) {
      return res.status(400).json({ message: 'Email format is invalid' });
    }

    try {
      const userFound = await User.findOne({ email: body.email }).populate('role');

      if (!userFound) {
        return res.status(404).json({ message: 'User not found' });
      }

      const passwordMatch = await UtilsService.comparePasswords(body.password, userFound.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const { password, ...user } = userFound.toJSON();

      const token = JwtService.createToken(user);
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(500).json({ message: 'Error logging in' });
    }
  }

  static async register(req: Request, res: Response) {
    const body = req.body as RegisterDTO;
    const errors: Partial<RegisterDTO> = {};

    if (!body.firstName || body.firstName.length < 3) {
      errors.firstName = 'First name must be at least 3 characters';
    }

    if (!body.lastName || body.lastName.length < 3) {
      errors.lastName = 'Last name must be at least 3 characters';
    }

    if (!body.password || body.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if(!body.address || body.address.length < 3) {
      errors.address = 'Address must be at least 3 characters';
    }

    if (!UtilsService.isEmail(body.email)) {
      errors.email = 'Email format is invalid';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    body.password = await UtilsService.hashPassword(body.password);

    const userRole = await Role.findOne({ name: 'user' });

    if (!userRole) {
      return res.status(500).json({ message: 'Error registering user' });
    }

    try {
      const newUser = await User.create({ ...body, role: userRole._id });

      const { password, ...user } = (await newUser.populate('role')).toJSON();
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Error registering user' });
    }
  }

  static async profile(req: Request, res: Response) {
    const authUser = JwtService.getUserFromRequest(req);

    if (!authUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const user = await User.findById(authUser._id)
        .select('-password')
        .populate('favoriteProducts')
        .populate('role');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user.toJSON());
    } catch (error) {
      return res.status(500).json({ message: 'Error getting user profile' });
    }
  }
}
