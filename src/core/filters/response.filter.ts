import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as CryptoJS from 'crypto-js';
import { LogService } from '../../admin/log/log.service';

@Catch()
export class ResponseFilter extends BaseExceptionFilter {
  constructor(private readonly logService: LogService) {
    super();
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const { body, query, method, headers, connection, url } = ctx.getRequest();
    const { status = 400, message = 'Internal Server Error' } = exception;
    this.logService.create({
      ip: headers['x-forwarded-for'] || connection.remoteAddress,
      userAgent: headers['user-agent'],
      method,
      body: JSON.stringify(body),
      query: JSON.stringify(query),
      url,
      status,
      message,
    });

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
