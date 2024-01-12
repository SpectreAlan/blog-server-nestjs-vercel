import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ResponseFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    console.log(exception);
    const { status = 400, message = 'Internal Server Error' } = exception;
    response.status(status).json({
      code: status,
      message,
      data: null,
    });
  }
}
