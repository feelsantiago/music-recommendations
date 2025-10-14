import { ResultAsync } from '@music-ai/common';
import { RecommendationError } from './recommendations.errors';
import {
  Recommendation,
  RecommendationHistory,
  RecommendationResponse,
  RecommendationsLimits,
  RecommendationTag,
  RecommendationType,
} from './recommendations.types';

export abstract class Recommendations {
  public abstract generate(
    type: RecommendationType,
    tags: RecommendationTag[],
    history?: RecommendationHistory[],
  ): ResultAsync<RecommendationResponse, RecommendationError>;

  public abstract limits(): RecommendationsLimits;
}

export abstract class RecommendationsMetadata {
  public abstract fetch(
    recommendations: Recommendation[],
    type: RecommendationType,
  ): ResultAsync<Recommendation[], RecommendationError>;
}
