"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telemetry = void 0;
class Telemetry {
    id;
    deviceId;
    timestamp;
    readings;
    rawData;
    constructor(props) {
        this.id = props.id;
        this.deviceId = props.deviceId;
        this.timestamp = props.timestamp;
        this.readings = props.readings;
        this.rawData = props.rawData;
    }
    static create(data) {
        return new Telemetry({
            id: crypto.randomUUID(),
            deviceId: data.deviceId,
            timestamp: new Date(),
            readings: data.payload,
            rawData: data.rawData,
        });
    }
}
exports.Telemetry = Telemetry;
//# sourceMappingURL=telemetry.entity.js.map