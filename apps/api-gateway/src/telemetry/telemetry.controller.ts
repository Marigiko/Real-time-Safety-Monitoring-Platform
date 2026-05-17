import { Controller, Get, Query } from '@nestjs/common';
import { TelemetryQueryService } from './telemetry-query.service';

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly telemetryQuery: TelemetryQueryService) {}

  @Get()
  async list(@Query('limit') limit?: string, @Query('deviceId') deviceId?: string) {
    const limitNum = limit ? parseInt(limit, 10) : 100;
    
    if (deviceId) {
      return await this.telemetryQuery.findByDeviceId(deviceId, limitNum);
    }
    
    return await this.telemetryQuery.findAll(limitNum);
  }

  @Get(':id')
  async get(@Query('id') id: string) {
    return await this.telemetryQuery.findById(id);
  }
}