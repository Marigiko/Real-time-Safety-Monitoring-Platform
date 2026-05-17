import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryController } from '../telemetry.controller';
import { TelemetryIngestionService } from '../telemetry-ingestion.service';

const mockTelemetryIngestionService = {
  ingest: jest.fn(),
};

describe('TelemetryController', () => {
  let controller: TelemetryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryController],
      providers: [
        {
          provide: TelemetryIngestionService,
          useValue: mockTelemetryIngestionService,
        },
      ],
    }).compile();

    controller = module.get<TelemetryController>(TelemetryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ingest endpoint', () => {
    const payload = {
      deviceId: 'device-123',
      temperature: 25.5,
      voltage: 12.1,
      pressure: 1013.25,
      humidity: 65.2
    };

    it('should successfully ingest telemetry data', async () => {
      mockTelemetryIngestionService.ingest.mockResolvedValue({ success: true });

      const result = await controller.ingest(payload);

      expect(result).toEqual({ success: true });
      expect(mockTelemetryIngestionService.ingest).toHaveBeenCalledWith({
        deviceId: payload.deviceId,
        payload: {
          temperature: payload.temperature,
          voltage: payload.voltage,
          pressure: payload.pressure,
          humidity: payload.humidity,
        }
      });
    });

    it('should handle ingestion errors gracefully', async () => {
      mockTelemetryIngestionService.ingest.mockRejectedValue(new Error('Ingestion failed'));

      await expect(controller.ingest(payload)).resolves.toEqual({ success: true });
    });
  });
});