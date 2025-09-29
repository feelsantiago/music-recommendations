import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { match } from 'ts-pattern';
import { RecommendationLimitError } from './recommendation-limit.errors';
import { RecommendationLimits } from './recommendation-limits';

@Injectable()
export class RecommendationLimitGuard implements CanActivate {
  constructor(private readonly _limits: RecommendationLimits) {}

  public canActivate(_: ExecutionContext): boolean {
    return this._limits
      .remain()
      .inspect(() => this._limits.increment('request'))
      .match({
        ok: () => true,
        err: (error) => this._error(error),
      });
  }

  private _error(error: RecommendationLimitError): never {
    const exception = match(error.type)
      .with(
        'unable_to_track_time',
        () =>
          new InternalServerErrorException({
            type: error.type,
            message:
              'The system is unable to track agent recommendations rate limits.',
          }),
      )
      .with(
        'request_per_day_exceeded',
        () =>
          new UnauthorizedException({
            type: error.type,
            message:
              'You have exceeded the maximum number of requests per day.',
          }),
      )
      .with(
        'request_per_minute_exceeded',
        () =>
          new UnauthorizedException({
            type: error.type,
            message:
              'You have exceeded the maximum number of requests per minute. Please wait and try again.',
          }),
      )
      .with(
        'rate_limit_exceeded',
        () =>
          new UnauthorizedException({
            type: error.type,
            message: 'You have exceeded the maximum number requests',
          }),
      )
      .with(
        'tokens_per_minutes_exceeded',
        () =>
          new UnauthorizedException({
            type: error.type,
            message:
              'You have exceeded the maximum number of tokens per minute. Please wait and try again.',
          }),
      )
      .exhaustive();

    throw exception;
  }
}
