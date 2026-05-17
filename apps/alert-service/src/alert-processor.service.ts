import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { RabbitMQConsumerService } from '@rtsp/infrastructure';
import { AlertService } from './notification-handlers/alert-handler.interface';
import { AlertSeverity, AlertType } from '@rtsp/domain';

interface AlertMessage {
  id: string;
  deviceId: string;
  severity: AlertSeverity;
  type: AlertType;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

@Injectable()
export class AlertProcessorService implements OnModuleInit {
  constructor(
    private readonly rabbitConsumer: RabbitMQConsumerService,
    @Inject('CONSOLE_HANDLER') private readonly consoleHandler: AlertService,
  ) {}

  onModuleInit() {
    this.setupAlertConsumption();
  }

  private async setupAlertConsumption() {
    await this.rabbitConsumer.consume(async (message: unknown) => {
      try {
        const alert = message as AlertMessage;
        console.log(`[ALERT] ${alert.severity}: ${alert.message} (${alert.deviceId})`);
        
        await this.consoleHandler.handle(alert);
      } catch (error) {
        console.error('Failed to process alert:', error);
      }
    });
  }

  async getHealth(): Promise<{ rabbitmq: boolean }> {
    const rabbitmqHealth = await this.rabbitConsumer.isHealthy();
    return { rabbitmq: rabbitmqHealth };
  }
}