import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Option } from '@sapphire/result';
import { match } from 'ts-pattern';
import { CsrfConfig, Environment, SessionConfig } from './configuration.types';

@Injectable()
export class Config {
  constructor(private readonly _config: ConfigService) {}

  public port(): number {
    return Option.from(() => this._config.get<number>('PORT'))
      .map((port) => Number(port))
      .unwrapOr(3000);
  }

  public env(): Environment {
    return Option.from(() => this._config.get<string>('NODE_ENV'))
      .map((env) =>
        match<string, Environment>(env)
          .with('production', () => 'production')
          .otherwise(() => 'development'),
      )
      .unwrapOr('development');
  }

  public appUrl(): string {
    return Option.from(() =>
      this._config.get<string>('MUSIC_UI_APP_URL'),
    ).unwrapOr('');
  }

  public session(): SessionConfig {
    const secret = Option.from(() =>
      this._config.get<string>('SESSION_SECRET'),
    ).unwrapOr('');
    const store = Option.from(() =>
      this._config.get<string>('SESSION_STORE'),
    ).unwrapOr('');

    return { secret, store };
  }

  public csrf(): CsrfConfig {
    const secret = Option.from(() =>
      this._config.get<string>('CSRF_SECRET'),
    ).unwrapOr('');
    const name = Option.from(() =>
      this._config.get<string>('CSRF_COOKIE_NAME'),
    ).unwrapOr('');

    return { secret, name };
  }

  public redis(): string {
    return Option.from(() => this._config.get<string>('REDIS_URL')).unwrapOr(
      '',
    );
  }

  public aiKey(): string {
    return Option.from(() => this._config.get<string>('AI_KEY')).unwrapOr('');
  }

  public recommendationLength(): number {
    return Option.from(() => this._config.get<number>('RECOMMENDATION_LENGTH'))
      .map((value) => Number(value))
      .unwrapOr(5);
  }

  public contextCache(): boolean {
    return Option.from(() => this._config.get<boolean>('CONTEXT_CACHE'))
      .map((value) => Boolean(value))
      .unwrapOr(false);
  }

  public model(): string {
    return Option.from(() => this._config.get<string>('MODEL')).unwrapOr(
      'text-bison-001',
    );
  }

  public spotifyClientId(): string {
    return Option.from(() =>
      this._config.get<string>('SPOTIFY_CLIENT_ID'),
    ).unwrapOr('');
  }

  public spotifyClientSecret(): string {
    return Option.from(() =>
      this._config.get<string>('SPOTIFY_CLIENT_SECRET'),
    ).unwrapOr('');
  }
}
