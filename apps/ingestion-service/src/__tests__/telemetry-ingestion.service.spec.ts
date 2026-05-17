import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryIngestionService } from '../telemetry-ingestion.service';
import { MqttClientService } from '@rtsp/infrastructure';
import { KafkaProducerService } from '@rtsp/infrastructure';
import { Telemetry } from '@rtsp/domain';

// Mock services
const mockMqttClientService = {
  subscribe: jest.fn(),
  isHealthy: jest.fn(),
};

const mockKafkaProducerService = {
  sendTelemetry: jest.fn(),
  isHealthy: jest.fn(),
};

describe('TelemetryIngestionService', () => {
  let service: TelemetryIngestionService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        TelemetryIngestionService,
        {
          provide: MqttClientService,
          useValue: mockMqttClientService,
        },
        {
          provide: KafkaProducerService,
          useValue: mockKafkaProducerService,
        },
      ],
    }).compile();

    service = module.get<TelemetryIngestionService>(TelemetryIngestionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('MQTT subscription setup', () => {
    it('should setup MQTT subscription on module initialization', () => {
      // Mock onModuleInit to execute
      const onModuleInitSpy = jest.spyOn(service, 'onModuleInit' as any);
      
      // Call the method directly for testing
      service.onModuleInit();
      
      expect(mockMqttClientService.subscribe).toHaveBeenCalledWith(
        'telemetry/#',
        expect.any(Function)
      );
      expect(onModuleInitSpy).toHaveBeenCalled();
    });
  });

  describe('Telemetry ingestion flow', () => {
    const mockTelemetryData = {
      deviceId: 'device-123',
      payload: {
        temperature: 25.5,
        voltage: 12.1,
        pressure: 1013.25,
        humidity: 65.2
      }
    };

    const mockTelemetryResponse = new Telemetry({
      id: 'test-id',
      deviceId: 'device-123',
      timestamp: new Date(),
      readings: {
        temperature: 25.5,
        voltage: 12.1,
        pressure: 1013.25,
        humidity: 65.2
      },
      rawData: JSON.stringify({
        temperature: 25.5,
        voltage: 12.1,
        pressure: 1013.25,
        humidity: 65.2
      })
    });

    it('should ingest telemetry data successfully', async () => {
      mockKafkaProducerService.sendTelemetry.mockResolvedValue(undefined);

      const result = await service.ingest(mockTelemetryData);

      expect(result).toBeDefined();
      expect(mockKafkaProducerService.sendTelemetry).toHaveBeenCalledWith(
        expect.any(Telemetry)
      );
    });

    it('should handle telemetry ingestion with valid data', async () => {
      mockKafkaProducerService.sendTelemetry.mockResolvedValue(undefined);

      const result = await service.ingest(mockTelemetryData);
      
      expect(result).toBeInstanceOf(Telemetry);
      expect(mockKafkaProducerService.sendTelemetry).toHaveBeenCalledWith(
        expect.any(Telemetry)
      );
    });
  });

  describe('Error handling for MQTT messages', () => {
    it('should handle invalid JSON in MQTT messages gracefully', async () => {
      // Mock the subscribe method to simulate an invalid JSON message
      const mockSubscribe = jest.fn();
      mockMqttClientService.subscribe = mockSubscribe;
      
      // Setup the service
      await service.onModuleInit();
      
      // Simulate an invalid JSON message
      const mockHandler = mockSubscribe.mock.calls[0][1];
      
      // This should not throw when invalid JSON is received
      expect(() => {
        mockHandler('telemetry/device-123', 'invalid json');
      }).not.toThrow();
    });

    it('should handle missing data in MQTT messages gracefully', async () => {
      const mockSubscribe = jest.fn();
      mockMqttClientService.subscribe = mockSubscribe;
      
      // Setup the service
      await service.onModuleInit();
      
      // Simulate a message with missing data
      const mockHandler = mockSubscribe.mock.calls[0][1];
      
      // This should not throw when data is missing
      expect(() => {
        mockHandler('telemetry/device-123', '{"temperature": 25}');
      }).not.toThrow();
    });
  });

  describe('Kafka producer integration', () => {
    const mockTelemetryData = {
      deviceId: 'device-123',
      payload: {
        temperature: 25.5,
        voltage: 12.1,
        pressure: 1013.25,
        humidity: 65.2
      }
    };

    it('should send telemetry to Kafka producer', async () => {
      mockKafkaProducerService.sendTelemetry.mockResolvedValue(undefined);

      await service.ingest(mockTelemetryData);

      expect(mockKafkaProducerService.sendTelemetry).toHaveBeenCalledWith(
        expect.any(Telemetry)
      );
    });

    it('should handle Kafka producer send failure', async () => {
      mockKafkaProducerService.sendTelemetry.mockRejectedValue(new Error('Kafka send failed'));

      await expect(service.ingest(mockTelemetryData)).rejects.toThrow('Kafka send failed');
    });
  });

  describe('Health check functionality', () => {
    it('should return health status with MQTT and Kafka status', async () => {
      mockMqttClientService.isHealthy.mockResolvedValue(true);
      mockKafkaProducerService.isHealthy.mockResolvedValue(true);

      const result = await service.getHealth();

      expect(result).toEqual({
        mqtt: true,
        kafka: true
      });
    });

    it('should return unhealthy status when either dependency is unhealthy', async () => {
      mockMqttClientService.isHealthy.mockResolvedValue(false);
      mockKafkaProducerService.isHealthy.mockResolvedValue(true);

      const result = await service.getHealth();

      expect(result).toEqual({
        mqtt: false,
        kafka: true
      });
    });
  });
});