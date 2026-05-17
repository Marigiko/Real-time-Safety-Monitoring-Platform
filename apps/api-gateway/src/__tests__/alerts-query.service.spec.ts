import { Test, TestingModule } from '@nestjs/testing';
import { AlertsQueryService } from '../alerts/alerts-query.service';
import { AlertRepository } from '@rtsp/infrastructure';

describe('AlertsQueryService', () => {
  let service: AlertsQueryService;
  let repository: jest.Mocked<AlertRepository>;

  const mockAlerts = [
    {
      id: '1',
      deviceId: 'device1',
      severity: 'CRITICAL' as const,
      message: 'Temperature too high',
      timestamp: new Date(),
      acknowledged: false
    },
    {
      id: '2',
      deviceId: 'device2',
      severity: 'WARNING' as const,
      message: 'Humidity high',
      timestamp: new Date(),
      acknowledged: true
    }
  ];

  beforeEach(async () => {
    repository = {
      findAll: jest.fn(),
      findByDeviceId: jest.fn(),
      findBySeverity: jest.fn(),
      findUnacknowledged: jest.fn(),
      acknowledge: jest.fn(),
      findById: jest.fn()
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertsQueryService,
        {
          provide: AlertRepository,
          useValue: repository
        }
      ],
    }).compile();

    service = module.get<AlertsQueryService>(AlertsQueryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all alerts with default limit', async () => {
      repository.findAll.mockResolvedValue(mockAlerts);
      
      const result = await service.findAll();
      
      expect(result).toEqual(mockAlerts);
      expect(repository.findAll).toHaveBeenCalledWith(100, 0);
    });

    it('should return all alerts with custom limit and offset', async () => {
      repository.findAll.mockResolvedValue(mockAlerts);
      
      const result = await service.findAll(50, 10);
      
      expect(result).toEqual(mockAlerts);
      expect(repository.findAll).toHaveBeenCalledWith(50, 10);
    });
  });

  describe('findByDeviceId', () => {
    it('should return alerts for specific device', async () => {
      repository.findByDeviceId.mockResolvedValue([mockAlerts[0]]);
      
      const result = await service.findByDeviceId('device1');
      
      expect(result).toEqual([mockAlerts[0]]);
      expect(repository.findByDeviceId).toHaveBeenCalledWith('device1');
    });
  });

  describe('findBySeverity', () => {
    it('should return alerts for specific severity', async () => {
      repository.findBySeverity.mockResolvedValue([mockAlerts[0]]);
      
      const result = await service.findBySeverity('CRITICAL');
      
      expect(result).toEqual([mockAlerts[0]]);
      expect(repository.findBySeverity).toHaveBeenCalledWith('CRITICAL');
    });
  });

  describe('findUnacknowledged', () => {
    it('should return unacknowledged alerts', async () => {
      repository.findUnacknowledged.mockResolvedValue([mockAlerts[0]]);
      
      const result = await service.findUnacknowledged();
      
      expect(result).toEqual([mockAlerts[0]]);
      expect(repository.findUnacknowledged).toHaveBeenCalled();
    });
  });

  describe('acknowledge', () => {
    it('should acknowledge alert', async () => {
      repository.acknowledge.mockResolvedValue(undefined);
      
      await service.acknowledge('1');
      
      expect(repository.acknowledge).toHaveBeenCalledWith('1');
    });
  });
});