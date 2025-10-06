import {
  GenerateContentConfig,
  GenerateContentResponse,
  GoogleGenAI,
} from '@google/genai';
import { Result, ResultAsync } from '@music-ai/common';
import {
  RecommendationHistory,
  RecommendationType,
} from '@music-ai/recommendations';
import { Inject, Injectable } from '@nestjs/common';
import { GeminiError } from '../gemini.errors';
import {
  GeminiModuleOptions,
  MODEL,
  MODULE_OPTIONS_TOKEN,
} from '../gemini.module-definition';
import { PromptResponse } from './prompt-response';

@Injectable()
export class PromptContent {
  constructor(
    @Inject(MODEL) private readonly _ai: GoogleGenAI,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly _options: GeminiModuleOptions,
  ) {}

  public async generate(
    message: string,
    type: RecommendationType,
    config: GenerateContentConfig = {},
    history: RecommendationHistory[] = [],
  ): ResultAsync<PromptResponse, GeminiError> {
    const result = await Result.fromAsync<GenerateContentResponse, Error>(
      () => {
        const chat = this._ai.chats.create({
          model: this._options.model,
          history: history,
          config,
        });

        return chat.sendMessage({ message: message });
      },
    );

    return result
      .mapErr((error) => GeminiError.generate(type, { source: error }))
      .map((response) => PromptResponse.from(response, message, history));
  }
}
