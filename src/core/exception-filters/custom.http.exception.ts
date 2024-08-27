import { HttpException } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  public statusCode: number;
  public error: boolean;
  public message: string;
  public displayMessage: boolean;
  public data: any;

  constructor(
    code: number,
    message: string,
    displayMessage?: boolean,
    error?: boolean,
    data?: any,
  ) {
    super(message, code);
    this.statusCode = code;
    this.message = message;
    this.displayMessage = displayMessage;
    this.error = error;
    this.data = data;
  }
}
