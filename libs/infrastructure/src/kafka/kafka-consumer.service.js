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
exports.KafkaConsumerService = void 0;
const common_1 = require("@nestjs/common");
const kafkajs_1 = require("kafkajs");
const kafka_module_1 = require("./kafka.module");
let KafkaConsumerService = class KafkaConsumerService {
    config;
    kafka;
    consumers = new Map();
    constructor(config) {
        this.config = config;
        this.kafka = new kafkajs_1.Kafka({
            clientId: config.clientId,
            brokers: config.brokers,
        });
    }
    async onModuleDestroy() {
        await this.disconnectAll();
    }
    async disconnectAll() {
        for (const [topic, consumer] of this.consumers) {
            await consumer.disconnect();
            this.consumers.delete(topic);
        }
    }
    async subscribe(topic, handler) {
        const groupId = this.config.groupId || `${this.config.clientId}-${topic}`;
        let consumer = this.consumers.get(topic);
        if (!consumer) {
            consumer = this.kafka.consumer({ groupId });
            await consumer.connect();
            this.consumers.set(topic, consumer);
        }
        await consumer.subscribe({ topic, fromBeginning: false });
        await consumer.run({
            eachMessage: async ({ message }) => {
                await handler({
                    key: message.key?.toString() || null,
                    value: message.value?.toString() || '',
                });
            },
        });
    }
    async isHealthy() {
        return this.consumers.size > 0;
    }
};
exports.KafkaConsumerService = KafkaConsumerService;
exports.KafkaConsumerService = KafkaConsumerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(kafka_module_1.KAFKA_CONFIG)),
    __metadata("design:paramtypes", [Object])
], KafkaConsumerService);
//# sourceMappingURL=kafka-consumer.service.js.map