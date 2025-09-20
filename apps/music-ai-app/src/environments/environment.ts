import { Env } from './env';

export const environment: Env = {
  api: '/api',
  csrf: {
    cookie: 'CSRF_TOKEN',
    header: 'x-csrf-token',
  },
};
