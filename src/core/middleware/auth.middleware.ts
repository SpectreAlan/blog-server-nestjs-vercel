import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    try {
      req.user = verify(token, process.env.SECRET_KEY);
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: '会话已过期，请重新登录', code: 401, data: null });
    }
  }
}
