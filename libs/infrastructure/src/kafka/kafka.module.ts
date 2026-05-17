import { Module, Global } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service';

export const KAFKA_CONFIG = 'KAFKA_CONFIG';

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  groupId?: string;
}

@Global()
@Module({
  providers: [
    {
      provide: KAFKA_CONFIG,
      useValue: {
        clientId: 'rtsp',
        brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
      } as KafkaConfig,
    },
    KafkaProducerService,
    KafkaConsumerService,
  ],
  exports: [KafkaProducerService, KafkaConsumerService, KAFKA_CONFIG],
})
export class KafkaModule {}