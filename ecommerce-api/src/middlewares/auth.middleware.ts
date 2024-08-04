import moment from 'moment';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../lib/jwt';

export default function auth(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    const payload = JwtService.getUserFromRequest(req);

    if (!payload || payload.exp <= moment().unix()) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    return next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }
}
