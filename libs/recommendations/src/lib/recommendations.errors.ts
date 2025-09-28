import { AppError, AppErrorOptions } from '@music-ai/common';

export type RecommendationErrorName =
  | 'recommendation_generation'
  | 'invalid_recommendation';

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

export function isRecommendationError(
  error: unknown,
): error is RecommendationError {
  return error instanceof RecommendationError;
}
