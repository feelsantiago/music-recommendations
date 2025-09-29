import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../configuration/configuration.module';
import { AuthController } from './auth.controller';
import { RegenerateSessionInterceptor } from './interceptors/regenerate-session.interceptor';

@Module({
  imports: [ConfigurationModule],
  providers: [RegenerateSessionInterceptor],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
