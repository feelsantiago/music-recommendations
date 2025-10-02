import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface GeminiModuleOptions {
  apiKey: string;
  recommendationLength: number;
  contextCaching: boolean;
  model: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<GeminiModuleOptions>().build();

export const MODEL = Symbol('GEMINI_MODEL');
