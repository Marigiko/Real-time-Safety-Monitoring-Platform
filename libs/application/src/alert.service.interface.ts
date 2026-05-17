import { Alert } from '@rtsp/domain';

export interface AlertService {
  publishAlerts(alerts: Alert[]): Promise<void>;
  subscribe(handler: (alert: Alert) => void): Promise<void>;
}