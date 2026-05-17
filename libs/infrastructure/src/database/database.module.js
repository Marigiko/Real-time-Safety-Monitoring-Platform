"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = exports.DATABASE_CONFIG = void 0;
const common_1 = require("@nestjs/common");
const telemetry_repository_1 = require("./telemetry.repository");
const alert_repository_1 = require("./alert.repository");
exports.DATABASE_CONFIG = 'DATABASE_CONFIG';
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.DATABASE_CONFIG,
                useValue: {
                    host: process.env.POSTGRES_HOST || 'localhost',
                    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
                    username: process.env.POSTGRES_USER || 'rtsp',
                    password: process.env.POSTGRES_PASSWORD || 'rtsp',
                    database: process.env.POSTGRES_DB || 'rtsp',
                },
            },
            telemetry_repository_1.TelemetryRepository,
            alert_repository_1.AlertRepository,
        ],
        exports: [telemetry_repository_1.TelemetryRepository, alert_repository_1.AlertRepository, exports.DATABASE_CONFIG],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map