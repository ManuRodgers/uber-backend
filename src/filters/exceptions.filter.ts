import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import {
  GqlArgumentsHost,
  GqlContextType,
  GqlExceptionFilter,
} from '@nestjs/graphql';
import type { Request } from 'express';

@Catch()
export class ExceptionsFilter
  extends BaseExceptionFilter
  implements GqlExceptionFilter
{
  private readonly logger: Logger = new Logger();

  public override catch(exception: unknown, host: ArgumentsHost): void {
    let args: unknown;
    if (host.getType<GqlContextType>() === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const {
        body: { operationName, variables },
      } = gqlHost.getContext().req as Request;
      args = `${operationName} ${JSON.stringify(variables)}`;
    } else {
      super.catch(exception, host);
    }
    const status = ExceptionsFilter.getHttpStatus(exception);
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      if (exception instanceof Error) {
        this.logger.error(`${exception.message}: ${args}`, exception.stack);
      } else {
        this.logger.error('UnhandledException', exception);
      }
    }
  }

  private static getHttpStatus(exception: unknown): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
