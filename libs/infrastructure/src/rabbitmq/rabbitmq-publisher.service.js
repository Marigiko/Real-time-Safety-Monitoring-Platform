"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQPublisherService = void 0;
const common_1 = require("@nestjs/common");
const amqp = __importStar(require("amqplib"));
const rabbitmq_module_1 = require("./rabbitmq.module");
let RabbitMQPublisherService = class RabbitMQPublisherService {
    config;
    connection = null;
    channel = null;
    constructor(config) {
        this.config = config;
    }
    async onModuleInit() {
        await this.connect();
    }
    async onModuleDestroy() {
        await this.disconnect();
    }
    async connect() {
        try {
            this.connection = await amqp.connect(this.config.url);
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue(this.config.queue, { durable: true });
        }
        catch (error) {
            console.error('Failed to connect to RabbitMQ:', error);
        }
    }
    async disconnect() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
        }
        catch (error) {
            console.error('Error disconnecting from RabbitMQ:', error);
        }
    }
    async publish(message) {
        if (!this.channel) {
            await this.connect();
        }
        if (!this.channel) {
            return false;
        }
        const buffer = Buffer.from(JSON.stringify(message));
        return this.channel.sendToQueue(this.config.queue, buffer, { persistent: true });
    }
    async isHealthy() {
        return this.channel !== null;
    }
};
exports.RabbitMQPublisherService = RabbitMQPublisherService;
exports.RabbitMQPublisherService = RabbitMQPublisherService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(rabbitmq_module_1.RABBITMQ_CONFIG)),
    __metadata("design:paramtypes", [Object])
], RabbitMQPublisherService);
//# sourceMappingURL=rabbitmq-publisher.service.js.map