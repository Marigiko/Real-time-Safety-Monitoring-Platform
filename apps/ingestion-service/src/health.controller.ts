import { Controller, Get } from '@nestjs/common';
import { TelemetryIngestionService } from './telemetry-ingestion.service';

@Controller('health')
export class HealthController {
  constructor(private readonly ingestionService: TelemetryIngestionService) {}

  @Get()
  async check() {
    const dependencies = await this.ingestionService.getHealth();
    
    const allHealthy = dependencies.mqtt && dependencies.kafka;
    
    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      service: 'ingestion-service',
      timestamp: new Date().toISOString(),
      dependencies,
    };
  }
}