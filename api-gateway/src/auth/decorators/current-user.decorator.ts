import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type RequestWithUser = {
  user?: unknown;
};

export const CurrentUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    return request.user;
  },
);
