import { Option } from '@music-ai/common';
import { createParamDecorator } from '@nestjs/common';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { match, P } from 'ts-pattern';

export const History = createParamDecorator((_, ctx: ExecutionContextHost) => {
  const http = ctx.switchToHttp();
  const req = http.getRequest();
  const tags = Option.from<string[]>(req.session.tags).unwrapOr([]);
  const body = Option.from<string[]>(req.body.tags).unwrapOr([]);
  const type = Option.from<string>(req.body.type).unwrapOr('');

  const history = match(req.session.history)
    .with(P.array({ role: P.any }), () => req.session.history)
    .otherwise(() => []);

  const sameTags = body.every((tag) => tags.includes(tag));
  const sameType = type === req.session.type;

  return sameTags && sameType ? history : [];
});
