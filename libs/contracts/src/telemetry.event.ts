export interface TelemetryReading {
  temperature: number;
  voltage: number;
  pressure: number;
  humidity: number;
}

export interface TelemetryEvent {
  id: string;
  deviceId: string;
  timestamp: string;
  readings: TelemetryReading;
  source: 'mqtt' | 'kafka' | 'rest';
  metadata?: Record<string, unknown>;
}

export const TELEMETRY_EVENT_SCHEMA = {
  type: 'object',
  required: ['id', 'deviceId', 'timestamp', 'readings'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    deviceId: { type: 'string', minLength: 1 },
    timestamp: { type: 'string', format: 'date-time' },
    readings: {
      type: 'object',
      required: ['temperature', 'voltage', 'pressure', 'humidity'],
      properties: {
        temperature: { type: 'number' },
        voltage: { type: 'number' },
        pressure: { type: 'number' },
        humidity: { type: 'number' },
      },
    },
    source: { type: 'string', enum: ['mqtt', 'kafka', 'rest'] },
  },
} as const;

export function validateTelemetryEvent(data: unknown): data is TelemetryEvent {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.deviceId === 'string' &&
    typeof obj.timestamp === 'string' &&
    typeof obj.readings === 'object' &&
    obj.readings !== null
  );
}