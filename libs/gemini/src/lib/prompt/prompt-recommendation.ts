import {
  GenerateContentConfig,
  GenerateContentResponse,
  GoogleGenAI,
  Type,
} from '@google/genai';
import { ResultAsync, safeTryBind } from '@music-ai/common';
import { Prompt, RecommendationTag } from '@music-ai/recommendations';
import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@sapphire/result';
import { GeminiError } from '../gemini.errors';
import {
  GeminiModuleOptions,
  MODEL,
  MODULE_OPTIONS_TOKEN,
} from '../gemini.module-definition';
import { PromptResponse } from './prompt-response';

export const PROMPT_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      album: { type: Type.STRING },
      artist: { type: Type.STRING },
    },
    propertyOrdering: ['album', 'artist'],
  },
};

@Injectable()
export class PromptRecommendation {
  private readonly _model = 'gemini-2.5-flash';

  private get _config(): GenerateContentConfig {
    return {
      responseMimeType: 'application/json',
      responseSchema: PROMPT_SCHEMA,
    };
  }

  constructor(
    @Inject(MODEL) private readonly _ai: GoogleGenAI,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly _options: GeminiModuleOptions,
  ) {}

  public async album(
    tags: RecommendationTag[],
  ): ResultAsync<PromptResponse, GeminiError> {
    const prompt = Prompt.album(this._options.recommendationLength);
    return this._generate(prompt, tags);
  }

  public async artist(
    tags: RecommendationTag[],
  ): ResultAsync<PromptResponse, GeminiError> {
    const prompt = Prompt.artist(this._options.recommendationLength);
    return this._generate(prompt, tags);
  }

  public async song(
    tags: RecommendationTag[],
  ): ResultAsync<PromptResponse, GeminiError> {
    const prompt = Prompt.song(this._options.recommendationLength);
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
