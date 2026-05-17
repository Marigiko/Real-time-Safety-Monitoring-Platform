import { TelemetryEntity } from './telemetry.entity';

export interface TelemetryRepository {
  save(telemetry: TelemetryEntity): Promise<void>;
  findByDeviceId(deviceId: string, limit?: number): Promise<TelemetryEntity[]>;
  findByTimeRange(start: Date, end: Date): Promise<TelemetryEntity[]>;
}