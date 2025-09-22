import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Result } from '@sapphire/result';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { match, P } from 'ts-pattern';

@Injectable()
export class ResultInterceptor implements NestInterceptor {
  public intercept(
    _: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      switchMap((response) =>
        match(response)
          .with({ match: P.any }, (result: Result<unknown, Error>) =>
            result.match({
              ok: (data) => of(data),
              err: (error) => throwError(() => error),
            }),
          )
          .otherwise(() => of(response)),
      ),
    );
  }
}
