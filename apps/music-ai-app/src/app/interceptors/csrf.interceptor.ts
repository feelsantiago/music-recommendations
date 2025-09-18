import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Auth } from '../domain/auth/auth.service';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  constructor(private readonly _injector: Injector) {}

  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (req.url.includes('/session')) {
      return next.handle(req);
    }

    const auth = this._injector.get(Auth);
    return auth.session$.pipe(
      switchMap(({ csrf }) =>
        next.handle(
          req.clone({
            headers: req.headers.set('x-csrf-token', csrf),
            withCredentials: true,
          }),
        ),
      ),
    );
  }
}
