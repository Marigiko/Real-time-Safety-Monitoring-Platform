export interface TelemetryReading {
  temperature: number;
  voltage: number;
  pressure: number;
  humidity: number;
}

export interface TelemetryEntity {
  id: string;
  deviceId: string;
  timestamp: Date;
  payload: TelemetryReading;
  rawPayload: string;
}

export class Telemetry {
  readonly id: string;
  readonly deviceId: string;
  readonly timestamp: Date;
  readonly readings: TelemetryReading;
  readonly rawData: string;

  constructor(props: {
    id: string;
    deviceId: string;
    timestamp: Date;
    readings: TelemetryReading;
    rawData: string;
  }) {
    this.id = props.id;
    this.deviceId = props.deviceId;
    this.timestamp = props.timestamp;
    this.readings = props.readings;
    this.rawData = props.rawData;
  }

  static create(data: {
    deviceId: string;
    payload: TelemetryReading;
    rawData: string;
  }): Telemetry {
    return new Telemetry({
      id: crypto.randomUUID(),
      deviceId: data.deviceId,
      timestamp: new Date(),
      readings: data.payload,
      rawData: data.rawData,
    });
  }
}