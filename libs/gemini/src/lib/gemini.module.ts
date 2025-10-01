import { GoogleGenAI } from '@google/genai';
import { Module } from '@nestjs/common';
import { Gemini } from './gemini';
import {
  ConfigurableModuleClass,
  GeminiModuleOptions,
  MODEL,
  MODULE_OPTIONS_TOKEN,
} from './gemini.module-definition';
import { PromptRecommendation } from './prompt/prompt-recommendation';

@Module({
  providers: [
    Gemini,
    PromptRecommendation,
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
