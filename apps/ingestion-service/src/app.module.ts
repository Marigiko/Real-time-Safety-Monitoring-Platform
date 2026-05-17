import { Module } from '@nestjs/common';
import { MqttModule } from '@rtsp/infrastructure';
import { KafkaModule } from '@rtsp/infrastructure';
import { TelemetryController } from './telemetry.controller';
import { TelemetryIngestionService } from './telemetry-ingestion.service';
import { HealthController } from './health.controller';

@Module({
  imports: [MqttModule, KafkaModule],
  controllers: [TelemetryController, HealthController],
  providers: [TelemetryIngestionService],
})
export class AppModule {}