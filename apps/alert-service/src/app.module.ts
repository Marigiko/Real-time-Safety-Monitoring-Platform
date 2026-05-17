import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@rtsp/infrastructure';
import { AlertProcessorService } from './alert-processor.service';
import { NotificationHandlersModule } from './notification-handlers.module';
import { HealthController } from './health.controller';

@Module({
  imports: [RabbitMQModule, NotificationHandlersModule],
  controllers: [HealthController],
  providers: [AlertProcessorService],
})
export class AppModule {}