import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../health/health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('check', () => {
    it('should return health check response', async () => {
      const result = await controller.check();
      
      expect(result).toEqual({
        status: 'healthy',
        service: 'api-gateway',
        timestamp: expect.any(String),
        dependencies: {
          database: 'healthy',
        },
      });
    });
  });
});