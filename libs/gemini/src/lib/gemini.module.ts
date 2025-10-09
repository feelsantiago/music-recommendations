import { GoogleGenAI } from '@google/genai';
import { SpotifyModule } from '@music-ai/spotify';
import { Module } from '@nestjs/common';
import { Gemini } from './gemini';
import {
  ConfigurableModuleClass,
  GeminiModuleOptions,
  MODEL,
  MODULE_OPTIONS_TOKEN,
} from './gemini.module-definition';
import { PromptContent } from './prompt/prompt-content';
import { PromptRecommendation } from './prompt/prompt-recommendation';

@Module({
  imports: [
    SpotifyModule.register({
      clientId: '72f4c122b8f14f08abe7f5097ec7a1a4',
      clientSecret: 'aa3df1f48fc749e796f10188bf48f641',
    }),
  ],
  providers: [
    Gemini,
    PromptRecommendation,
    PromptContent,
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
