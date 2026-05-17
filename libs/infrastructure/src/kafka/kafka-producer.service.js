"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaProducerService = void 0;
const common_1 = require("@nestjs/common");
const kafkajs_1 = require("kafkajs");
const kafka_module_1 = require("./kafka.module");
let KafkaProducerService = class KafkaProducerService {
    config;
    kafka;
    producer;
    isConnected = false;
    constructor(config) {
        this.config = config;
        this.kafka = new kafkajs_1.Kafka({
            clientId: config.clientId,
            brokers: config.brokers,
        });
        this.producer = this.kafka.producer();
    }
    async onModuleInit() {
        await this.connect();
    }
    async onModuleDestroy() {
        await this.disconnect();
    }
    async connect() {
        if (!this.isConnected) {
            await this.producer.connect();
            this.isConnected = true;
        }
    }
    async disconnect() {
        if (this.isConnected) {
            await this.producer.disconnect();
            this.isConnected = false;
        }
    }
    async sendTelemetry(telemetry, topic = 'telemetry.raw') {
        const record = {
            topic,
            messages: [
                {
                    key: telemetry.deviceId,
                    value: JSON.stringify({
                        id: telemetry.id,
                        deviceId: telemetry.deviceId,
                        timestamp: telemetry.timestamp.toISOString(),
                        readings: telemetry.readings,
                    }),
                },
            ],
        };
        await this.producer.send(record);
    }
    async sendAlert(alert, topic = 'alerts') {
        const record = {
            topic,
            messages: [
                {
                    key: alert.deviceId,
                    value: JSON.stringify(alert),
                },
            ],
        };
        await this.producer.send(record);
    }
    async isHealthy() {
        return this.isConnected;
    }
};
exports.KafkaProducerService = KafkaProducerService;
exports.KafkaProducerService = KafkaProducerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(kafka_module_1.KAFKA_CONFIG)),
    __metadata("design:paramtypes", [Object])
], KafkaProducerService);
//# sourceMappingURL=kafka-producer.service.js.map