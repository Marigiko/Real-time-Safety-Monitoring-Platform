import { Controller, Get, Header } from '@nestjs/common';
import { MetricsService } from '@rtsp/shared';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics() {
    return this.metrics.getMetrics();
  }
}