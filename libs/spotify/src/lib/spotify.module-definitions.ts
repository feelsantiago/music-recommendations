import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface SpotifyModuleOptions {
  clientId: string;
  clientSecret: string;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<SpotifyModuleOptions>().build();
