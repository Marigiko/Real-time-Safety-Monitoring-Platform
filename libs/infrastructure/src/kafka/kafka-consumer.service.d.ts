import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
interface KafkaConfig {
    clientId: string;
    brokers: string[];
    groupId?: string;
}
export declare class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private kafka;
    private consumers;
    constructor(config: KafkaConfig);
    onModuleDestroy(): Promise<void>;
    private disconnectAll;
    subscribe(topic: string, handler: (message: {
        key: string | null;
        value: string;
    }) => Promise<void>): Promise<void>;
    isHealthy(): Promise<boolean>;
}
export {};
//# sourceMappingURL=kafka-consumer.service.d.ts.map