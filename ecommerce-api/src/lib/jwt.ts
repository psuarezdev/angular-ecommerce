import jwt from 'jsonwebtoken';
import moment from 'moment';
import { Request } from 'express';
import { JWT_SECRET } from '../config';
import { UserDTO } from '../models/DTOs/user.dto';

export interface JwtPayload extends UserDTO {
  iat: number;
  exp: number;
}

export class JwtService {
  static createToken(user: UserDTO | null) {
    if (!JWT_SECRET || !user) return;

    const payload = {
      ...user,
      iat: moment().unix(),
      exp: moment().add(30, 'days').unix()
    };

    return jwt.sign(payload, JWT_SECRET);
  }

  static getUserFromRequest(req: Request) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return;

    const token = authHeader.replace('Bearer ', '').replace(/['"]+/g, '');
    if (!JWT_SECRET || !token) return;

    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  }
}
