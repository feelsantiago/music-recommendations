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

export interface RecommendationsLimits {
  tokens: {
    minute: number;
  };
  requests: {
    day: number;
    minute: number;
  };
}

export type RecommendationType = 'album' | 'artist' | 'music';
export type RecommendationTag = string;

export interface RecommendationPayload {
  tags: RecommendationTag[];
}
