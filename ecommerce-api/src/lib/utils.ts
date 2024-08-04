import { Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { RoleDTO } from '../models/DTOs/role.dto';

export class UtilsService {
  static isEmail(email: string) {
    const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regex.test(email);
  }

  static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  static async comparePasswords(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      return false;
    }
  }

  static async isUserAdmin(userId: Types.ObjectId) {
    const user = await User.findOne({ _id: userId }).populate('role');
    if (!user) return false;
    return (user.role as unknown as RoleDTO).name === 'admin';
  }
}
