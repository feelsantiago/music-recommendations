import { AppError, AppErrorOptions } from '@music-ai/common';

export type RecommendationRateLimitErrorName =
  | 'rate_limit_exceeded'
  | 'request_per_minute_exceeded'
  | 'request_per_day_exceeded'
  | 'tokens_per_minutes_exceeded';

export class RecommendationRateLimitError extends AppError {
  constructor(
    public readonly type: RecommendationRateLimitErrorName,
    message: string,
    options: Omit<AppErrorOptions, 'name'> = {},
  ) {
    super(message, { ...options, name: type });
  }

  public static rateLimit(): RecommendationRateLimitError {
    return new RecommendationRateLimitError(
      'rate_limit_exceeded',
      'Rate limit exceeded, please try again later.',
    );
  }

  public static requestPerMinute(): RecommendationRateLimitError {
    return new RecommendationRateLimitError(
      'request_per_minute_exceeded',
      'Request per minute exceeded. Please try again later.',
    );
  }

  public static requestPerDay(): RecommendationRateLimitError {
    return new RecommendationRateLimitError(
      'request_per_day_exceeded',
      'Request per day exceeded. Please try again tomorrow.',
    );
  }

  public static tokens(): RecommendationRateLimitError {
    return new RecommendationRateLimitError(
      'tokens_per_minutes_exceeded',
      'Tokens per minutes exceeded. Please try again later.',
    );
  }
}
