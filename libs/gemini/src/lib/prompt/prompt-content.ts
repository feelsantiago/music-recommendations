import {
  GenerateContentConfig,
  GenerateContentResponse,
  GoogleGenAI,
} from '@google/genai';
import { Result, ResultAsync } from '@music-ai/common';
import { Prompt } from '@music-ai/recommendations';
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
    prompt: Prompt,
    context: string,
    config: GenerateContentConfig = {},
  ): ResultAsync<PromptResponse, GeminiError> {
    const result = await Result.fromAsync<GenerateContentResponse, Error>(() =>
      this._ai.models.generateContent({
        model: this._options.model,
        contents: context,
        config,
      }),
    );

    return result
      .mapErr((error) => GeminiError.generate(prompt.type, { source: error }))
      .map((response) => PromptResponse.from(response));
  }
}
