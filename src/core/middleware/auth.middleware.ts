import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: any, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1] || '';
    try {
      req.user = verify(token, process.env.SECRET_KEY);
      next();
    } catch (error) {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify({
          code: 401,
          message: '会话已过期，请重新登录',
          data: null,
        }),
        process.env.CRYPTO_SECRET_KEY,
      );
      res.status(401).send(encrypted.toString());
    }
  }
}
