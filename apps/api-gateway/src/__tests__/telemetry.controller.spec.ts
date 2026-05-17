import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryController } from '../telemetry/telemetry.controller';
import { TelemetryQueryService } from '../telemetry/telemetry-query.service';

describe('TelemetryController', () => {
  let controller: TelemetryController;
  let queryService: jest.Mocked<TelemetryQueryService>;

  const mockTelemetry = [
    {
      id: '1',
      deviceId: 'device1',
      timestamp: new Date(),
      temperature: 25.5,
      humidity: 60,
      pressure: 1013.25
    },
    {
      id: '2',
      deviceId: 'device1',
      timestamp: new Date(),
      temperature: 26.0,
      humidity: 62,
      pressure: 1012.75
    }
  ];

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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should return all telemetry when no query params provided', async () => {
      queryService.findAll.mockResolvedValue(mockTelemetry);
      
      const result = await controller.list();
      
      expect(result).toEqual(mockTelemetry);
      expect(queryService.findAll).toHaveBeenCalledWith(100);
    });

    it('should return telemetry for specific device when deviceId query param provided', async () => {
      queryService.findByDeviceId.mockResolvedValue(mockTelemetry);
      
      const result = await controller.list(undefined, 'device1');
      
      expect(result).toEqual(mockTelemetry);
      expect(queryService.findByDeviceId).toHaveBeenCalledWith('device1', 100);
    });

    it('should respect limit query param', async () => {
      queryService.findAll.mockResolvedValue(mockTelemetry);
      
      const result = await controller.list('50');
      
      expect(result).toEqual(mockTelemetry);
      expect(queryService.findAll).toHaveBeenCalledWith(50);
    });
  });

  describe('get', () => {
    it('should return telemetry by id', async () => {
      queryService.findById.mockResolvedValue(mockTelemetry[0]);
      
      const result = await controller.get('1');
      
      expect(result).toEqual(mockTelemetry[0]);
      expect(queryService.findById).toHaveBeenCalledWith('1');
    });
  });
});