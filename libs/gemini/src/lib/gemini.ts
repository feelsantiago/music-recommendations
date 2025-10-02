import { ResultAsync, safeTryBind } from '@music-ai/common';
import {
  Recommendation,
  RecommendationError,
  RecommendationResponse,
  Recommendations,
  RecommendationsLimits,
  RecommendationTag,
  RecommendationType,
} from '@music-ai/recommendations';
import { Injectable } from '@nestjs/common';
import { match, P } from 'ts-pattern';
import { GeminiError } from './gemini.errors';
import { PromptRecommendation } from './prompt/prompt-recommendation';

@Injectable()
export class Gemini implements Recommendations {
  constructor(private readonly _prompt: PromptRecommendation) {}

  public async generate(
    type: RecommendationType,
    tags: RecommendationTag[],
  ): ResultAsync<RecommendationResponse, RecommendationError> {
    const result = await safeTryBind(this, async function* ({ $async }) {
      const response = yield* $async(this._prompt.generate(type, tags));
      return response.data<Recommendation[]>().map((recommendations) => ({
        id: response.id,
        recommendations,
        metadata: { tokens: response.tokens.total },
      }));
    });

    return result.mapErr((error) => this._error(error));
  }

  public async extend(
    type: RecommendationType,
    cache: string,
  ): ResultAsync<RecommendationResponse, RecommendationError> {
    const result = await safeTryBind(this, async function* ({ $async }) {
      const response = yield* $async(this._prompt.extend(type, cache));
      return response.data<Recommendation[]>().map((recommendations) => ({
        id: response.id,
        recommendations,
        metadata: { tokens: response.tokens.total },
      }));
    });

    return result.mapErr((error) => this._error(error));
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
      .with(P.union('prompt_generation', 'cache_generation_error'), () =>
        RecommendationError.generate(error),
      )
      .with(
        P.union('empty_prompt', 'parse_prompt_response', 'empty_tags'),
        () => RecommendationError.invalid(error),
      )
      .exhaustive();
  }
}
