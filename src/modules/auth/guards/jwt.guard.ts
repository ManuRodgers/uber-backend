import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    // !The purpose of use of the following code is to replace the jwt strategy
    const request = this.getRequest(context);
    let token = '';
    if ('authToken' in request) {
      token = request['authToken'];
    } else {
      token = request?.get('authorization')?.replace('Bearer', '').trim();
    }
    const result = this.jwtService.verify(token, {
      secret: this.config.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    }) as JwtPayload;
    if (result) {
      request.user = result;
      return true;
    }
  }

  getRequest(context: ExecutionContext): Request {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      return ctx.req as Request;
    }
    return context.switchToHttp().getRequest<Request>();
  }
}
