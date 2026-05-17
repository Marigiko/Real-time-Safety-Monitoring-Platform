import { Controller, Get } from '@nestjs/common';
import { AlertProcessorService } from './alert-processor.service';

@Controller('health')
export class HealthController {
  constructor(private readonly alertService: AlertProcessorService) {}

  @Get()
  async check() {
    const dependencies = await this.alertService.getHealth();
    
    const allHealthy = dependencies.rabbitmq;
    
    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      service: 'alert-service',
      timestamp: new Date().toISOString(),
      dependencies,
    };
  }
}