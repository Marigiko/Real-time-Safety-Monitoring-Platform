import { Injectable } from '@nestjs/common';
import { AlertService } from './alert-handler.interface';
import { AlertSeverity, AlertType } from '@rtsp/domain';

@Injectable()
export class ConsoleAlertHandler implements AlertService {
  async handle(alert: {
    id: string;
    deviceId: string;
    severity: AlertSeverity;
    type: AlertType;
    message: string;
    timestamp: string;
  }): Promise<void> {
    const color = this.getSeverityColor(alert.severity);
    console.log(
      `${color}[${alert.severity}]${'\x1b[0m'} ${alert.timestamp} - ${alert.deviceId}: ${alert.message}`
    );
  }

  private getSeverityColor(severity: AlertSeverity): string {
    switch (severity) {
      case 'CRITICAL':
        return '\x1b[31m';
      case 'WARNING':
        return '\x1b[33m';
      case 'INFO':
        return '\x1b[36m';
      default:
        return '\x1b[0m';
    }
  }
}