import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@rtsp/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`Processing Service running on port ${port}`);
}

bootstrap();