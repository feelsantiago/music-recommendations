export interface SessionConfig {
  secret: string;
  store: string;
}

export interface CsrfConfig {
  secret: string;
  name: string;
}

export type Environment = 'development' | 'production';
