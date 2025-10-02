import { CachedContent, GoogleGenAI } from '@google/genai';
import { Duration, Result, ResultAsync } from '@music-ai/common';
import { Inject, Injectable } from '@nestjs/common';
import { GeminiError } from '../gemini.errors';
import {
  GeminiModuleOptions,
  MODEL,
  MODULE_OPTIONS_TOKEN,
} from '../gemini.module-definition';

@Injectable()
export class PromptCachedContent {
  constructor(
    @Inject(MODEL) private readonly _ai: GoogleGenAI,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly _options: GeminiModuleOptions,
  ) {}

  public async generate(context: string): ResultAsync<string, GeminiError> {
    const result = await Result.fromAsync<CachedContent, Error>(() => {
      return this._ai.caches.create({
        model: this._options.model,
        config: {
          systemInstruction: context,
          ttl: `${Duration.minutes(15).calculate}s`,
        },
      });
    });

    return result
      .mapErr((error) => GeminiError.cache(error))
      .map((response) => response.name || 'unknown_name');
  }
}
