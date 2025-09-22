import {
  GenerateContentConfig,
  GenerateContentResponse,
  GoogleGenAI,
} from '@google/genai';
import { AppError, ResultAsync } from '@music-ai/common';
import { Inject, Injectable } from '@nestjs/common';
import { Result } from '@sapphire/result';
import { MODEL } from '../gemini.module-definition';
import { Prompt } from './prompt';
import { PromptResponse } from './prompt-response';

@Injectable()
export class RecommendationPrompt {
  private readonly _model = 'gemini-2.5-flash';

  private get _config(): GenerateContentConfig {
    return {
      responseMimeType: 'application/json',
      responseSchema: Prompt.schema,
    };
  }

  constructor(@Inject(MODEL) private readonly _ai: GoogleGenAI) {}

  public async album(): ResultAsync<PromptResponse, AppError> {
    const prompt = Prompt.album();
    return this._generate(prompt);
  }

  public async artist(): ResultAsync<PromptResponse, AppError> {
    const prompt = Prompt.artist();
    return this._generate(prompt);
  }

  public async music(): ResultAsync<PromptResponse, AppError> {
    const prompt = Prompt.music();
    return this._generate(prompt);
  }

  private async _generate(
    prompt: Prompt,
  ): ResultAsync<PromptResponse, AppError> {
    const result = await Result.fromAsync<GenerateContentResponse, Error>(() =>
      this._ai.models.generateContent({
        model: this._model,
        contents: prompt.text('metal and sad'),
        config: this._config,
      }),
    );

    return result
      .mapErr((error) =>
        AppError.create('[Prompt - Generate] - Unable to generate data', {
          source: error,
        }),
      )
      .map((response) => PromptResponse.from(response));
  }
}
