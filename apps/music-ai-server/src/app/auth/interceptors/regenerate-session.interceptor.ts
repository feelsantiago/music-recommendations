import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { from, Observable, switchMap } from 'rxjs';

import { promisify } from 'util';

@Injectable()
export class RegenerateSessionInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const req: Request = context.switchToHttp().getRequest();
    const regenerate = promisify(req.session.regenerate.bind(req.session));
    return from(regenerate()).pipe(switchMap(() => next.handle()));
  }
}
