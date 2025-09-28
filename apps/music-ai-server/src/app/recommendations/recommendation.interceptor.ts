import { isRecommendationError } from '@music-ai/recommendations';
import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { Result } from '@sapphire/result';
import { Observable, of, switchMap, throwError } from 'rxjs';
import { match } from 'ts-pattern';

@Injectable()
export class RecommendationInterceptor implements NestInterceptor {
  public intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return next.handle().pipe(
      switchMap((data) => {
        if (Result.isResult(data)) {
          return data.match({
            ok: (value) => of(value),
            err: (error) => throwError(() => this._httpError(error)),
          });
        }

        return of(data);
      }),
    );
  }

  private _httpError(error: unknown): HttpException {
    if (isRecommendationError(error)) {
      return match(error.type)
        .with(
          'recommendation_generation',
          () => new BadRequestException(error.message, { cause: error }),
        )
        .with(
          'invalid_recommendation',
          () => new BadRequestException(error.message, { cause: error }),
        )
        .exhaustive();
    }

    return new InternalServerErrorException('Unexpected error', {
      cause: error,
    });
  }
}
