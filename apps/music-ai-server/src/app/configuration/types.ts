import { INestApplication } from '@nestjs/common';

export interface ServerConfiguration {
  setup(app: INestApplication): void;
}

export interface SessionConfig {
  secret: string;
  store: string;
}

export interface CsrfConfig {
  secret: string;
  name: string;
}

export type Environment = 'development' | 'production';

export const SERVER_CONFIGURATIONS = Symbol('SERVER_CONFIGURATIONS');
export const REDIS_CONNECTION = Symbol('REDIS_CONNECTION');
export const COOKIE_SETTINGS = Symbol('COOKIE_SETTINGS');
export const COOKIE_MAX_AGE = Symbol('COOKIE_MAX_AGE');
