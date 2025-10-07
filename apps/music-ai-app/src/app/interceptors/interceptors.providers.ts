import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { CsrfInterceptor } from './csrf.interceptor';
import { LoaderInterceptor } from './loader.interceptor';

export function provideHttpInterceptors(): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  ]);
}
