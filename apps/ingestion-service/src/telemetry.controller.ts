import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { TelemetryIngestionService } from './telemetry-ingestion.service';

interface TelemetryPayload {
  deviceId: string;
  temperature: number;
  voltage: number;
  pressure: number;
  humidity: number;
}

@Controller('telemetry')
export class TelemetryController {
  constructor(private readonly ingestionService: TelemetryIngestionService) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async ingest(@Body() payload: TelemetryPayload) {
    await this.ingestionService.ingest({
      deviceId: payload.deviceId,
      payload: {
        temperature: payload.temperature,
        voltage: payload.voltage,
        pressure: payload.pressure,
        humidity: payload.humidity,
      },
    });
    return { success: true };
  }
}