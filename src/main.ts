import { NestFactory } from '@nestjs/core';
import { AppModule } from './core/core.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { isDev } from './shared/utils/is-dev.util';
import { convertTime } from './shared/utils/convert-time';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService)
  

  app.setGlobalPrefix("api")
  app.use(cookieParser())
  app.enableCors({
    origin: config.getOrThrow<string[]>("ALLOWED_ORIGIN"),
    credentials: true,
    exposedHeaders: 'set-cookie'
  })

  app.useGlobalPipes(new ValidationPipe())


  await app.listen(config.getOrThrow<number>("PORT"));
}
bootstrap();
