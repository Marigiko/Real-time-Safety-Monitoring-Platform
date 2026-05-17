import { Module, Global } from '@nestjs/common';
import { RabbitMQPublisherService } from './rabbitmq-publisher.service';
import { RabbitMQConsumerService } from './rabbitmq-consumer.service';

export const RABBITMQ_CONFIG = 'RABBITMQ_CONFIG';

export interface RabbitMQConfig {
  url: string;
  queue: string;
}

@Global()
@Module({
  providers: [
    {
      provide: RABBITMQ_CONFIG,
      useValue: {
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        queue: process.env.RABBITMQ_QUEUE || 'alerts',
      } as RabbitMQConfig,
    },
    RabbitMQPublisherService,
    RabbitMQConsumerService,
  ],
  exports: [RabbitMQPublisherService, RabbitMQConsumerService, RABBITMQ_CONFIG],
})
export class RabbitMQModule {}