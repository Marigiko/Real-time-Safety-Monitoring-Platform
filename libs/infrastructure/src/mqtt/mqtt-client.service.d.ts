import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
interface MqttConfig {
    host: string;
    port: number;
    username?: string;
    password?: string;
    clientId: string;
}
export declare class MqttClientService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private client;
    private messageHandlers;
    constructor(config: MqttConfig);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private disconnect;
    subscribe(topic: string, handler: (topic: string, message: string) => void): void;
    publish(topic: string, message: string): void;
    isHealthy(): Promise<boolean>;
}
export {};
//# sourceMappingURL=mqtt-client.service.d.ts.map