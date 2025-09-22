import { GoogleGenAI } from '@google/genai';
import { Module } from '@nestjs/common';
import { RecommendationPrompt } from './domain/recommendation-prompt';
import { Gemini } from './gemini';
import {
  ConfigurableModuleClass,
  GeminiModuleOptions,
  MODEL,
  MODULE_OPTIONS_TOKEN,
} from './gemini.module-definition';

@Module({
  providers: [
    Gemini,
    RecommendationPrompt,
    {
      provide: MODEL,
      useFactory: (options: GeminiModuleOptions) =>
        new GoogleGenAI({
          apiKey: options.apiKey,
        }),
      inject: [MODULE_OPTIONS_TOKEN],
    },
  ],
  exports: [Gemini, RecommendationPrompt],
})
export class GeminiModule extends ConfigurableModuleClass {}
