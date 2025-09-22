import { GenerateContentConfig, GoogleGenAI } from '@google/genai';
import { Inject, Injectable } from '@nestjs/common';
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

  public async album(): Promise<PromptResponse> {
    const prompt = Prompt.album();
    return this._generate(prompt);
  }

  public async artist(): Promise<PromptResponse> {
    const prompt = Prompt.artist();
    return this._generate(prompt);
  }

  public async music(): Promise<PromptResponse> {
    const prompt = Prompt.music();
    return this._generate(prompt);
  }

  private async _generate(prompt: Prompt): Promise<PromptResponse> {
    const response = await this._ai.models.generateContent({
      model: this._model,
      contents: prompt.text('metal and sad'),
      config: this._config,
    });

    return PromptResponse.from(response);
  }
}
