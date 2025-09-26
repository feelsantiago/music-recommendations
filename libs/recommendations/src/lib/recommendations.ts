import { ResultAsync } from '@music-ai/common';
import { RecommendationError } from './recommendations.errors';

export interface Recommendation {
  album: string;
  artist: string;
}

export interface RecommendationResponse {
  id: string;
  recommendations: Recommendation[];
  metadata: {
    tokens: number;
  };
}

export type RecommendationType = 'album' | 'artist' | 'music';

export abstract class Recommendations {
  public abstract generate(
    type: RecommendationType,
  ): ResultAsync<RecommendationResponse, RecommendationError>;
}
