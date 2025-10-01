import { ResultAsync } from '@music-ai/common';
import { RecommendationError } from './recommendations.errors';
import {
  RecommendationResponse,
  RecommendationsLimits,
  RecommendationTag,
  RecommendationType,
} from './recommendations.types';

export abstract class Recommendations {
  public abstract generate(
    type: RecommendationType,
    tags: RecommendationTag[],
  ): ResultAsync<RecommendationResponse, RecommendationError>;

  public abstract limits(): RecommendationsLimits;
}
