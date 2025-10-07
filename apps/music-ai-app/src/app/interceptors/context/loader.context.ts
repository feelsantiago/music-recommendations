import { HttpContext, HttpContextToken } from '@angular/common/http';

export const SKIP_LOADER_CONTEXT = new HttpContextToken<boolean>(() => true);

export const SKIP_LOADER = {
  context: new HttpContext().set(SKIP_LOADER_CONTEXT, false),
};
