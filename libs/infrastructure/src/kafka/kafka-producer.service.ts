import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { KAFKA_CONFIG, KafkaConfig } from './kafka.module';
import { Telemetry } from '@rtsp/domain';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private producer: Producer;
  private isConnected = false;

  constructor(@Inject(KAFKA_CONFIG) private readonly config: KafkaConfig) {
    this.kafka = new Kafka({
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

  private async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
    }
  }

  private async disconnect(): Promise<void> {
    if (this.isConnected) {
      await this.producer.disconnect();
      this.isConnected = false;
    }
  }

  async sendTelemetry(telemetry: Telemetry, topic = 'telemetry.raw'): Promise<void> {
    const record: ProducerRecord = {
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

  async sendAlert(alert: { id: string; deviceId: string; severity: string; type: string; message: string }, topic = 'alerts'): Promise<void> {
    const record: ProducerRecord = {
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

  async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }
}