import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface GeminiModuleOptions {
  apiKey: string;
  recommendationLength: number;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<GeminiModuleOptions>().build();

export const MODEL = Symbol('GEMINI_MODEL');
