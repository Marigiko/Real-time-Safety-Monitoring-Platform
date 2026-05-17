import { Module } from '@nestjs/common';
import { DatabaseModule } from '@rtsp/infrastructure';
import { TelemetryController } from './telemetry/telemetry.controller';
import { AlertsController } from './alerts/alerts.controller';
import { HealthController } from './health/health.controller';
import { MetricsController } from './metrics/metrics.controller';
import { TelemetryQueryService } from './telemetry/telemetry-query.service';
import { AlertsQueryService } from './alerts/alerts-query.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TelemetryController, AlertsController, HealthController, MetricsController],
  providers: [TelemetryQueryService, AlertsQueryService],
})
export class AppModule {}