import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryQueryService } from '../telemetry/telemetry-query.service';
import { TelemetryRepository } from '@rtsp/infrastructure';

describe('TelemetryQueryService', () => {
  let service: TelemetryQueryService;
  let repository: jest.Mocked<TelemetryRepository>;

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
    repository = {
      findAll: jest.fn(),
      findByDeviceId: jest.fn(),
      findById: jest.fn()
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemetryQueryService,
        {
          provide: TelemetryRepository,
          useValue: repository
        }
      ],
    }).compile();

    service = module.get<TelemetryQueryService>(TelemetryQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all telemetry with default limit', async () => {
      repository.findAll.mockResolvedValue(mockTelemetry);
      
      const result = await service.findAll();
      
      expect(result).toEqual(mockTelemetry);
      expect(repository.findAll).toHaveBeenCalledWith(100);
    });

    it('should return all telemetry with custom limit', async () => {
      repository.findAll.mockResolvedValue(mockTelemetry);
      
      const result = await service.findAll(50);
      
      expect(result).toEqual(mockTelemetry);
      expect(repository.findAll).toHaveBeenCalledWith(50);
    });
  });

  describe('findByDeviceId', () => {
    it('should return telemetry for specific device', async () => {
      repository.findByDeviceId.mockResolvedValue(mockTelemetry);
      
      const result = await service.findByDeviceId('device1');
      
      expect(result).toEqual(mockTelemetry);
      expect(repository.findByDeviceId).toHaveBeenCalledWith('device1', 100);
    });

    it('should return telemetry for specific device with custom limit', async () => {
      repository.findByDeviceId.mockResolvedValue(mockTelemetry);
      
      const result = await service.findByDeviceId('device1', 50);
      
      expect(result).toEqual(mockTelemetry);
      expect(repository.findByDeviceId).toHaveBeenCalledWith('device1', 50);
    });
  });

  describe('findById', () => {
    it('should return telemetry by id', async () => {
      repository.findById.mockResolvedValue(mockTelemetry[0]);
      
      const result = await service.findById('1');
      
      expect(result).toEqual(mockTelemetry[0]);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });
  });
});