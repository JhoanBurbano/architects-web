import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
  app.enableCors({
    origin: JSON.parse(process.env.HOST_WEB),
    methods: 'true',
  });
  await app.listen(3000);
}
bootstrap();
