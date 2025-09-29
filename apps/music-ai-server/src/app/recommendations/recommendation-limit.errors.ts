import { AppError, AppErrorOptions } from '@music-ai/common';

export type RecommendationLimitErrorName =
  | 'unable_to_track_time'
  | 'rate_limit_exceeded'
  | 'request_per_minute_exceeded'
  | 'request_per_day_exceeded'
  | 'tokens_per_minutes_exceeded';

export class RecommendationLimitError extends AppError {
  constructor(
    public readonly type: RecommendationLimitErrorName,
    message: string,
    options: Omit<AppErrorOptions, 'name'> = {},
  ) {
    super(message, { ...options, name: type });
  }

  public static unableToTrackTime(source: AppError): RecommendationLimitError {
    return new RecommendationLimitError(
      'unable_to_track_time',
      'Unable to track time',
      {
        source,
      },
    );
  }

  public static rateLimit(
    value: number,
    limit: number,
  ): RecommendationLimitError {
    return new RecommendationLimitError(
      'rate_limit_exceeded',
      'Rate limit exceeded',
      {
        metadata: {
          value,
          limit,
        },
      },
    );
  }

  public static requestPerMinute(
    source: RecommendationLimitError,
  ): RecommendationLimitError {
    return new RecommendationLimitError(
      'request_per_minute_exceeded',
      'Request per minute exceeded',
      {
        source,
      },
    );
  }

  public static requestPerDay(
    source: RecommendationLimitError,
  ): RecommendationLimitError {
    return new RecommendationLimitError(
      'request_per_day_exceeded',
      'Request per day exceeded',
      {
        source,
      },
    );
  }

  public static tokens(
    source: RecommendationLimitError,
  ): RecommendationLimitError {
    return new RecommendationLimitError(
      'tokens_per_minutes_exceeded',
      'Tokens per minutes exceeded',
      {
        source,
      },
    );
  }
}
