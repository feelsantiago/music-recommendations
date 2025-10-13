import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { match, P } from 'ts-pattern';

export const History = createParamDecorator((_, ctx: ExecutionContextHost) => {
  const http = ctx.switchToHttp();
  const req = http.getRequest();

  return match(req.session.history)
    .with(P.array({ role: P.any }), () => req.session.history)
    .otherwise(() => []);
});
