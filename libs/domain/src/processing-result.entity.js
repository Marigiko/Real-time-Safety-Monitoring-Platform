"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingResult = void 0;
class ProcessingResult {
    id;
    telemetry;
    alerts;
    processedAt;
    processingTimeMs;
    constructor(props) {
        this.id = props.id;
        this.telemetry = props.telemetry;
        this.alerts = props.alerts;
        this.processedAt = props.processedAt;
        this.processingTimeMs = props.processingTimeMs;
    }
    static create(telemetry, alerts, timeMs) {
        return new ProcessingResult({
            id: crypto.randomUUID(),
            telemetry,
            alerts,
            processedAt: new Date(),
            processingTimeMs: timeMs,
        });
    }
    hasAlerts() {
        return this.alerts.length > 0;
    }
    hasCriticalAlerts() {
        return this.alerts.some(a => a.severity === 'CRITICAL');
    }
}
exports.ProcessingResult = ProcessingResult;
//# sourceMappingURL=processing-result.entity.js.map