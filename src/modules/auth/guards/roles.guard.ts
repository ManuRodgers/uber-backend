import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { AllowedRole, ROLES_KEY } from 'src/decorators/role.decorator';
import { JwtPayload } from 'src/modules/auth/dto/jwt-payload.dto';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const roles = this.reflector.getAllAndOverride<AllowedRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      throw new Error('Roles not defined');
    }
    if (roles.includes('ANY')) {
      return true;
    }
    const request = this.getRequest(context);
    const jwtPayload = request.user as JwtPayload;
    const currentUser = await this.userService.getUserById(jwtPayload.sub);
    return roles.includes(currentUser.role);
  }

  getRequest(context: ExecutionContext): Request {
    if (context.getType<GqlContextType>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context).getContext();
      return ctx.req as Request;
    }
    return context.switchToHttp().getRequest<Request>();
  }
}
