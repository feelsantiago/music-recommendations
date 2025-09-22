import { Injectable } from '@nestjs/common';

import { ResultAsync } from '@music-ai/common';
import {
  Recommendation,
  RecommendationResponse,
  Recommendations,
  RecommendationType,
} from '@music-ai/recommendations';
import { match } from 'ts-pattern';
import { RecommendationPrompt } from './domain/recommendation-prompt';

@Injectable()
export class Gemini implements Recommendations {
  constructor(private readonly _prompt: RecommendationPrompt) {}

  public async generate(
    type: RecommendationType,
  ): ResultAsync<RecommendationResponse> {
    const response = await match(type)
      .with('album', () => this._prompt.album())
      .with('artist', () => this._prompt.artist())
      .with('music', () => this._prompt.music())
      .exhaustive();

    const {
      id,
      tokens: { total },
    } = response;
    return response.data<Recommendation[]>().map((recommendations) => ({
      id,
      recommendations,
      metadata: { tokens: total },
    }));
  }
}
