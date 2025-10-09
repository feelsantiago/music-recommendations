import { ResultAsync } from '@music-ai/common';
import { Recommendations } from './recommendations';
import { RecommendationStreamingError } from './recommendations.errors';
import { RecommendationData } from './recommendations.types';

export abstract class RecommendationStreaming {
  public abstract metadata(
    recommendations: RecommendationData[],
  ): ResultAsync<Recommendations[], RecommendationStreamingError>;
}
