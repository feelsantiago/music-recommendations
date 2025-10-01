import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CsrfToken } from './decorators/csrf-token.decorator';
import { RegenerateSessionInterceptor } from './interceptors/regenerate-session.interceptor';

@Controller('auth')
export class AuthController {
  @Get('session')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(RegenerateSessionInterceptor)
  public session(@CsrfToken() csrf: string): unknown {
    return { csrf };
  }
}
