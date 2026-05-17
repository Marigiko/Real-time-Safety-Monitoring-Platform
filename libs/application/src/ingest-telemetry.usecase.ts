import { Telemetry, TelemetryReading } from '@rtsp/domain';
import { TelemetryService } from './telemetry.service.interface';

export interface IngestTelemetryInput {
  deviceId: string;
  payload: TelemetryReading;
  rawData: string;
}

export interface IngestTelemetryOutput {
  telemetry: Telemetry;
  success: boolean;
  errors?: string[];
}

export class IngestTelemetryUseCase {
  constructor(private readonly telemetryService: TelemetryService) {}

  async execute(input: IngestTelemetryInput): Promise<IngestTelemetryOutput> {
    const errors: string[] = [];

    if (!input.deviceId || input.deviceId.trim() === '') {
      errors.push('Device ID is required');
    }

    if (!input.payload) {
      errors.push('Payload is required');
    } else {
      if (typeof input.payload.temperature !== 'number') {
        errors.push('Temperature must be a number');
      }
      if (typeof input.payload.voltage !== 'number') {
        errors.push('Voltage must be a number');
      }
      if (typeof input.payload.pressure !== 'number') {
        errors.push('Pressure must be a number');
      }
      if (typeof input.payload.humidity !== 'number') {
        errors.push('Humidity must be a number');
      }
    }

    if (errors.length > 0) {
      return {
        telemetry: null as unknown as Telemetry,
        success: false,
        errors,
      };
    }

    const telemetry = Telemetry.create({
      deviceId: input.deviceId,
      payload: input.payload,
      rawData: input.rawData,
    });

    await this.telemetryService.publish(telemetry);

    return {
      telemetry,
      success: true,
    };
  }
}