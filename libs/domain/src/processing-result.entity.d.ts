import { TelemetryEntity } from './telemetry.entity';
import { AlertEntity } from './alert.entity';
export interface ProcessingResultEntity {
    id: string;
    telemetry: TelemetryEntity;
    alerts: AlertEntity[];
    processedAt: Date;
    processingTimeMs: number;
}
export declare class ProcessingResult {
    readonly id: string;
    readonly telemetry: TelemetryEntity;
    readonly alerts: AlertEntity[];
    readonly processedAt: Date;
    readonly processingTimeMs: number;
    constructor(props: ProcessingResultEntity);
    static create(telemetry: TelemetryEntity, alerts: AlertEntity[], timeMs: number): ProcessingResult;
    hasAlerts(): boolean;
    hasCriticalAlerts(): boolean;
}
//# sourceMappingURL=processing-result.entity.d.ts.map