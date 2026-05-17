import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryController } from '../telemetry/telemetry.controller';
import { AlertsController } from '../alerts/alerts.controller';
import { TelemetryQueryService } from '../telemetry/telemetry-query.service';
import { AlertsQueryService } from '../alerts/alerts-query.service';

describe('Data Validation and Response Formatting', () => {
  let telemetryController: TelemetryController;
  let alertsController: AlertsController;
  let telemetryQueryService: jest.Mocked<TelemetryQueryService>;
  let alertsQueryService: jest.Mocked<AlertsQueryService>;

  const mockTelemetry = [
    {
      id: '1',
      deviceId: 'device1',
      timestamp: new Date(),
      temperature: 25.5,
      humidity: 60,
      pressure: 1013.25
    }
  ];

  const mockAlerts = [
    {
      id: '1',
      deviceId: 'device1',
      severity: 'CRITICAL' as const,
      message: 'Temperature too high',
      timestamp: new Date(),
      acknowledged: false
    }
  ];

  beforeEach(async () => {
    telemetryQueryService = {
      findAll: jest.fn(),
      findByDeviceId: jest.fn(),
      findById: jest.fn()
    } as any;

    alertsQueryService = {
      findAll: jest.fn(),
      findByDeviceId: jest.fn(),
      findBySeverity: jest.fn(),
      findUnacknowledged: jest.fn(),
      acknowledge: jest.fn()
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryController, AlertsController],
      providers: [
        {
          provide: TelemetryQueryService,
          useValue: telemetryQueryService
        },
        {
          provide: AlertsQueryService,
          useValue: alertsQueryService
        }
      ],
    }).compile();

    telemetryController = module.get<TelemetryController>(TelemetryController);
    alertsController = module.get<AlertsController>(AlertsController);
  });

  describe('Telemetry Response Format', () => {
    it('should return properly formatted telemetry data', async () => {
      telemetryQueryService.findAll.mockResolvedValue(mockTelemetry);
      
      const result = await telemetryController.list();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('deviceId');
      expect(result[0]).toHaveProperty('timestamp');
      expect(result[0]).toHaveProperty('temperature');
      expect(result[0]).toHaveProperty('humidity');
      expect(result[0]).toHaveProperty('pressure');
    });
  });

  describe('Alerts Response Format', () => {
    it('should return properly formatted alert data', async () => {
      alertsQueryService.findAll.mockResolvedValue(mockAlerts);
      
      const result = await alertsController.list();
      
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('deviceId');
      expect(result[0]).toHaveProperty('severity');
      expect(result[0]).toHaveProperty('message');
      expect(result[0]).toHaveProperty('timestamp');
      expect(result[0]).toHaveProperty('acknowledged');
    });
  });

  describe('Response Data Types', () => {
    it('should return correct data types', async () => {
      telemetryQueryService.findAll.mockResolvedValue(mockTelemetry);
      alertsQueryService.findAll.mockResolvedValue(mockAlerts);
      
      const telemetryResult = await telemetryController.list();
      const alertsResult = await alertsController.list();
      
      // Verify telemetry data types
      expect(typeof telemetryResult[0].id).toBe('string');
      expect(typeof telemetryResult[0].deviceId).toBe('string');
      expect(telemetryResult[0].timestamp).toBeInstanceOf(Date);
      expect(typeof telemetryResult[0].temperature).toBe('number');
      expect(typeof telemetryResult[0].humidity).toBe('number');
      expect(typeof telemetryResult[0].pressure).toBe('number');
      
      // Verify alert data types
      expect(typeof alertsResult[0].id).toBe('string');
      expect(typeof alertsResult[0].deviceId).toBe('string');
      expect(alertsResult[0].severity).toMatch(/CRITICAL|WARNING|INFO/);
      expect(typeof alertsResult[0].message).toBe('string');
      expect(alertsResult[0].timestamp).toBeInstanceOf(Date);
      expect(typeof alertsResult[0].acknowledged).toBe('boolean');
    });
  });
});