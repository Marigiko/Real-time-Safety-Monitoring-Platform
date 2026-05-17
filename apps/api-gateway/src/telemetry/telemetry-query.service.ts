import { Injectable } from '@nestjs/common';
import { TelemetryRepository } from '@rtsp/infrastructure';

@Injectable()
export class TelemetryQueryService {
  constructor(private readonly telemetryRepo: TelemetryRepository) {}

  async findAll(limit = 100) {
    return await this.telemetryRepo.findAll(limit);
  }

  async findByDeviceId(deviceId: string, limit = 100) {
    return await this.telemetryRepo.findByDeviceId(deviceId, limit);
  }

  async findById(id: string) {
    return await this.telemetryRepo.findById(id);
  }
}