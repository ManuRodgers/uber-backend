import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentRefreshToken = createParamDecorator(
  (data: unknown, context: ExecutionContext) =>
    GqlExecutionContext.create(context).getContext().req.user.refreshToken,
);
