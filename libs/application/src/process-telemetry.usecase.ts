import { Telemetry, Alert, AlertSeverity, AlertType } from '@rtsp/domain';
import { AlertService } from './alert.service.interface';

export interface ProcessTelemetryInput {
  telemetry: Telemetry;
}

export interface ProcessTelemetryOutput {
  alerts: Alert[];
  processingTimeMs: number;
}

export class ProcessTelemetryUseCase {
  constructor(private readonly alertService: AlertService) {}

  async execute(input: ProcessTelemetryInput): Promise<ProcessTelemetryOutput> {
    const startTime = Date.now();
    const alerts: Alert[] = [];

    const readings = input.telemetry.readings;

    if (readings.temperature > 100) {
      const alert = Alert.create({
        deviceId: input.telemetry.deviceId,
        severity: 'CRITICAL' as AlertSeverity,
        type: 'HIGH_TEMPERATURE' as AlertType,
        message: `Temperature critical: ${readings.temperature}°C (threshold: 100°C)`,
        metadata: { temperature: readings.temperature, threshold: 100 },
      });
      alerts.push(alert);
    }

    if (readings.voltage > 250) {
      const alert = Alert.create({
        deviceId: input.telemetry.deviceId,
        severity: 'CRITICAL' as AlertSeverity,
        type: 'HIGH_VOLTAGE' as AlertType,
        message: `Voltage critical: ${readings.voltage}V (threshold: 250V)`,
        metadata: { voltage: readings.voltage, threshold: 250 },
      });
      alerts.push(alert);
    }

    if (readings.pressure > 150) {
      const alert = Alert.create({
        deviceId: input.telemetry.deviceId,
        severity: 'WARNING' as AlertSeverity,
        type: 'HIGH_PRESSURE' as AlertType,
        message: `Pressure warning: ${readings.pressure} PSI (threshold: 150 PSI)`,
        metadata: { pressure: readings.pressure, threshold: 150 },
      });
      alerts.push(alert);
    }

    if (readings.humidity > 80) {
      const alert = Alert.create({
        deviceId: input.telemetry.deviceId,
        severity: 'WARNING' as AlertSeverity,
        type: 'HIGH_HUMIDITY' as AlertType,
        message: `Humidity warning: ${readings.humidity}% (threshold: 80%)`,
        metadata: { humidity: readings.humidity, threshold: 80 },
      });
      alerts.push(alert);
    }

    if (alerts.length > 0) {
      await this.alertService.publishAlerts(alerts);
    }

    const processingTimeMs = Date.now() - startTime;

    return {
      alerts,
      processingTimeMs,
    };
  }
}