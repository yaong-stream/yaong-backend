import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import {
  WsException,
} from '@nestjs/websockets';
import {
  ValidationError,
} from 'class-validator';
import {
  type Socket,
} from 'socket.io';

type ErrorResponse = {
  code: string;
  detail: string;
  parameter?: string;
  timestamp: string;
}

@Catch(WsException)
export class SocketExceptionFilter implements ExceptionFilter {

  private readonly logger = new Logger(SocketExceptionFilter.name);

  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const error = exception.getError();
    const response: ErrorResponse = {
      code: 'INTERNAL_SERVER_ERROR',
      detail: JSON.stringify(error),
      timestamp: new Date().toISOString(),
    };
    if (Array.isArray(error)) {
      error.forEach((err) => {
        if (err instanceof ValidationError) {
          response.code = 'INVALID_PARAMETER';
          response.parameter = err.property;
          response.detail = Object.values(err.constraints || {})[0];
        }
      });
    }
    client.emit('exception', response);
  }
}
