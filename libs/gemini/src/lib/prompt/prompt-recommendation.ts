import {
  GenerateContentConfig,
  GenerateContentResponse,
  GoogleGenAI,
} from '@google/genai';
import { ResultAsync, safeTryBind } from '@music-ai/common';
import { RecommendationTag } from '@music-ai/recommendations';
import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@sapphire/result';
import { GeminiError } from '../gemini.errors';
import { MODEL } from '../gemini.module-definition';
import { Prompt } from './prompt';
import { PromptResponse } from './prompt-response';

@Injectable()
export class PromptRecommendation {
  private readonly _model = 'gemini-2.5-flash';

  private get _config(): GenerateContentConfig {
    return {
      responseMimeType: 'application/json',
      responseSchema: Prompt.schema,
    };
  }

  constructor(@Inject(MODEL) private readonly _ai: GoogleGenAI) {}

  public async album(
    tags: RecommendationTag[],
  ): ResultAsync<PromptResponse, GeminiError> {
    const prompt = Prompt.album();
    return this._generate(prompt, tags);
  }

  public async artist(
    tags: RecommendationTag[],
  ): ResultAsync<PromptResponse, GeminiError> {
    const prompt = Prompt.artist();
    return this._generate(prompt, tags);
  }

  public async music(
    tags: RecommendationTag[],
  ): ResultAsync<PromptResponse, GeminiError> {
    const prompt = Prompt.music();
    return this._generate(prompt, tags);
  }

  private async _generate(
    prompt: Prompt,
    tags: RecommendationTag[],
  ): ResultAsync<PromptResponse, GeminiError> {
    return safeTryBind(this, async function* ({ $ }) {
      const text = yield* $(
        prompt.text(tags).mapErr((error) => GeminiError.emptyTags(error)),
      );

      const result = await Result.fromAsync<GenerateContentResponse, Error>(
        () =>
          this._ai.models.generateContent({
            model: this._model,
            contents: text,
            config: this._config,
          }),
      );

      return result
        .mapErr((error) => GeminiError.generate(prompt.type, { source: error }))
        .map((response) => PromptResponse.from(response));
    });
  }
}
