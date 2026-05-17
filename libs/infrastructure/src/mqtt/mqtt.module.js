"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttModule = exports.MQTT_CONFIG = void 0;
const common_1 = require("@nestjs/common");
const mqtt_client_service_1 = require("./mqtt-client.service");
exports.MQTT_CONFIG = 'MQTT_CONFIG';
let MqttModule = class MqttModule {
};
exports.MqttModule = MqttModule;
exports.MqttModule = MqttModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.MQTT_CONFIG,
                useValue: {
                    host: process.env.MQTT_HOST || 'localhost',
                    port: parseInt(process.env.MQTT_PORT || '1883', 10),
                    username: process.env.MQTT_USERNAME,
                    password: process.env.MQTT_PASSWORD,
                    clientId: `rtsp-${process.env.HOSTNAME || 'client'}-${Math.random().toString(36).substr(2, 9)}`,
                },
            },
            mqtt_client_service_1.MqttClientService,
        ],
        exports: [mqtt_client_service_1.MqttClientService, exports.MQTT_CONFIG],
    })
], MqttModule);
//# sourceMappingURL=mqtt.module.js.map