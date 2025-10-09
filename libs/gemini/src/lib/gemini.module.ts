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
    SpotifyModule.registerAsync({
      inject: [MODULE_OPTIONS_TOKEN],
      useFactory: (options: GeminiModuleOptions) => ({
        clientId: options.spotify.clientId,
        clientSecret: options.spotify.clientSecret,
      }),
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
