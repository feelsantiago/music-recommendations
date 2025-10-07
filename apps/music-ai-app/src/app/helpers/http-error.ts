import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { AppError, Option } from '@music-ai/common';
import { MessageService } from 'primeng/api';
import {
  catchError,
  MonoTypeOperatorFunction,
  pipe,
  tap,
  throwError,
} from 'rxjs';

export function toAppError<T>(): MonoTypeOperatorFunction<T> {
  return pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        const message = Option.from(error.error.message);
        const name = Option.from(error.error.type);

        return throwError(() =>
          AppError.create(message.unwrapOr(error.message), {
            name: name.unwrapOr(error.name),
            source: error,
          }),
        );
      }

      return throwError(() =>
        AppError.create('Unknow error', { source: error }),
      );
    }),
  );
}

export function notifyError<T>(
  injector: Injector,
): MonoTypeOperatorFunction<T> {
  return pipe(
    tap({
      error: (error) => {
        runInInjectionContext(injector, () => {
          const message = inject(MessageService);
          message.add({
            severity: 'error',
            summary: 'Error',
            detail: error.message,
          });
        });
      },
    }),
  );
}
