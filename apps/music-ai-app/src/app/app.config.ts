import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { MusicAppTheme } from './app.theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(
      withXsrfConfiguration({
        // cookieName: '__Host-psifi.x-csrf-token',
        cookieName: 'CSRF_TOKEN',
      }),
    ),
    providePrimeNG({
      theme: {
        preset: MusicAppTheme,
      },
    }),
    provideRouter(appRoutes),
  ],
};
