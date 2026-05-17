export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';

export type AlertType =
  | 'HIGH_TEMPERATURE'
  | 'HIGH_VOLTAGE'
  | 'HIGH_PRESSURE'
  | 'HIGH_HUMIDITY'
  | 'DEVICE_OFFLINE'
  | 'CONNECTION_LOST';

export interface AlertEntity {
  id: string;
  deviceId: string;
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  metadata?: Record<string, unknown>;
}

export class Alert {
  readonly id: string;
  readonly deviceId: string;
  readonly severity: AlertSeverity;
  readonly type: AlertType;
  readonly message: string;
  readonly timestamp: Date;
  readonly acknowledged: boolean;
  readonly metadata?: Record<string, unknown>;

  constructor(props: AlertEntity) {
    this.id = props.id;
    this.deviceId = props.deviceId;
    this.severity = props.severity;
    this.type = props.type;
    this.message = props.message;
    this.timestamp = props.timestamp;
    this.acknowledged = props.acknowledged;
    this.metadata = props.metadata;
  }

  static create(props: {
    deviceId: string;
    severity: AlertSeverity;
    type: AlertType;
    message: string;
    metadata?: Record<string, unknown>;
  }): Alert {
    return new Alert({
      id: crypto.randomUUID(),
      deviceId: props.deviceId,
      severity: props.severity,
      type: props.type,
      message: props.message,
      timestamp: new Date(),
      acknowledged: false,
      metadata: props.metadata,
    });
  }

  acknowledge(): Alert {
    return new Alert({
      ...this,
      acknowledged: true,
    });
  }
}