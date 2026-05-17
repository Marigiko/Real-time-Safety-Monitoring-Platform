import { Module } from '@nestjs/common';
import { KafkaModule } from '@rtsp/infrastructure';
import { DatabaseModule } from '@rtsp/infrastructure';
import { RabbitMQModule } from '@rtsp/infrastructure';
import { TelemetryProcessingService } from './telemetry-processing.service';
import { HealthController } from './health.controller';

@Module({
  imports: [KafkaModule, DatabaseModule, RabbitMQModule],
  controllers: [HealthController],
  providers: [TelemetryProcessingService],
})
export class AppModule {}