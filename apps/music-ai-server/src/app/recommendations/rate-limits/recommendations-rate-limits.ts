import { AppError, ok, Result, safeTryBind } from '@music-ai/common';
import {
  RecommendationResponse,
  Recommendations,
} from '@music-ai/recommendations';
import { ApplicationTime, TimePassed } from '@music-ai/time-tracker';
import { Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';
import { RateLimit } from './rate-limit';
import { RecommondationRateLimitsState } from './recommendations-rate-limits.types';

@Injectable()
export class RecommendationRateLimits {
  private _state: RecommondationRateLimitsState = 'available';

  private readonly _tokens: RateLimit;
  private readonly _requests: {
    minute: RateLimit;
    day: RateLimit;
  };

  constructor(
    private readonly _time: ApplicationTime,
    private readonly _recommendations: Recommendations,
  ) {
    const { tokens, requests } = this._recommendations.limits();
    this._tokens = RateLimit.create(tokens.minute);
    this._requests = {
      minute: RateLimit.create(requests.minute),
      day: RateLimit.create(requests.day),
    };
  }

  public available(): Result<RecommondationRateLimitsState, AppError> {
    return safeTryBind(this, function* ({ $ }) {
      const { day, minute } = yield* $(this._time.hasPassed());
      const state = match(this._state)
        .with('available', () => this._state)
        .with('tokens_per_minutes_exceeded', () =>
          this._availability(minute, this._tokens),
        )
        .with('requests_per_minutes_exceeded', () =>
          this._availability(minute, this._requests.minute),
        )
        .with('requests_per_day_exceeded', () =>
          this._availability(day, this._requests.day),
        )
        .exhaustive();

      this._state = state;
      return ok(state);
    });
  }

  public used({ metadata: { tokens } }: RecommendationResponse): void {
    this._tokens.add(tokens);
    this._requests.minute.increment();
    this._requests.day.increment();

    if (this._tokens.available()) {
      this._state = 'tokens_per_minutes_exceeded';
    }

    if (this._requests.minute.available()) {
      this._state = 'requests_per_minutes_exceeded';
    }

    if (this._requests.day.available()) {
      this._state = 'requests_per_day_exceeded';
    }
  }

  private _availability(
    time: TimePassed,
    rate: RateLimit,
  ): RecommondationRateLimitsState {
    rate.update(time);
    return rate.available() ? 'available' : this._state;
  }
}
