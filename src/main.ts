import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
<<<<<<< HEAD
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(3000);
  console.log('started');
=======

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
>>>>>>> origin/main
}
bootstrap();
