import { ResultAsync } from '@music-ai/common';
import { RecommendationError } from './recommendations.errors';
import {
  RecommendationResponse,
  RecommendationsLimits,
  RecommendationType,
} from './recommendations.types';

export abstract class Recommendations {
  public abstract generate(
    type: RecommendationType,
  ): ResultAsync<RecommendationResponse, RecommendationError>;

  public abstract limits(): RecommendationsLimits;
}
