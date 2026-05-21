import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const response = http.getResponse();

    return next.handle().pipe(
      map((data) => {
        const obj = {
          success: true,
          code: data?.code || "SUCCESS",
          statusCode: response.statusCode,
          timestamp: new Date().toISOString(),
          data: data?.data,
        };

        if (data?.isPaginate) {
          return {
            ...obj,
            meta: {
              total: data.meta.total,
              page: data.meta.page,
              limit: data.meta.limit,
            },
          };
        }

        return obj;
      }),
    );
  }
}