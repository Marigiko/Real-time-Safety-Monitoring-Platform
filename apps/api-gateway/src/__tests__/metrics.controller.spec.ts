import { Test, TestingModule } from '@nestjs/testing';
import { MetricsController } from '../metrics/metrics.controller';
import { MetricsService } from '@rtsp/shared';

describe('MetricsController', () => {
  let controller: MetricsController;
  let metricsService: jest.Mocked<MetricsService>;

  beforeEach(async () => {
    metricsService = {
      getMetrics: jest.fn()
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MetricsController],
      providers: [
        {
          provide: MetricsService,
          useValue: metricsService
        }
      ],
    }).compile();

    controller = module.get<MetricsController>(MetricsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMetrics', () => {
    it('should return metrics', async () => {
      metricsService.getMetrics.mockReturnValue('some metrics data');
      
      const result = await controller.getMetrics();
      
      expect(result).toBe('some metrics data');
      expect(metricsService.getMetrics).toHaveBeenCalled();
    });
  });
});