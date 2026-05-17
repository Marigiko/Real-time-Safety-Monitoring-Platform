import { Module, Global } from '@nestjs/common';
import { RabbitMQPublisherService } from './rabbitmq-publisher.service';
import { RabbitMQConsumerService } from './rabbitmq-consumer.service';

export const RABBITMQ_CONFIG = 'RABBITMQ_CONFIG';

interface RabbitMQConfig {
  url: string;
  queue: string;
}

function getRabbitMQConfig(): RabbitMQConfig {
  return {
    url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
    queue: process.env.RABBITMQ_QUEUE || 'alerts',
  };
}

@Global()
@Module({
  providers: [
    {
      provide: RABBITMQ_CONFIG,
      useFactory: getRabbitMQConfig,
    },
    RabbitMQPublisherService,
    RabbitMQConsumerService,
  ],
  exports: [RabbitMQPublisherService, RabbitMQConsumerService, RABBITMQ_CONFIG],
})
export class RabbitMQModule {}