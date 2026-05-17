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
export declare class Telemetry {
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
    });
    static create(data: {
        deviceId: string;
        payload: TelemetryReading;
        rawData: string;
    }): Telemetry;
}
//# sourceMappingURL=telemetry.entity.d.ts.map