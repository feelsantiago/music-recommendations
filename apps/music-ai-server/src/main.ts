import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Config } from './app/configuration/config';
import { Middlewares } from './app/middlewares/middlewares.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const middlewares = app.get(Middlewares);
  middlewares.apply(app);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const config = app.get(Config);
  const port = config.port();

  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
