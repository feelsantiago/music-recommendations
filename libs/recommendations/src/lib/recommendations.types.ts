export interface Recommendation {
  album: string;
  artist: string;
}

export interface RecommendationHistory {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface RecommendationResponse {
  id: string;
  recommendations: Recommendation[];
  metadata: {
    tokens: number;
    history: RecommendationHistory[];
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

export type RecommendationType = 'album' | 'artist' | 'song';
export type RecommendationTag = string;

export interface RecommendationPayload {
  tags: RecommendationTag[];
}
