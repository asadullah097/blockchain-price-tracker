import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomHttpException } from './custom.http.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: CustomHttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).send({
      error: exception.error || true,
      statusCode: status,
      message: this.getMessage(exception),
      data: exception.data || null,
      displayMessage: exception.displayMessage || false,
    });
  }

  getMessage(exception) {
    if (exception instanceof BadRequestException) {
      return exception.getResponse()['message'];
    } else {
      return exception.message;
    }
  }
}
