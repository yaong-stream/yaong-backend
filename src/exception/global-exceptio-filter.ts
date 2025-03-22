import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import type {
  Response,
} from "express";

type ErrorResponse = {
  code: string;
  detail: string;
  parameter?: string;
  timestamp: string;
}
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const error: ErrorResponse = {
      code: 'INTERNAL_SERVER_ERROR',
      detail: 'Internal Server Error',
      timestamp: new Date().toISOString(),
    };

    /**
     * class-validator 에러 처리
     */
    if (exception instanceof BadRequestException) {
      status = HttpStatus.BAD_REQUEST;
      const responseBody = exception.getResponse();
      error.code = 'INVALID_PARAMETER';
      if (typeof responseBody === 'object' && 'message' in responseBody && Array.isArray(responseBody['message'])) {
        const message = responseBody['message'][0];
        error.detail = message.detail;
        error.parameter = message.field;
      } else {
        error.detail = responseBody['message'];
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const responseBody = exception.getResponse();
      const message = responseBody['message'];
      error.code = message;
      // error.detail = message;
    }

    response
      .status(status)
      .json({ error });
  }
}
