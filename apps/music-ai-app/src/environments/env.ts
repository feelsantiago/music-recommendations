import { InjectionToken } from '@angular/core';

export interface Env {
  api: string;
  csrf: {
    cookie: string;
    header: string;
  };
}

export const APP_CONFIG = new InjectionToken<Env>('Application Config');
