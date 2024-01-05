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
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpException('id格式不合法', HttpStatus.BAD_REQUEST);
    }
    next();
  }
}
