import { GenerateContentConfig, Type } from '@google/genai';
import { ResultAsync, safeTryBind } from '@music-ai/common';
import {
  Prompt,
  RecommendationHistory,
  RecommendationTag,
  RecommendationType,
} from '@music-ai/recommendations';
import { Inject, Injectable } from '@nestjs/common';
import { match } from 'ts-pattern';
import { GeminiError } from '../gemini.errors';
import {
  GeminiModuleOptions,
  MODULE_OPTIONS_TOKEN,
} from '../gemini.module-definition';
import { PromptContent } from './prompt-content';
import { PromptResponse } from './prompt-response';

export const PROMPT_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING },
      artist: { type: Type.STRING },
    },
    propertyOrdering: ['name', 'artist'],
  },
};

@Injectable()
export class PromptRecommendation {
  private get _config(): GenerateContentConfig {
    return {
      responseMimeType: 'application/json',
      responseSchema: PROMPT_SCHEMA,
    };
  }

  private get _length(): number {
    return this._options.recommendations;
  }

  constructor(
    private readonly _content: PromptContent,
    @Inject(MODULE_OPTIONS_TOKEN)
    private readonly _options: GeminiModuleOptions,
  ) {}

  public async generate(
    type: RecommendationType,
    tags: RecommendationTag[],
  ): ResultAsync<PromptResponse, GeminiError> {
    return safeTryBind(this, async function* ({ $ }) {
      const prompt = this._prompt(type);
      const context = yield* $(
        prompt.context(tags).mapErr((error) => GeminiError.emptyTags(error)),
      );

      return this._content.generate(context, prompt.type, this._config);
    });
  }

  public async extend(
    type: RecommendationType,
    history: RecommendationHistory[],
  ): ResultAsync<PromptResponse, GeminiError> {
    const prompt = this._prompt(type);
    const context = prompt.extend();
    return this._content.generate(context, prompt.type, this._config, history);
  }

  private _prompt(type: RecommendationType): Prompt {
    return match(type)
      .with('album', () => Prompt.album(this._length))
      .with('artist', () => Prompt.artist(this._length))
      .with('song', () => Prompt.song(this._length))
      .exhaustive();
  }
}
