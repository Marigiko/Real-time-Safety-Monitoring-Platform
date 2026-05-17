"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryRepository = void 0;
const common_1 = require("@nestjs/common");
let TelemetryRepository = class TelemetryRepository {
    telemetryStore = [];
    async save(telemetry) {
        this.telemetryStore.push(telemetry);
    }
    async findByDeviceId(deviceId, limit = 100) {
        const filtered = this.telemetryStore.filter(t => t.deviceId === deviceId);
        return filtered.slice(-limit);
    }
    async findByTimeRange(start, end) {
        return this.telemetryStore.filter(t => t.timestamp >= start && t.timestamp <= end);
    }
    async findAll(limit = 1000) {
        return this.telemetryStore.slice(-limit);
    }
    async findById(id) {
        return this.telemetryStore.find(t => t.id === id) || null;
    }
};
exports.TelemetryRepository = TelemetryRepository;
exports.TelemetryRepository = TelemetryRepository = __decorate([
    (0, common_1.Injectable)()
], TelemetryRepository);
//# sourceMappingURL=telemetry.repository.js.map