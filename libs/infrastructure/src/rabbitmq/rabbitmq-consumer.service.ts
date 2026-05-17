import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RABBITMQ_CONFIG, RabbitMQConfig } from './rabbitmq.module';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(@Inject(RABBITMQ_CONFIG) private readonly config: RabbitMQConfig) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.config.url);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.config.queue, { durable: true });
      await this.channel.prefetch(10);
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }

  private async disconnect(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error);
    }
  }

  async consume(handler: (message: object) => Promise<void>): Promise<void> {
    if (!this.channel) {
      await this.connect();
    }
    if (!this.channel) {
      return;
    }

    await this.channel.consume(this.config.queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await handler(content);
          this.channel?.ack(msg);
        } catch (error) {
          console.error('Error processing message:', error);
          this.channel?.nack(msg, false, false);
        }
      }
    });
  }

  async isHealthy(): Promise<boolean> {
    return this.channel !== null;
  }
}