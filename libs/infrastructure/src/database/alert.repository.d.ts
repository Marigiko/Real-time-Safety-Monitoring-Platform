import { AlertEntity, AlertRepository as IAlertRepository } from "@rtsp/domain";
export declare class AlertRepository implements IAlertRepository {
    private alertStore;
    save(alert: AlertEntity): Promise<void>;
    findAll(limit?: number, offset?: number): Promise<AlertEntity[]>;
    findByDeviceId(deviceId: string): Promise<AlertEntity[]>;
    findBySeverity(severity: 'CRITICAL' | 'WARNING' | 'INFO'): Promise<AlertEntity[]>;
    findUnacknowledged(): Promise<AlertEntity[]>;
    acknowledge(id: string): Promise<void>;
    findById(id: string): Promise<AlertEntity | null>;
}
//# sourceMappingURL=alert.repository.d.ts.map