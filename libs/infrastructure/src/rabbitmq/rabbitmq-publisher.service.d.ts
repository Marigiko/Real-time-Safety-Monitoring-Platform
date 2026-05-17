import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
interface RabbitMQConfig {
    url: string;
    queue: string;
}
export declare class RabbitMQPublisherService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private connection;
    private channel;
    constructor(config: RabbitMQConfig);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private disconnect;
    publish(message: object): Promise<boolean>;
    isHealthy(): Promise<boolean>;
}
export {};
//# sourceMappingURL=rabbitmq-publisher.service.d.ts.map