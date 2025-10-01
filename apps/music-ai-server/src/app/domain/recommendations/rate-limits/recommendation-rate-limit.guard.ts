import { err, ok } from '@music-ai/common';
import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { match } from 'ts-pattern';
import { RecommendationRateLimitError } from './recommendation-rate-limit.errors';
import { RecommendationRateLimits } from './recommendations-rate-limits';

@Injectable()
export class RecommendationRateLimitGuard implements CanActivate {
  constructor(private readonly _limits: RecommendationRateLimits) {}

  public canActivate(_: ExecutionContext): boolean {
    return this._limits
      .available()
      .mapErr(() => RecommendationRateLimitError.rateLimit())
      .andThen((state) =>
        match(state)
          .with('available', () => ok(true))
          .with('tokens_per_minutes_exceeded', () =>
            err(RecommendationRateLimitError.tokens()),
          )
          .with('requests_per_minutes_exceeded', () =>
            err(RecommendationRateLimitError.requestPerMinute()),
          )
          .with('requests_per_day_exceeded', () =>
            err(RecommendationRateLimitError.requestPerDay()),
          )
          .exhaustive(),
      )
      .match({
        ok: () => true,
        err: (error: RecommendationRateLimitError) => {
          throw new HttpException(
            {
              type: error.type,
              message: error.message,
            },
            HttpStatus.TOO_MANY_REQUESTS,
          );
        },
      });
  }
}
