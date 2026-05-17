import { Injectable } from '@nestjs/common';
import { AlertRepository } from '@rtsp/infrastructure';

@Injectable()
export class AlertsQueryService {
  constructor(private readonly alertRepo: AlertRepository) {}

  async findAll(limit = 100) {
    return await this.alertRepo.findAll(limit);
  }

  async findByDeviceId(deviceId: string) {
    return await this.alertRepo.findByDeviceId(deviceId);
  }

  async findBySeverity(severity: 'CRITICAL' | 'WARNING' | 'INFO', limit = 100) {
    return await this.alertRepo.findBySeverity(severity);
  }

  async findUnacknowledged() {
    return await this.alertRepo.findUnacknowledged();
  }

  async acknowledge(id: string) {
    await this.alertRepo.acknowledge(id);
  }
}