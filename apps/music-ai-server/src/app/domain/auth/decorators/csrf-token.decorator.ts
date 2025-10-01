import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const CsrfToken = createParamDecorator((_, ctx: ExecutionContext) => {
  const http = ctx.switchToHttp();
  const req: Request = http.getRequest();

  return req.csrfToken({ overwrite: true });
});
