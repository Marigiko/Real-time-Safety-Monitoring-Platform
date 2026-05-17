import { Injectable } from '@nestjs/common';
import { AlertEntity, AlertRepository as IAlertRepository } from '@rtsp/domain';

@Injectable()
export class AlertRepository implements IAlertRepository {
  private alertStore: AlertEntity[] = [];

  async save(alert: AlertEntity): Promise<void> {
    this.alertStore.push(alert);
  }

  async findAll(limit = 100, offset = 0): Promise<AlertEntity[]> {
    return this.alertStore.slice(offset, offset + limit);
  }

  async findByDeviceId(deviceId: string): Promise<AlertEntity[]> {
    return this.alertStore.filter(a => a.deviceId === deviceId);
  }

  async findBySeverity(severity: 'CRITICAL' | 'WARNING' | 'INFO'): Promise<AlertEntity[]> {
    return this.alertStore.filter(a => a.severity === severity);
  }

  async findUnacknowledged(): Promise<AlertEntity[]> {
    return this.alertStore.filter(a => !a.acknowledged);
  }

  async acknowledge(id: string): Promise<void> {
    const index = this.alertStore.findIndex(a => a.id === id);
    if (index !== -1) {
      this.alertStore[index] = {
        ...this.alertStore[index],
        acknowledged: true,
      };
    }
  }

  async findById(id: string): Promise<AlertEntity | null> {
    return this.alertStore.find(a => a.id === id) || null;
  }
}