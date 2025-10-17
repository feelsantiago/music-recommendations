import { Env } from './env';

export const environment: Env = {
  api: 'http://api.rand-music.net/api',
  csrf: {
    cookie: '__Host-psifi.x-csrf-token',
    header: 'x-csrf-token',
  },
};
