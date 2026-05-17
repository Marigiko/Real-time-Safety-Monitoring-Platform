import { TelemetryEntity, TelemetryReading } from './telemetry.entity';
import { AlertEntity } from './alert.entity';

export interface ProcessingResultEntity {
  id: string;
  telemetry: TelemetryEntity;
  alerts: AlertEntity[];
  processedAt: Date;
  processingTimeMs: number;
}

export class ProcessingResult {
  readonly id: string;
  readonly telemetry: TelemetryEntity;
  readonly alerts: AlertEntity[];
  readonly processedAt: Date;
  readonly processingTimeMs: number;

  constructor(props: ProcessingResultEntity) {
    this.id = props.id;
    this.telemetry = props.telemetry;
    this.alerts = props.alerts;
    this.processedAt = props.processedAt;
    this.processingTimeMs = props.processingTimeMs;
  }

  static create(telemetry: TelemetryEntity, alerts: AlertEntity[], timeMs: number): ProcessingResult {
    return new ProcessingResult({
      id: crypto.randomUUID(),
      telemetry,
      alerts,
      processedAt: new Date(),
      processingTimeMs: timeMs,
    });
  }

  hasAlerts(): boolean {
    return this.alerts.length > 0;
  }

  hasCriticalAlerts(): boolean {
    return this.alerts.some(a => a.severity === 'CRITICAL');
  }
}