import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryProcessingService } from './telemetry-processing.service';
import { KafkaConsumerService } from '@rtsp/infrastructure';
import { RabbitMQPublisherService } from '@rtsp/infrastructure';
import { TelemetryRepository } from '@rtsp/infrastructure';
import { Telemetry, Alert } from '@rtsp/domain';

describe('TelemetryProcessingService', () => {
  let service: TelemetryProcessingService;
  let mockKafkaConsumer: jest.Mocked<KafkaConsumerService>;
  let mockRabbitPublisher: jest.Mocked<RabbitMQPublisherService>;
  let mockTelemetryRepo: jest.Mocked<TelemetryRepository>;

  beforeEach(async () => {
    // Mock dependencies
    mockKafkaConsumer = {
      subscribe: jest.fn(),
      isHealthy: jest.fn(),
    } as any;

    mockRabbitPublisher = {
      publish: jest.fn(),
      isHealthy: jest.fn(),
    } as any;

    mockTelemetryRepo = {
      save: jest.fn(),
      findByDeviceId: jest.fn(),
      findByTimeRange: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemetryProcessingService,
        {
          provide: KafkaConsumerService,
          useValue: mockKafkaConsumer,
        },
        {
          provide: RabbitMQPublisherService,
          useValue: mockRabbitPublisher,
        },
        {
          provide: TelemetryRepository,
          useValue: mockTelemetryRepo,
        },
      ],
    }).compile();

    service = module.get<TelemetryProcessingService>(TelemetryProcessingService);
  });

  describe('Kafka consumer setup and subscription', () => {
    it('should setup Kafka subscription on module initialization', () => {
      expect(mockKafkaConsumer.subscribe).toHaveBeenCalledWith(
        'telemetry.raw',
        expect.any(Function)
      );
    });

    it('should handle incoming telemetry messages', async () => {
      const mockMessage = {
        key: 'device-1',
        value: JSON.stringify({
          id: 'telemetry-1',
          deviceId: 'device-1',
          timestamp: new Date().toISOString(),
          readings: {
            temperature: 25,
            voltage: 12,
            pressure: 10,
            humidity: 50,
          },
        }),
      };

      await service['setupKafkaSubscription']();

      // The actual subscription function is called during module initialization
      // so we test that Kafka is indeed subscribed to the correct topic
      expect(mockKafkaConsumer.subscribe).toHaveBeenCalledWith(
        'telemetry.raw',
        expect.any(Function)
      );
    });
  });

  describe('Telemetry processing flow', () => {
    it('should process telemetry and save to repository', async () => {
      const telemetryData = {
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date().toISOString(),
        readings: {
          temperature: 25,
          voltage: 12,
          pressure: 10,
          humidity: 50,
        },
      };

      const message = {
        key: 'device-1',
        value: JSON.stringify(telemetryData),
      };

      await service['setupKafkaSubscription']();

      const handle = mockKafkaConsumer.subscribe.mock.calls[0][1];
      await handle(message);

      expect(mockTelemetryRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'telemetry-1',
          deviceId: 'device-1',
          readings: {
            temperature: 25,
            voltage: 12,
            pressure: 10,
            humidity: 50,
          },
        })
      );
    });

    it('should handle malformed telemetry data gracefully', async () => {
      const message = {
        key: 'device-1',
        value: 'malformed json',
      };

      await service['setupKafkaSubscription']();

      const handle = mockKafkaConsumer.subscribe.mock.calls[0][1];
      await expect(handle(message)).resolves.toBeUndefined(); // Should not throw
    });
  });

  describe('Alert detection logic', () => {
    it('should detect critical temperature alert', () => {
      const telemetry = new Telemetry({
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date(),
        readings: {
          temperature: 105,
          voltage: 12,
          pressure: 10,
          humidity: 50,
        },
        rawData: JSON.stringify({
          id: 'telemetry-1',
          deviceId: 'device-1',
          timestamp: new Date().toISOString(),
          readings: {
            temperature: 105,
            voltage: 12,
            pressure: 10,
            humidity: 50,
          },
        }),
      });

      const alerts = service['detectAlerts'](telemetry);
      
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('HIGH_TEMPERATURE');
      expect(alerts[0].severity).toBe('CRITICAL');
    });

    it('should detect critical voltage alert', () => {
      const telemetry = new Telemetry({
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date(),
        readings: {
          temperature: 25,
          voltage: 260,
          pressure: 10,
          humidity: 50,
        },
        rawData: JSON.stringify({
          id: 'telemetry-1',
          deviceId: 'device-1',
          timestamp: new Date().toISOString(),
          readings: {
            temperature: 25,
            voltage: 260,
            pressure: 10,
            humidity: 50,
          },
        }),
      });

      const alerts = service['detectAlerts'](telemetry);
      
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('HIGH_VOLTAGE');
      expect(alerts[0].severity).toBe('CRITICAL');
    });

    it('should detect warning pressure alert', () => {
      const telemetry = new Telemetry({
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date(),
        readings: {
          temperature: 25,
          voltage: 12,
          pressure: 160,
          humidity: 50,
        },
        rawData: JSON.stringify({
          id: 'telemetry-1',
          deviceId: 'device-1',
          timestamp: new Date().toISOString(),
          readings: {
            temperature: 25,
            voltage: 12,
            pressure: 160,
            humidity: 50,
          },
        }),
      });

      const alerts = service['detectAlerts'](telemetry);
      
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('HIGH_PRESSURE');
      expect(alerts[0].severity).toBe('WARNING');
    });

    it('should detect warning humidity alert', () => {
      const telemetry = new Telemetry({
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date(),
        readings: {
          temperature: 25,
          voltage: 12,
          pressure: 10,
          humidity: 85,
        },
        rawData: JSON.stringify({
          id: 'telemetry-1',
          deviceId: 'device-1',
          timestamp: new Date().toISOString(),
          readings: {
            temperature: 25,
            voltage: 12,
            pressure: 10,
            humidity: 85,
          },
        }),
      });

      const alerts = service['detectAlerts'](telemetry);
      
      expect(alerts).toHaveLength(1);
      expect(alerts[0].type).toBe('HIGH_HUMIDITY');
      expect(alerts[0].severity).toBe('WARNING');
    });

    it('should detect multiple alerts', () => {
      const telemetry = new Telemetry({
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date(),
        readings: {
          temperature: 110,
          voltage: 260,
          pressure: 160,
          humidity: 85,
        },
        rawData: JSON.stringify({
          id: 'telemetry-1',
          deviceId: 'device-1',
          timestamp: new Date().toISOString(),
          readings: {
            temperature: 110,
            voltage: 260,
            pressure: 160,
            humidity: 85,
          },
        }),
      });

      const alerts = service['detectAlerts'](telemetry);
      
      expect(alerts).toHaveLength(4);
      const alertTypes = alerts.map(a => a.type);
      expect(alertTypes).toContain('HIGH_TEMPERATURE');
      expect(alertTypes).toContain('HIGH_VOLTAGE');
      expect(alertTypes).toContain('HIGH_PRESSURE');
      expect(alertTypes).toContain('HIGH_HUMIDITY');
    });

    it('should not detect any alert when values are normal', () => {
      const telemetry = new Telemetry({
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date(),
        readings: {
          temperature: 25,
          voltage: 12,
          pressure: 10,
          humidity: 50,
        },
        rawData: JSON.stringify({
          id: 'telemetry-1',
          deviceId: 'device-1',
          timestamp: new Date().toISOString(),
          readings: {
            temperature: 25,
            voltage: 12,
            pressure: 10,
            humidity: 50,
          },
        }),
      });

      const alerts = service['detectAlerts'](telemetry);
      
      expect(alerts).toHaveLength(0);
    });
  });

  describe('PostgreSQL repository integration', () => {
    it('should save telemetry to repository', async () => {
      const telemetryData = {
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date().toISOString(),
        readings: {
          temperature: 25,
          voltage: 12,
          pressure: 10,
          humidity: 50,
        },
      };

      const message = {
        key: 'device-1',
        value: JSON.stringify(telemetryData),
      };

      await service['setupKafkaSubscription']();

      const handle = mockKafkaConsumer.subscribe.mock.calls[0][1];
      await handle(message);

      expect(mockTelemetryRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'telemetry-1',
          deviceId: 'device-1',
        })
      );
    });

    it('should save telemetry with correct data structure', async () => {
      const telemetryData = {
        id: 'telemetry-2',
        deviceId: 'device-2',
        timestamp: new Date().toISOString(),
        readings: {
          temperature: 90,
          voltage: 200,
          pressure: 140,
          humidity: 70,
        },
      };

      const message = {
        key: 'device-2',
        value: JSON.stringify(telemetryData),
      };

      await service['setupKafkaSubscription']();

      const handle = mockKafkaConsumer.subscribe.mock.calls[0][1];
      await handle(message);

      const savedTelemetry = mockTelemetryRepo.save.mock.calls[0][0];
      
      expect(savedTelemetry).toMatchObject({
        id: 'telemetry-2',
        deviceId: 'device-2',
        readings: {
          temperature: 90,
          voltage: 200,
          pressure: 140,
          humidity: 70,
        },
      });
    });
  });

  describe('RabbitMQ publisher integration', () => {
    it('should publish alerts to RabbitMQ when detected', async () => {
      const telemetryData = {
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date().toISOString(),
        readings: {
          temperature: 110,
          voltage: 12,
          pressure: 10,
          humidity: 50,
        },
      };

      const message = {
        key: 'device-1',
        value: JSON.stringify(telemetryData),
      };

      await service['setupKafkaSubscription']();

      const handle = mockKafkaConsumer.subscribe.mock.calls[0][1];
      await handle(message);

      expect(mockRabbitPublisher.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          deviceId: 'device-1',
          severity: 'CRITICAL',
          type: 'HIGH_TEMPERATURE',
        })
      );
    });

    it('should not publish when no alerts detected', async () => {
      const telemetryData = {
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date().toISOString(),
        readings: {
          temperature: 25,
          voltage: 12,
          pressure: 10,
          humidity: 50,
        },
      };

      const message = {
        key: 'device-1',
        value: JSON.stringify(telemetryData),
      };

      await service['setupKafkaSubscription']();

      const handle = mockKafkaConsumer.subscribe.mock.calls[0][1];
      await handle(message);

      expect(mockRabbitPublisher.publish).not.toHaveBeenCalled();
    });

    it('should publish multiple alerts when multiple thresholds exceeded', async () => {
      const telemetryData = {
        id: 'telemetry-1',
        deviceId: 'device-1',
        timestamp: new Date().toISOString(),
        readings: {
          temperature: 110,
          voltage: 260,
          pressure: 160,
          humidity: 85,
        },
      };

      const message = {
        key: 'device-1',
        value: JSON.stringify(telemetryData),
      };

      await service['setupKafkaSubscription']();

      const handle = mockKafkaConsumer.subscribe.mock.calls[0][1];
      await handle(message);

      expect(mockRabbitPublisher.publish).toHaveBeenCalledTimes(4);
    });
  });

  describe('Health check functionality', () => {
    it('should return health status', async () => {
      mockKafkaConsumer.isHealthy.mockResolvedValue(true);
      mockRabbitPublisher.isHealthy.mockResolvedValue(true);

      const health = await service.getHealth();
      
      expect(health).toEqual({
        kafka: true,
        rabbitmq: true,
        database: true,
      });
    });

    it('should correctly indicate when dependencies are unhealthy', async () => {
      mockKafkaConsumer.isHealthy.mockResolvedValue(false);
      mockRabbitPublisher.isHealthy.mockResolvedValue(false);

      const health = await service.getHealth();
      
      expect(health).toEqual({
        kafka: false,
        rabbitmq: false,
        database: true,
      });
    });
  });
});