import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Telemetry } from "@rtsp/domain";
interface KafkaConfig {
    clientId: string;
    brokers: string[];
    groupId?: string;
}
export declare class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
    private readonly config;
    private kafka;
    private producer;
    private isConnected;
    constructor(config: KafkaConfig);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private connect;
    private disconnect;
    sendTelemetry(telemetry: Telemetry, topic?: string): Promise<void>;
    sendAlert(alert: {
        id: string;
        deviceId: string;
        severity: string;
        type: string;
        message: string;
    }, topic?: string): Promise<void>;
    isHealthy(): Promise<boolean>;
}
export {};
//# sourceMappingURL=kafka-producer.service.d.ts.map