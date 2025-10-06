import { GoogleGenAI } from '@google/genai';
import { Module } from '@nestjs/common';
import { Gemini } from './gemini';
import {
  ConfigurableModuleClass,
  GeminiModuleOptions,
  MODEL,
  MODULE_OPTIONS_TOKEN,
} from './gemini.module-definition';
import { PromptCachedContent } from './prompt/prompt-cached-content';
import { PromptContent } from './prompt/prompt-content';
import { PromptRecommendation } from './prompt/prompt-recommendation';

@Module({
  providers: [
    Gemini,
    PromptRecommendation,
    PromptContent,
    PromptCachedContent,
    {
      provide: MODEL,
      useFactory: (options: GeminiModuleOptions) =>
        new GoogleGenAI({
          apiKey: options.apiKey,
        }),
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [Gemini, PromptRecommendation],
})
export class GeminiModule extends ConfigurableModuleClass {}
