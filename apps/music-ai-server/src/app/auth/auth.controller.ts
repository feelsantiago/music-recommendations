import {
  Controller,
  Get,
  HttpCode,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CsrfToken } from './decorators/csrf-token.decorator';
import { RegenerateSessionInterceptor } from './interceptors/regenerate-session.interceptor';

@Controller('auth')
export class AuthController {
  @Get('session')
  @HttpCode(200)
  @UseInterceptors(RegenerateSessionInterceptor)
  public session(@CsrfToken() csrf: string): unknown {
    return { csrf };
  }

  @Post('test')
  public test(): unknown {
    return { ok: true };
  }
}
