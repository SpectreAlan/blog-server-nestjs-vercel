import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';

export const formatResponseDate = (time: Date): string => {
  return time.toISOString().replace('T', ' ').substring(0, 19);
};
export const formatResponseData = (data: any): unknown => {
  if (!data || !data?._id) {
    return data;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, __v = '', ...res } = data;
  res.id = _id;
  const { updatedAt = '', createdAt = '', ...other } = res;
  if (!createdAt || !updatedAt) {
    return res;
  }
  return {
    ...other,
    createdAt: formatResponseDate(createdAt),
    updatedAt: formatResponseDate(updatedAt),
  };
};

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(({ data = null, message = 'success' }) => {
        if (data?.list) {
          data.list = data.list.map((item) =>
            formatResponseData(item?.toObject?.() ?? item),
          );
        } else {
          data = formatResponseData(data?.toObject?.() ?? data);
        }
        const encrypted = CryptoJS.AES.encrypt(
          JSON.stringify({
            code: 0,
            message,
            data,
          }),
          process.env.CRYPTO_SECRET_KEY,
        );
        return encrypted.toString();
      }),
    );
  }
}
