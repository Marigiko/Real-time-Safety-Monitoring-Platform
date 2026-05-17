import { Controller, Get, Query, Post, Param } from '@nestjs/common';
import { AlertsQueryService } from './alerts-query.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsQuery: AlertsQueryService) {}

  @Get()
  async list(
    @Query('limit') limit?: string,
    @Query('severity') severity?: string,
  ) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    
    if (severity) {
      return await this.alertsQuery.findBySeverity(severity as 'CRITICAL' | 'WARNING' | 'INFO', limitNum);
    }
    
    return await this.alertsQuery.findAll(limitNum);
  }

  @Get('unacknowledged')
  async unacknowledged() {
    return await this.alertsQuery.findUnacknowledged();
  }

  @Post(':id/acknowledge')
  async acknowledge(@Param('id') id: string) {
    await this.alertsQuery.acknowledge(id);
    return { success: true };
  }
}