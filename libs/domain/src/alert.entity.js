"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Alert = void 0;
class Alert {
    id;
    deviceId;
    severity;
    type;
    message;
    timestamp;
    acknowledged;
    metadata;
    constructor(props) {
        this.id = props.id;
        this.deviceId = props.deviceId;
        this.severity = props.severity;
        this.type = props.type;
        this.message = props.message;
        this.timestamp = props.timestamp;
        this.acknowledged = props.acknowledged;
        this.metadata = props.metadata;
    }
    static create(props) {
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
    acknowledge() {
        return new Alert({
            ...this,
            acknowledged: true,
        });
    }
}
exports.Alert = Alert;
//# sourceMappingURL=alert.entity.js.map