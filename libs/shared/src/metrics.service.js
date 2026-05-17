"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
let MetricsService = class MetricsService {
    counters = new Map();
    gauges = new Map();
    histograms = new Map();
    getMetricKey(name, labels) {
        const labelStr = Object.entries(labels).sort().map(([k, v]) => `${k}=${v}`).join(',');
        return `${name}{${labelStr}}`;
    }
    counter(name, labels = {}, value = 1) {
        const key = this.getMetricKey(name, labels);
        const existing = this.counters.get(key);
        if (existing) {
            existing.value += value;
        }
        else {
            this.counters.set(key, { name, labels, value });
        }
    }
    gauge(name, labels = {}, value) {
        const key = this.getMetricKey(name, labels);
        this.gauges.set(key, { name, labels, value });
    }
    histogram(name, labels = {}, value) {
        const key = this.getMetricKey(name, labels);
        const existing = this.histograms.get(key);
        if (existing) {
            existing.value = value;
            existing.count += 1;
            existing.sum += value;
        }
        else {
            this.histograms.set(key, { name, labels, value, count: 1, sum: value });
        }
    }
    getMetrics() {
        const lines = [];
        for (const metric of this.counters.values()) {
            const labelStr = Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',');
            lines.push(`# TYPE ${metric.name} counter`);
            lines.push(`${metric.name}{${labelStr}} ${metric.value}`);
        }
        for (const metric of this.gauges.values()) {
            const labelStr = Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',');
            lines.push(`# TYPE ${metric.name} gauge`);
            lines.push(`${metric.name}{${labelStr}} ${metric.value}`);
        }
        for (const metric of this.histograms.values()) {
            const labelStr = Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',');
            lines.push(`# TYPE ${metric.name} histogram`);
            lines.push(`${metric.name}_count{${labelStr}} ${metric.count}`);
            lines.push(`${metric.name}_sum{${labelStr}} ${metric.sum}`);
        }
        return lines.join('\n');
    }
    reset() {
        this.counters.clear();
        this.gauges.clear();
        this.histograms.clear();
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)()
], MetricsService);
//# sourceMappingURL=metrics.service.js.map