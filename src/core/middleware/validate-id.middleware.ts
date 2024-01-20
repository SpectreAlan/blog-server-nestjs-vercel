import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as mongoose from 'mongoose';

@Injectable()
export class ValidateIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ids = req.params?.id?.split(',');
    if (!ids.length) {
      throw new HttpException('id不能为空', HttpStatus.BAD_REQUEST);
    }
    for (let i = 0; i < ids.length; i++) {
      if (!mongoose.Types.ObjectId.isValid(ids[i])) {
        throw new HttpException('id格式不合法', HttpStatus.BAD_REQUEST);
      }
    }
    next();
  }
}
