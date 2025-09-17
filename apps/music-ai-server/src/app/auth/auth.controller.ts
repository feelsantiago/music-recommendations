import {
  Controller,
  Get,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CsrfToken } from './decorators/csrf-token.decorator';
import { SessionInterceptor } from './interceptors/session.interceptor';

@Controller('auth')
export class AuthController {
  @Get('session')
  @HttpCode(200)
  @UseInterceptors(SessionInterceptor)
  public session(@CsrfToken() csrf: string): unknown {
    return { csrf };
  }

  @Post('test')
  public test(): unknown {
    return { ok: true };
  }
}
