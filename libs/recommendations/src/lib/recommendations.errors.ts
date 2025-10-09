import { AppError, AppErrorOptions } from '@music-ai/common';

export type RecommendationErrorName =
  | 'recommendation_generation'
  | 'invalid_recommendation';

export type RecommendationStreamingErrorName =
  | 'service_unavailable'
  | 'streaming_error';

export class RecommendationError extends AppError {
  private constructor(
    public readonly type: RecommendationErrorName,
    message: string,
    options: Omit<AppErrorOptions, 'name'> = {},
  ) {
    super(message, { ...options, name: type });
  }

  public static generate(
    source: AppError,
    options: Omit<AppErrorOptions, 'name' | 'source'> = {},
  ): RecommendationError {
    return new RecommendationError(
      'recommendation_generation',
      '[Recommendation] - Unable to generate recommendation',
      {
        ...options,
        source,
      },
    );
  }

  public static invalid(
    source: AppError,
    options: Omit<AppErrorOptions, 'name' | 'source'> = {},
  ): RecommendationError {
    return new RecommendationError(
      'invalid_recommendation',
      '[Recommendation] - Invalid recommendation data',
      {
        ...options,
        source,
      },
    );
  }
}

export class RecommendationStreamingError extends AppError {
  private constructor(
    public readonly type: RecommendationStreamingErrorName,
    message: string,
    options: Omit<AppErrorOptions, 'name'> = {},
  ) {
    super(message, { ...options, name: type });
  }

  public static unavailable(
    source: AppError,
    options: Omit<AppErrorOptions, 'name' | 'source'> = {},
  ): RecommendationStreamingError {
    return new RecommendationStreamingError(
      'service_unavailable',
      '[Recommendaton Streaming] - Service is unavailable',
      {
        ...options,
        source,
      },
    );
  }

  public static error(
    source: AppError,
    options: Omit<AppErrorOptions, 'name' | 'source'> = {},
  ): RecommendationStreamingError {
    return new RecommendationStreamingError(
      'service_unavailable',
      '[Recommendaton Streaming] - Unexpected Error',
      {
        ...options,
        source,
      },
    );
  }
}
