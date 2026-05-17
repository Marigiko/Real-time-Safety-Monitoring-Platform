import { Injectable, OnModuleInit } from '@nestjs/common';
import { KafkaConsumerService } from '@rtsp/infrastructure';
import { RabbitMQPublisherService } from '@rtsp/infrastructure';
import { TelemetryRepository } from '@rtsp/infrastructure';
import { Telemetry, Alert, AlertSeverity, AlertType } from '@rtsp/domain';

interface TelemetryMessage {
  key: string | null;
  value: string;
}

@Injectable()
export class TelemetryProcessingService implements OnModuleInit {
  constructor(
    private readonly kafkaConsumer: KafkaConsumerService,
    private readonly rabbitPublisher: RabbitMQPublisherService,
    private readonly telemetryRepo: TelemetryRepository,
  ) {}

  onModuleInit() {
    this.setupKafkaSubscription();
  }

  private async setupKafkaSubscription() {
    await this.kafkaConsumer.subscribe('telemetry.raw', async (msg: TelemetryMessage) => {
      try {
        const data = JSON.parse(msg.value);
        
        const telemetry = new Telemetry({
          id: data.id,
          deviceId: data.deviceId,
          timestamp: new Date(data.timestamp),
          readings: data.readings,
          rawData: msg.value,
        });

        await this.telemetryRepo.save(telemetry);

        const alerts = this.detectAlerts(telemetry);

        if (alerts.length > 0) {
          for (const alert of alerts) {
            await this.rabbitPublisher.publish({
              id: alert.id,
              deviceId: alert.deviceId,
              severity: alert.severity,
              type: alert.type,
              message: alert.message,
              timestamp: alert.timestamp.toISOString(),
              acknowledged: alert.acknowledged,
            });
          }
        }
      } catch (error) {
        console.error('Failed to process telemetry:', error);
      }
    });
  }

  private detectAlerts(telemetry: Telemetry): Alert[] {
    const alerts: Alert[] = [];
    const readings = telemetry.readings;

    if (readings.temperature > 100) {
      alerts.push(Alert.create({
        deviceId: telemetry.deviceId,
        severity: 'CRITICAL' as AlertSeverity,
        type: 'HIGH_TEMPERATURE' as AlertType,
        message: `Temperature critical: ${readings.temperature}°C (threshold: 100°C)`,
        metadata: { temperature: readings.temperature, threshold: 100 },
      }));
    }

    if (readings.voltage > 250) {
      alerts.push(Alert.create({
        deviceId: telemetry.deviceId,
        severity: 'CRITICAL' as AlertSeverity,
        type: 'HIGH_VOLTAGE' as AlertType,
        message: `Voltage critical: ${readings.voltage}V (threshold: 250V)`,
        metadata: { voltage: readings.voltage, threshold: 250 },
      }));
    }

    if (readings.pressure > 150) {
      alerts.push(Alert.create({
        deviceId: telemetry.deviceId,
        severity: 'WARNING' as AlertSeverity,
        type: 'HIGH_PRESSURE' as AlertType,
        message: `Pressure warning: ${readings.pressure} PSI (threshold: 150 PSI)`,
        metadata: { pressure: readings.pressure, threshold: 150 },
      }));
    }

    if (readings.humidity > 80) {
      alerts.push(Alert.create({
        deviceId: telemetry.deviceId,
        severity: 'WARNING' as AlertSeverity,
        type: 'HIGH_HUMIDITY' as AlertType,
        message: `Humidity warning: ${readings.humidity}% (threshold: 80%)`,
        metadata: { humidity: readings.humidity, threshold: 80 },
      }));
    }

    return alerts;
  }

  async getHealth(): Promise<{ kafka: boolean; rabbitmq: boolean; database: boolean }> {
    const kafkaHealth = await this.kafkaConsumer.isHealthy();
    const rabbitmqHealth = await this.rabbitPublisher.isHealthy();
    const databaseHealth = true;

    return {
      kafka: kafkaHealth,
      rabbitmq: rabbitmqHealth,
      database: databaseHealth,
    };
  }
}