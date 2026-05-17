import { Test, TestingModule } from '@nestjs/testing';
import { AlertProcessorService } from './alert-processor.service';
import { RabbitMQConsumerService } from '@rtsp/infrastructure';
import { ConsoleAlertHandler } from './notification-handlers/console-handler.service';

describe('AlertProcessorService', () => {
  let service: AlertProcessorService;
  let mockRabbitConsumer: jest.Mocked<RabbitMQConsumerService>;
  let mockConsoleHandler: jest.Mocked<ConsoleAlertHandler>;

  beforeEach(async () => {
    // Mock RabbitMQ consumer service
    mockRabbitConsumer = {
      consume: jest.fn(),
      isHealthy: jest.fn(),
    } as any;

    // Mock console handler
    mockConsoleHandler = {
      handle: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertProcessorService,
        {
          provide: RabbitMQConsumerService,
          useValue: mockRabbitConsumer,
        },
        {
          provide: 'CONSOLE_HANDLER',
          useValue: mockConsoleHandler,
        },
      ],
    }).compile();

    service = module.get<AlertProcessorService>(AlertProcessorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should setup alert consumption when module initializes', () => {
      service.onModuleInit();
      expect(mockRabbitConsumer.consume).toHaveBeenCalled();
    });
  });

  describe('setupAlertConsumption', () => {
    it('should consume messages and handle them correctly', async () => {
      const mockAlert = {
        id: '1',
        deviceId: 'device-123',
        severity: 'WARNING',
        type: 'TEMPERATURE',
        message: 'Temperature is high',
        timestamp: '2023-01-01T00:00:00Z',
        acknowledged: false,
      };

      const consumeCallback = mockRabbitConsumer.consume.mock.calls[0][0];
      
      await consumeCallback(mockAlert);
      
      expect(mockConsoleHandler.handle).toHaveBeenCalledWith(mockAlert);
    });

    it('should log alert information when processing a message', async () => {
      const mockAlert = {
        id: '1',
        deviceId: 'device-123',
        severity: 'WARNING',
        type: 'TEMPERATURE',
        message: 'Temperature is high',
        timestamp: '2023-01-01T00:00:00Z',
        acknowledged: false,
      };

      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const consumeCallback = mockRabbitConsumer.consume.mock.calls[0][0];
      
      await consumeCallback(mockAlert);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        `[ALERT] ${mockAlert.severity}: ${mockAlert.message} (${mockAlert.deviceId})`
      );
      consoleLogSpy.mockRestore();
    });

    it('should handle errors during alert processing gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      
      mockConsoleHandler.handle.mockRejectedValue(new Error('Processing failed'));
      
      const mockAlert = {
        id: '1',
        deviceId: 'device-123',
        severity: 'WARNING',
        type: 'TEMPERATURE',
        message: 'Temperature is high',
        timestamp: '2023-01-01T00:00:00Z',
        acknowledged: false,
      };

      const consumeCallback = mockRabbitConsumer.consume.mock.calls[0][0];
      
      await consumeCallback(mockAlert);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to process alert:', expect.any(Error));
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getHealth', () => {
    it('should return health status with rabbitmq check', async () => {
      mockRabbitConsumer.isHealthy.mockResolvedValue(true);
      
      const result = await service.getHealth();
      
      expect(result).toEqual({ rabbitmq: true });
      expect(mockRabbitConsumer.isHealthy).toHaveBeenCalled();
    });

    it('should return unhealthy status when rabbitmq is not healthy', async () => {
      mockRabbitConsumer.isHealthy.mockResolvedValue(false);
      
      const result = await service.getHealth();
      
      expect(result).toEqual({ rabbitmq: false });
    });
  });
});