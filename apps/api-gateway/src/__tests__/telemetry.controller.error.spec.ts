import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryController } from '../telemetry/telemetry.controller';
import { TelemetryQueryService } from '../telemetry/telemetry-query.service';
import { BadRequestException } from '@nestjs/common';

describe('TelemetryController Error Handling', () => {
  let controller: TelemetryController;
  let queryService: jest.Mocked<TelemetryQueryService>;

  beforeEach(async () => {
    queryService = {
      findAll: jest.fn(),
      findByDeviceId: jest.fn(),
      findById: jest.fn()
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryController],
      providers: [
        {
          provide: TelemetryQueryService,
          useValue: queryService
        }
      ],
    }).compile();

    controller = module.get<TelemetryController>(TelemetryController);
  });

  describe('list', () => {
    it('should handle invalid limit parameter gracefully', async () => {
      // This would normally be handled by the NestJS validation
      // The test verifies that it doesn't crash with invalid input
      const result = await controller.list('invalid-limit');
      // Should not throw and should behave reasonably
      expect(result).toBeDefined();
    });
  });

  describe('get', () => {
    it('should handle invalid ID gracefully', async () => {
      // Test that the controller handles various error conditions
      queryService.findById.mockResolvedValue(null);
      
      const result = await controller.get('nonexistent');
      
      expect(result).toBeNull();
    });
  });
});