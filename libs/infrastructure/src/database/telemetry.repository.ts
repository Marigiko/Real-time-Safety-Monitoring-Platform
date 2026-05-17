import { Injectable } from '@nestjs/common';
import { TelemetryEntity, TelemetryRepository as ITelemetryRepository } from '@rtsp/domain';

@Injectable()
export class TelemetryRepository implements ITelemetryRepository {
  private telemetryStore: TelemetryEntity[] = [];

  async save(telemetry: TelemetryEntity): Promise<void> {
    this.telemetryStore.push(telemetry);
  }

  async findByDeviceId(deviceId: string, limit = 100): Promise<TelemetryEntity[]> {
    const filtered = this.telemetryStore.filter(t => t.deviceId === deviceId);
    return filtered.slice(-limit);
  }

  async findByTimeRange(start: Date, end: Date): Promise<TelemetryEntity[]> {
    return this.telemetryStore.filter(
      t => t.timestamp >= start && t.timestamp <= end
    );
  }

  async findAll(limit = 1000): Promise<TelemetryEntity[]> {
    return this.telemetryStore.slice(-limit);
  }

  async findById(id: string): Promise<TelemetryEntity | null> {
    return this.telemetryStore.find(t => t.id === id) || null;
  }
}