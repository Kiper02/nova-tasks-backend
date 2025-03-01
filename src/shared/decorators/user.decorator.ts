import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

export const Authorized = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const requst = ctx.switchToHttp().getRequest();
    const user = requst.user;

    return data ? user[data] : user;
  },
);
