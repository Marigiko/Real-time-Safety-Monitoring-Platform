import { Module, Global } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';
import { KafkaConsumerService } from './kafka-consumer.service';

export const KAFKA_CONFIG = 'KAFKA_CONFIG';

interface KafkaConfig {
  clientId: string;
  brokers: string[];
  groupId?: string;
}

function getKafkaConfig(): KafkaConfig {
  return {
    clientId: 'rtsp',
    brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  };
}

@Global()
@Module({
  providers: [
    {
      provide: KAFKA_CONFIG,
      useFactory: getKafkaConfig,
    },
    KafkaProducerService,
    KafkaConsumerService,
  ],
  exports: [KafkaProducerService, KafkaConsumerService, KAFKA_CONFIG],
})
export class KafkaModule {}