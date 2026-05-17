export type ServiceStatus = 'healthy' | 'unhealthy' | 'degraded';

export interface HealthEvent {
  service: string;
  status: ServiceStatus;
  timestamp: string;
  checks: {
    database?: ServiceStatus;
    kafka?: ServiceStatus;
    rabbitmq?: ServiceStatus;
    mqtt?: ServiceStatus;
  };
  metadata?: Record<string, unknown>;
}

export const HEALTH_EVENT_SCHEMA = {
  type: 'object',
  required: ['service', 'status', 'timestamp'],
  properties: {
    service: { type: 'string', minLength: 1 },
    status: { type: 'string', enum: ['healthy', 'unhealthy', 'degraded'] },
    timestamp: { type: 'string', format: 'date-time' },
    checks: {
      type: 'object',
      properties: {
        database: { type: 'string', enum: ['healthy', 'unhealthy', 'degraded'] },
        kafka: { type: 'string', enum: ['healthy', 'unhealthy', 'degraded'] },
        rabbitmq: { type: 'string', enum: ['healthy', 'unhealthy', 'degraded'] },
        mqtt: { type: 'string', enum: ['healthy', 'unhealthy', 'degraded'] },
      },
    },
  },
} as const;