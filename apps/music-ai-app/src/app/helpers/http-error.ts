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
          AppError.create(
            message.unwrapOr(
              'Recommendations are unavailable at the moment! Please try again later...',
            ),
            {
              name: name.unwrapOr('Unexpected Error'),
              source: error,
            },
          ),
        );
      }

      return throwError(() =>
        AppError.create(
          'Recommendations are unavailable at the moment! Please try again later...',
          { source: error },
        ),
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
