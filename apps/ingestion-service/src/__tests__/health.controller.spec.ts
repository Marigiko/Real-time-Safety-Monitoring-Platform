import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../health.controller';
import { TelemetryIngestionService } from '../telemetry-ingestion.service';

const mockTelemetryIngestionService = {
  getHealth: jest.fn(),
};

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: TelemetryIngestionService,
          useValue: mockTelemetryIngestionService,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check endpoint', () => {
    it('should return health status', async () => {
      mockTelemetryIngestionService.getHealth.mockResolvedValue({
        mqtt: true,
        kafka: true
      });

      const result = await controller.check();

      expect(result).toEqual({
        status: 'healthy',
        service: 'ingestion-service',
        timestamp: expect.any(String),
        dependencies: {
          mqtt: true,
          kafka: true
        }
      });
      expect(mockTelemetryIngestionService.getHealth).toHaveBeenCalled();
    });

    it('should return unhealthy status when dependencies are not healthy', async () => {
      mockTelemetryIngestionService.getHealth.mockResolvedValue({
        mqtt: false,
        kafka: true
      });

      const result = await controller.check();

      expect(result).toEqual({
        status: 'unhealthy',
        service: 'ingestion-service',
        timestamp: expect.any(String),
        dependencies: {
          mqtt: false,
          kafka: true
        }
      });
    });
  });
});