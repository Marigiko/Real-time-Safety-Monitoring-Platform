"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQModule = exports.RABBITMQ_CONFIG = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_publisher_service_1 = require("./rabbitmq-publisher.service");
const rabbitmq_consumer_service_1 = require("./rabbitmq-consumer.service");
exports.RABBITMQ_CONFIG = 'RABBITMQ_CONFIG';
function getRabbitMQConfig() {
    return {
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        queue: process.env.RABBITMQ_QUEUE || 'alerts',
    };
}
let RabbitMQModule = class RabbitMQModule {
};
exports.RabbitMQModule = RabbitMQModule;
exports.RabbitMQModule = RabbitMQModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: exports.RABBITMQ_CONFIG,
                useFactory: getRabbitMQConfig,
            },
            rabbitmq_publisher_service_1.RabbitMQPublisherService,
            rabbitmq_consumer_service_1.RabbitMQConsumerService,
        ],
        exports: [rabbitmq_publisher_service_1.RabbitMQPublisherService, rabbitmq_consumer_service_1.RabbitMQConsumerService, exports.RABBITMQ_CONFIG],
    })
], RabbitMQModule);
//# sourceMappingURL=rabbitmq.module.js.map