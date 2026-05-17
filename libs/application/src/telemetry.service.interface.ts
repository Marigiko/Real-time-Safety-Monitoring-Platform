import { Telemetry } from '@rtsp/domain';

export interface TelemetryService {
  publish(telemetry: Telemetry): Promise<void>;
  subscribe(handler: (telemetry: Telemetry) => void): Promise<void>;
}