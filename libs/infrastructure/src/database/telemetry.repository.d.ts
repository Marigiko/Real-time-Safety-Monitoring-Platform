import { TelemetryEntity, TelemetryRepository as ITelemetryRepository } from "@rtsp/domain";
export declare class TelemetryRepository implements ITelemetryRepository {
    private telemetryStore;
    save(telemetry: TelemetryEntity): Promise<void>;
    findByDeviceId(deviceId: string, limit?: number): Promise<TelemetryEntity[]>;
    findByTimeRange(start: Date, end: Date): Promise<TelemetryEntity[]>;
    findAll(limit?: number): Promise<TelemetryEntity[]>;
    findById(id: string): Promise<TelemetryEntity | null>;
}
//# sourceMappingURL=telemetry.repository.d.ts.map