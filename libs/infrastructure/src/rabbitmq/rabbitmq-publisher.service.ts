import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RABBITMQ_CONFIG, RabbitMQConfig } from './rabbitmq.module';

@Injectable()
export class RabbitMQPublisherService implements OnModuleInit, OnModuleDestroy {
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

  async publish(message: object): Promise<boolean> {
    if (!this.channel) {
      await this.connect();
    }
    if (!this.channel) {
      return false;
    }

    const buffer = Buffer.from(JSON.stringify(message));
    return this.channel.sendToQueue(this.config.queue, buffer, { persistent: true });
  }

  async isHealthy(): Promise<boolean> {
    return this.channel !== null;
  }
}