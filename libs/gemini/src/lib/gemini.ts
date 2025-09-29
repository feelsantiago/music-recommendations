import { ResultAsync, safeTry } from '@music-ai/common';
import {
  Recommendation,
  RecommendationError,
  RecommendationResponse,
  Recommendations,
  RecommendationsLimits,
  RecommendationType,
} from '@music-ai/recommendations';
import { Injectable } from '@nestjs/common';
import { match, P } from 'ts-pattern';
import { RecommendationPrompt } from './domain/recommendation-prompt';
import { GeminiError } from './gemini.errors';

@Injectable()
export class Gemini implements Recommendations {
  constructor(private readonly _prompt: RecommendationPrompt) {}

  public async generate(
    type: RecommendationType,
  ): ResultAsync<RecommendationResponse, RecommendationError> {
    const result = await match(type)
      .with('album', () => this._prompt.album())
      .with('artist', () => this._prompt.artist())
      .with('music', () => this._prompt.music())
      .exhaustive();

    return safeTry(function* ({ $ }) {
      const response = yield* $(result);
      return response.data<Recommendation[]>().map((recommendations) => ({
        id: response.id,
        recommendations,
        metadata: { tokens: response.tokens.total },
      }));
    }).mapErr((error) => this._error(error));
  }

  public limits(): RecommendationsLimits {
    return {
      tokens: {
        minute: 250000,
      },
      requests: {
        day: 1000,
        minute: 15,
      },
    };
  }

  private _error(error: GeminiError): RecommendationError {
    return match(error.type)
      .with('prompt_generation', () => RecommendationError.generate(error))
      .with(P.union('empty_prompt', 'parse_prompt_response'), () =>
        RecommendationError.invalid(error),
      )
      .exhaustive();
  }
}
