import { Test, TestingModule } from '@nestjs/testing';
import { AlertsController } from '../alerts/alerts.controller';
import { AlertsQueryService } from '../alerts/alerts-query.service';

describe('AlertsController', () => {
  let controller: AlertsController;
  let queryService: jest.Mocked<AlertsQueryService>;

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
    queryService = {
      findAll: jest.fn(),
      findByDeviceId: jest.fn(),
      findBySeverity: jest.fn(),
      findUnacknowledged: jest.fn(),
      acknowledge: jest.fn()
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertsController],
      providers: [
        {
          provide: AlertsQueryService,
          useValue: queryService
        }
      ],
    }).compile();

    controller = module.get<AlertsController>(AlertsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should return all alerts when no query params provided', async () => {
      queryService.findAll.mockResolvedValue(mockAlerts);
      
      const result = await controller.list();
      
      expect(result).toEqual(mockAlerts);
      expect(queryService.findAll).toHaveBeenCalledWith(100);
    });

    it('should return alerts for specific severity when severity query param provided', async () => {
      queryService.findBySeverity.mockResolvedValue([mockAlerts[0]]);
      
      const result = await controller.list(undefined, 'CRITICAL');
      
      expect(result).toEqual([mockAlerts[0]]);
      expect(queryService.findBySeverity).toHaveBeenCalledWith('CRITICAL', 100);
    });

    it('should respect limit query param', async () => {
      queryService.findAll.mockResolvedValue(mockAlerts);
      
      const result = await controller.list('50');
      
      expect(result).toEqual(mockAlerts);
      expect(queryService.findAll).toHaveBeenCalledWith(50);
    });
  });

  describe('unacknowledged', () => {
    it('should return unacknowledged alerts', async () => {
      queryService.findUnacknowledged.mockResolvedValue([mockAlerts[0]]);
      
      const result = await controller.unacknowledged();
      
      expect(result).toEqual([mockAlerts[0]]);
      expect(queryService.findUnacknowledged).toHaveBeenCalled();
    });
  });

  describe('acknowledge', () => {
    it('should acknowledge alert and return success', async () => {
      queryService.acknowledge.mockResolvedValue(undefined);
      
      const result = await controller.acknowledge('1');
      
      expect(result).toEqual({ success: true });
      expect(queryService.acknowledge).toHaveBeenCalledWith('1');
    });
  });
});