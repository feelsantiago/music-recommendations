import {
  CallHandler,
  ExecutionContext,
  HttpException,
  NestInterceptor,
} from '@nestjs/common';
import { Result } from '@sapphire/result';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { AppError } from './app-error';

export abstract class AppErrorInterceptor<T extends AppError>
  implements NestInterceptor
{
  public intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      switchMap((data) => {
        if (Result.isResult(data)) {
          return data.match({
            ok: (value) => of(value),
            err: (error) => throwError(() => this.transform(error as T)),
          });
        }

        if (data instanceof AppError) {
          return throwError(() => this.transform(data as T));
        }

        if (data instanceof Error) {
          return throwError(() => data);
        }

        return of(data);
      }),
    );
  }

  public abstract transform(error: T): HttpException;
}
