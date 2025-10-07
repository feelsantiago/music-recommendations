import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { Loader } from '../domain/loader/loader.service';
import { SKIP_LOADER_CONTEXT } from './context/loader.context';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private readonly _loader: Loader) {}

  public intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    if (req.context.has(SKIP_LOADER_CONTEXT)) {
      return next.handle(req);
    }

    this._loader.start();
    return next.handle(req).pipe(finalize(() => this._loader.finish()));
  }
}
