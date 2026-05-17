import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@rtsp/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  const port = process.env.PORT || 3002;
  await app.listen(port);
  
  console.log(`Alert Service running on port ${port}`);
}

bootstrap();