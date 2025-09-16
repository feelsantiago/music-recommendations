import { INestApplication } from '@nestjs/common';

export interface ServerConfiguration {
  setup(app: INestApplication): void;
}

export interface SessionConfig {
  secret: string;
  store: string;
}

export type Environment = 'development' | 'production';

export const SERVER_CONFIGURATIONS = Symbol('SERVER_CONFIGURATIONS');
export const REDIS_CONNECTION = Symbol('REDIS_CONNECTION');
