import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SpotifyApi } from './api/spotify.api';
import { Spotify } from './spotify';
import { ConfigurableModuleClass } from './spotify.module-definitions';

@Module({
  imports: [HttpModule],
  providers: [Spotify, SpotifyApi],
  exports: [Spotify],
})
export class SpotifyModule extends ConfigurableModuleClass {}
