import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseInterface } from '../interfaces/response.interface';

const IgnoredPropertyName = Symbol('IgnoredPropertyName');

export function SkipResponseTransformInterceptor() {
  return function (
    target,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    descriptor.value[IgnoredPropertyName] = true;
  };
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ResponseInterface>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseInterface> {
    const isIgnored = context.getHandler()[IgnoredPropertyName];
    if (isIgnored) {
      return next.handle();
    }
    return next.handle().pipe(
      map((response) => ({
        error: response?.error == true || false,
        statusCode: this.setStatusCode(response.statusCode, context),
        // code: response.code,
        message: response.message,
        displayMessage: response?.displayMessage || false,
        data: response.data || null,
      })),
    );
  }

  setStatusCode(code, context) {
    context.switchToHttp().getResponse().status(code);
    return code;
  }
}
