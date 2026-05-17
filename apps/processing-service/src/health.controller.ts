import { Controller, Get } from '@nestjs/common';
import { TelemetryProcessingService } from './telemetry-processing.service';

@Controller('health')
export class HealthController {
  constructor(private readonly processingService: TelemetryProcessingService) {}

  @Get()
  async check() {
    const dependencies = await this.processingService.getHealth();
    
    const allHealthy = dependencies.kafka && dependencies.rabbitmq && dependencies.database;
    
    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      service: 'processing-service',
      timestamp: new Date().toISOString(),
      dependencies,
    };
  }
}