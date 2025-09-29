import { err, LimitedValue, ok, Result, safeTryBind } from '@music-ai/common';
import { Recommendations } from '@music-ai/recommendations';
import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';
import { ApplicationTime } from '../time/application-time';
import { TimePassed } from '../time/time.types';
import { RecommendationLimitError } from './recommendation-limit.errors';

@Injectable()
export class RecommendationLimits {
  private _tokens: LimitedValue;
  private _requests: {
    minute: LimitedValue;
    day: LimitedValue;
  };

  constructor(
    private readonly _time: ApplicationTime,
    private readonly _recommendations: Recommendations,
  ) {
    const limits = this._recommendations.limits();

    this._tokens = LimitedValue.zero(limits.tokens.minute);
    this._requests = {
      minute: LimitedValue.zero(limits.requests.minute),
      day: LimitedValue.zero(limits.requests.day),
    };
  }

  public used(tokens: number): void {
    this._tokens = this._tokens.safeIncrement(tokens);
  }

  public increment(type: 'token' | 'request'): void {
    match(type)
      .with('token', () => (this._tokens = this._tokens.safeIncrement(1)))
      .with('request', () => {
        const minutes = this._requests.minute.safeIncrement(1);
        this._requests = {
          minute: minutes,
          day: this._requests.day.safeIncrement(minutes.value),
        };
      });
  }

  public remain(): Result<boolean, RecommendationLimitError> {
    return safeTryBind(this, function* ({ $ }) {
      const { day, minute } = yield* $(
        this._time
          .hasPassed()
          .mapErr((error) => RecommendationLimitError.unableToTrackTime(error)),
      );

      yield* $(
        this._rateLimit(day, this._requests.day).mapErr((error) =>
          RecommendationLimitError.requestPerDay(error),
        ),
      );

      yield* $(
        this._rateLimit(minute, this._requests.minute).mapErr((error) =>
          RecommendationLimitError.requestPerMinute(error),
        ),
      );

      yield* $(
        this._rateLimit(minute, this._tokens).mapErr((error) =>
          RecommendationLimitError.tokens(error),
        ),
      );

      return ok(true);
    });
  }

  public _rateLimit(
    time: TimePassed,
    current: LimitedValue,
  ): Result<boolean, RecommendationLimitError> {
    const result = match(time)
      .with('same_time', () => current.imcomplete())
      .otherwise(() => true);

    return result
      ? ok(true)
      : err(RecommendationLimitError.rateLimit(current.value, current.limit));
  }
}
