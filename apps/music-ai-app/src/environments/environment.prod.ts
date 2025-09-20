import { Env } from './env';

export const environment: Env = {
  api: '',
  csrf: {
    cookie: '__Host-psifi.x-csrf-token',
    header: 'x-csrf-token',
  },
};
