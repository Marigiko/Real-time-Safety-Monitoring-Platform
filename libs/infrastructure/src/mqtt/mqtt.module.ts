import { Module, Global } from '@nestjs/common';
import { MqttClientService } from './mqtt-client.service';

export const MQTT_CONFIG = 'MQTT_CONFIG';

interface MqttConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  clientId: string;
}

@Global()
@Module({
  providers: [
    {
      provide: MQTT_CONFIG,
      useValue: {
        host: process.env.MQTT_HOST || 'localhost',
        port: parseInt(process.env.MQTT_PORT || '1883', 10),
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD,
        clientId: `rtsp-${process.env.HOSTNAME || 'client'}-${Math.random().toString(36).substr(2, 9)}`,
      } as MqttConfig,
    },
    MqttClientService,
  ],
  exports: [MqttClientService, MQTT_CONFIG],
})
export class MqttModule {}