import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
@Injectable()
export class RefreshTokenGuard extends AuthGuard('refresh-token') {
  constructor() {
    super();
  }
  getRequest(context: ExecutionContext): Request {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      return ctx.req as Request;
    }
    return context.switchToHttp().getRequest<Request>();
  }
}
