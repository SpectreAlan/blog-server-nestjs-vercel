import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as CryptoJS from 'crypto-js';

@Catch()
export class ResponseFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { status = 400, message = 'Internal Server Error' } = exception;
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify({
        code: status,
        message,
        data: null,
      }),
      process.env.CRYPTO_SECRET_KEY,
    );
    response.status(status).send(encrypted.toString());
  }
}
