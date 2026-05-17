"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const common_1 = require("@nestjs/common");
let HealthService = class HealthService {
    checks = new Map();
    registerCheck(name, checkFn) {
        this.checks.set(name, checkFn);
    }
    async checkAll() {
        const results = [];
        for (const [name, checkFn] of this.checks) {
            try {
                const result = await checkFn();
                results.push(result);
            }
            catch (error) {
                results.push({
                    status: 'unhealthy',
                    service: name,
                    timestamp: new Date(),
                    details: { error: error.message },
                });
            }
        }
        return results;
    }
    async getHealth() {
        const results = await this.checkAll();
        const hasUnhealthy = results.some(r => r.status === 'unhealthy');
        const hasDegraded = results.some(r => r.status === 'degraded');
        let status;
        if (hasUnhealthy)
            status = 'unhealthy';
        else if (hasDegraded)
            status = 'degraded';
        else
            status = 'healthy';
        return { status, services: results };
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, common_1.Injectable)()
], HealthService);
//# sourceMappingURL=health.service.js.map