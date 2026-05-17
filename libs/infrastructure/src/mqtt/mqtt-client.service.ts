import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MQTT_CONFIG, MqttConfig } from './mqtt.module';

@Injectable()
export class MqttClientService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient | null = null;
  private messageHandlers: Map<string, (topic: string, message: string) => void> = new Map();

  constructor(@Inject(MQTT_CONFIG) private readonly config: MqttConfig) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    this.disconnect();
  }

  private async connect(): Promise<void> {
    const url = `mqtt://${this.config.host}:${this.config.port}`;
    const options: mqtt.IClientOptions = {
      clientId: this.config.clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    };

    if (this.config.username && this.config.password) {
      options.username = this.config.username;
      options.password = this.config.password;
    }

    return new Promise((resolve, reject) => {
      this.client = mqtt.connect(url, options);

      this.client.on('connect', () => {
        console.log(`MQTT connected to ${url}`);
        resolve();
      });

      this.client.on('error', (err) => {
        console.error('MQTT connection error:', err);
        reject(err);
      });

      this.client.on('message', (topic, message) => {
        const handler = this.messageHandlers.get(topic);
        if (handler) {
          handler(topic, message.toString());
        }
      });
    });
  }

  private disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
    }
  }

  subscribe(topic: string, handler: (topic: string, message: string) => void): void {
    if (this.client) {
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`Failed to subscribe to ${topic}:`, err);
        } else {
          this.messageHandlers.set(topic, handler);
        }
      });
    }
  }

  publish(topic: string, message: string): void {
    if (this.client) {
      this.client.publish(topic, message);
    }
  }

  async isHealthy(): Promise<boolean> {
    return this.client?.connected || false;
  }
}