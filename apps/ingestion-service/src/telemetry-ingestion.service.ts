import { Injectable, OnModuleInit } from '@nestjs/common';
import { MqttClientService } from '@rtsp/infrastructure';
import { KafkaProducerService } from '@rtsp/infrastructure';
import { Telemetry, TelemetryReading } from '@rtsp/domain';

interface IngestInput {
  deviceId: string;
  payload: TelemetryReading;
}

@Injectable()
export class TelemetryIngestionService implements OnModuleInit {
  constructor(
    private readonly mqttClient: MqttClientService,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  onModuleInit() {
    this.setupMqttSubscription();
  }

  private setupMqttSubscription() {
    this.mqttClient.subscribe('telemetry/#', async (topic, message) => {
      try {
        const data = JSON.parse(message);
        const deviceId = topic.split('/')[1] || data.deviceId;
        
        await this.ingest({
          deviceId,
          payload: {
            temperature: data.temperature,
            voltage: data.voltage,
            pressure: data.pressure,
            humidity: data.humidity,
          },
        });
      } catch (error) {
        console.error('Failed to process MQTT message:', error);
      }
    });
  }

  async ingest(input: IngestInput): Promise<Telemetry> {
    const telemetry = Telemetry.create({
      deviceId: input.deviceId,
      payload: input.payload,
      rawData: JSON.stringify(input.payload),
    });

    await this.kafkaProducer.sendTelemetry(telemetry);
    
    return telemetry;
  }

  async getHealth(): Promise<{ mqtt: boolean; kafka: boolean }> {
    const mqttHealth = await this.mqttClient.isHealthy();
    const kafkaHealth = await this.kafkaProducer.isHealthy();
    
    return {
      mqtt: mqttHealth,
      kafka: kafkaHealth,
    };
  }
}