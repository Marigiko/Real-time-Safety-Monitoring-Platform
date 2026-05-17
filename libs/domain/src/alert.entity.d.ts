export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertType = 'HIGH_TEMPERATURE' | 'HIGH_VOLTAGE' | 'HIGH_PRESSURE' | 'HIGH_HUMIDITY' | 'DEVICE_OFFLINE' | 'CONNECTION_LOST';
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
export declare class Alert {
    readonly id: string;
    readonly deviceId: string;
    readonly severity: AlertSeverity;
    readonly type: AlertType;
    readonly message: string;
    readonly timestamp: Date;
    readonly acknowledged: boolean;
    readonly metadata?: Record<string, unknown>;
    constructor(props: AlertEntity);
    static create(props: {
        deviceId: string;
        severity: AlertSeverity;
        type: AlertType;
        message: string;
        metadata?: Record<string, unknown>;
    }): Alert;
    acknowledge(): Alert;
}
//# sourceMappingURL=alert.entity.d.ts.map