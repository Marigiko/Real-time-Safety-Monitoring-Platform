import { AlertSeverity, AlertType } from '@rtsp/domain';

export interface AlertService {
  handle(alert: {
    id: string;
    deviceId: string;
    severity: AlertSeverity;
    type: AlertType;
    message: string;
    timestamp: string;
  }): Promise<void>;
}