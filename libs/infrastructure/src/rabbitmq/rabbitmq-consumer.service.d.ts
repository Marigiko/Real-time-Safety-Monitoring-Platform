import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
interface RabbitMQConfig {
    url: string;
    queue: string;
}
export declare class RabbitMQConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private connection;
    private channel;
    constructor(config: RabbitMQConfig);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private disconnect;
    consume(handler: (message: object) => Promise<void>): Promise<void>;
    isHealthy(): Promise<boolean>;
}
export {};
//# sourceMappingURL=rabbitmq-consumer.service.d.ts.map