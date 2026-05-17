import { AlertEntity } from './alert.entity';
export interface AlertRepository {
    save(alert: AlertEntity): Promise<void>;
    findAll(limit?: number, offset?: number): Promise<AlertEntity[]>;
    findByDeviceId(deviceId: string): Promise<AlertEntity[]>;
    findBySeverity(severity: 'CRITICAL' | 'WARNING' | 'INFO'): Promise<AlertEntity[]>;
    findUnacknowledged(): Promise<AlertEntity[]>;
    acknowledge(id: string): Promise<void>;
}
//# sourceMappingURL=alert-repository.interface.d.ts.map