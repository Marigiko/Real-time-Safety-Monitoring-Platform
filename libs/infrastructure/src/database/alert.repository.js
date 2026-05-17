"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertRepository = void 0;
const common_1 = require("@nestjs/common");
let AlertRepository = class AlertRepository {
    alertStore = [];
    async save(alert) {
        this.alertStore.push(alert);
    }
    async findAll(limit = 100, offset = 0) {
        return this.alertStore.slice(offset, offset + limit);
    }
    async findByDeviceId(deviceId) {
        return this.alertStore.filter(a => a.deviceId === deviceId);
    }
    async findBySeverity(severity) {
        return this.alertStore.filter(a => a.severity === severity);
    }
    async findUnacknowledged() {
        return this.alertStore.filter(a => !a.acknowledged);
    }
    async acknowledge(id) {
        const index = this.alertStore.findIndex(a => a.id === id);
        if (index !== -1) {
            this.alertStore[index] = {
                ...this.alertStore[index],
                acknowledged: true,
            };
        }
    }
    async findById(id) {
        return this.alertStore.find(a => a.id === id) || null;
    }
};
exports.AlertRepository = AlertRepository;
exports.AlertRepository = AlertRepository = __decorate([
    (0, common_1.Injectable)()
], AlertRepository);
//# sourceMappingURL=alert.repository.js.map