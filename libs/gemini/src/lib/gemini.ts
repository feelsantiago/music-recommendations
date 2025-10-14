import { ResultAsync, safeTryBind } from '@music-ai/common';
import {
  RecommendationError,
  RecommendationHistory,
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
    history: RecommendationHistory[] = [],
  ): ResultAsync<RecommendationResponse, RecommendationError> {
    const result = await safeTryBind(this, async function* ({ $async }) {
      const request = match(history.length)
        .with(P.number.positive(), () => this._prompt.extend(type, history))
        .otherwise(() => this._prompt.generate(type, tags));
      const response = yield* $async(request);
      return response.data().map((data) => ({
        id: response.id,
        recommendations: data.map((r) => ({ ...r, metadata: [] })),
        metadata: {
          tokens: response.tokens.total,
          history: response.history,
          tags,
        },
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
      .with('prompt_generation', () => RecommendationError.generate(error))
      .with(
        P.union('empty_prompt', 'parse_prompt_response', 'empty_tags'),
        () => RecommendationError.invalid(error),
      )
      .exhaustive();
  }
}
