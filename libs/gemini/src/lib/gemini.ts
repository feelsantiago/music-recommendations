import { ok, ResultAsync, safeTryBind } from '@music-ai/common';
import {
  Recommendation,
  RecommendationError,
  RecommendationHistory,
  RecommendationResponse,
  Recommendations,
  RecommendationsLimits,
  RecommendationTag,
  RecommendationType,
} from '@music-ai/recommendations';
import { Spotify } from '@music-ai/spotify';
import { Injectable } from '@nestjs/common';
import { match, P } from 'ts-pattern';
import { GeminiError } from './gemini.errors';
import { PromptRecommendation } from './prompt/prompt-recommendation';
import { PromptSchema } from './prompt/prompt-response';

@Injectable()
export class Gemini implements Recommendations {
  constructor(
    private readonly _prompt: PromptRecommendation,
    private readonly _spotiy: Spotify,
  ) {}

  public async generate(
    type: RecommendationType,
    tags: RecommendationTag[],
    history: RecommendationHistory[] = [],
  ): ResultAsync<RecommendationResponse, RecommendationError> {
    const result = await safeTryBind(this, async function* ({ $, $async }) {
      const request = match(history.length)
        .with(P.number.positive(), () => this._prompt.extend(type, history))
        .otherwise(() => this._prompt.generate(type, tags));
      const response = yield* $async(request);
      const data = yield* $(response.data());
      const recommendations = yield* $async(this._recommendations(data));

      return ok({
        id: response.id,
        recommendations,
        metadata: {
          tokens: response.tokens.total,
          history: response.history,
        },
      });
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

  private async _recommendations(
    recommendations: PromptSchema[],
  ): ResultAsync<Recommendation[], GeminiError> {
    const result = await this._spotiy.metadata(
      recommendations.map((r) => ({ ...r, metadata: [] })),
    );

    return result.mapErr((error) => GeminiError.metadata(error));
  }

  private _error(error: GeminiError): RecommendationError {
    return match(error.type)
      .with(P.union('prompt_generation', 'recommendation_metadata'), () =>
        RecommendationError.generate(error),
      )
      .with(
        P.union('empty_prompt', 'parse_prompt_response', 'empty_tags'),
        () => RecommendationError.invalid(error),
      )
      .exhaustive();
  }
}
