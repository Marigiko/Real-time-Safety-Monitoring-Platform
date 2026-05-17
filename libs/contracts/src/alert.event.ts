export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertType =
  | 'HIGH_TEMPERATURE'
  | 'HIGH_VOLTAGE'
  | 'HIGH_PRESSURE'
  | 'HIGH_HUMIDITY'
  | 'DEVICE_OFFLINE'
  | 'CONNECTION_LOST';

export interface AlertEvent {
  id: string;
  deviceId: string;
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  metadata?: Record<string, unknown>;
}

export const ALERT_EVENT_SCHEMA = {
  type: 'object',
  required: ['id', 'deviceId', 'severity', 'type', 'message', 'timestamp'],
  properties: {
    id: { type: 'string', format: 'uuid' },
    deviceId: { type: 'string', minLength: 1 },
    severity: { type: 'string', enum: ['CRITICAL', 'WARNING', 'INFO'] },
    type: { type: 'string', enum: ['HIGH_TEMPERATURE', 'HIGH_VOLTAGE', 'HIGH_PRESSURE', 'HIGH_HUMIDITY', 'DEVICE_OFFLINE', 'CONNECTION_LOST'] },
    message: { type: 'string', minLength: 1 },
    timestamp: { type: 'string', format: 'date-time' },
    acknowledged: { type: 'boolean' },
    metadata: { type: 'object' },
  },
} as const;

export function validateAlertEvent(data: unknown): data is AlertEvent {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.id === 'string' &&
    typeof obj.deviceId === 'string' &&
    ['CRITICAL', 'WARNING', 'INFO'].includes(obj.severity as string)
  );
}