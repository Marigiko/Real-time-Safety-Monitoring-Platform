import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { KAFKA_CONFIG, KafkaConfig } from './kafka.module';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;
  private consumers: Map<string, Consumer> = new Map();

  constructor(@Inject(KAFKA_CONFIG) private readonly config: KafkaConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
    });
  }

  async onModuleDestroy() {
    await this.disconnectAll();
  }

  private async disconnectAll(): Promise<void> {
    for (const [topic, consumer] of this.consumers) {
      await consumer.disconnect();
      this.consumers.delete(topic);
    }
  }

  async subscribe(
    topic: string,
    handler: (message: { key: string | null; value: string }) => Promise<void>,
  ): Promise<void> {
    const groupId = this.config.groupId || `${this.config.clientId}-${topic}`;

    let consumer = this.consumers.get(topic);
    if (!consumer) {
      consumer = this.kafka.consumer({ groupId });
      await consumer.connect();
      this.consumers.set(topic, consumer);
    }

    await consumer.subscribe({ topic, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ message }: EachMessagePayload) => {
        await handler({
          key: message.key?.toString() || null,
          value: message.value?.toString() || '',
        });
      },
    });
  }

  async isHealthy(): Promise<boolean> {
    return this.consumers.size > 0;
  }
}