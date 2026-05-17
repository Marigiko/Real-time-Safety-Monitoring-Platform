import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { AlertProcessorService } from './alert-processor.service';

describe('HealthController', () => {
  let controller: HealthController;
  let mockAlertService: jest.Mocked<AlertProcessorService>;

  beforeEach(async () => {
    mockAlertService = {
      getHealth: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: AlertProcessorService,
          useValue: mockAlertService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return healthy status when all dependencies are healthy', async () => {
      mockAlertService.getHealth.mockResolvedValue({ rabbitmq: true });
      
      const result = await controller.check();
      
      expect(result).toEqual({
        status: 'healthy',
        service: 'alert-service',
        timestamp: expect.any(String),
        dependencies: { rabbitmq: true },
      });
      expect(mockAlertService.getHealth).toHaveBeenCalled();
    });

    it('should return unhealthy status when rabbitmq is not healthy', async () => {
      mockAlertService.getHealth.mockResolvedValue({ rabbitmq: false });
      
      const result = await controller.check();
      
      expect(result).toEqual({
        status: 'unhealthy',
        service: 'alert-service',
        timestamp: expect.any(String),
        dependencies: { rabbitmq: false },
      });
    });

    it('should handle timestamp correctly', async () => {
      const now = new Date();
      jest.useFakeTimers();
      jest.setSystemTime(now);
      
      mockAlertService.getHealth.mockResolvedValue({ rabbitmq: true });
      
      const result = await controller.check();
      
      expect(new Date(result.timestamp)).toEqual(now);
      
      jest.useRealTimers();
    });
  });
});