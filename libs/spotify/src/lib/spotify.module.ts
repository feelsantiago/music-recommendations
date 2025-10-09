import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { Spotify } from './spotify';
import { SpotifyApi } from './spotify.api';
import { ConfigurableModuleClass } from './spotify.module-definitions';

@Module({
  imports: [HttpModule],
  providers: [Spotify, SpotifyApi],
  exports: [Spotify],
})
export class SpotifyModule extends ConfigurableModuleClass {}
