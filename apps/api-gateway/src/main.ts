import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@rtsp/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  
  const port = process.env.PORT || 3003;
  await app.listen(port);
  
  console.log(`API Gateway running on port ${port}`);
}

bootstrap();