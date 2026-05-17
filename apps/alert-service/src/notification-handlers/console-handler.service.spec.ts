import { Test, TestingModule } from '@nestjs/testing';
import { ConsoleAlertHandler } from './console-handler.service';

describe('ConsoleAlertHandler', () => {
  let handler: ConsoleAlertHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConsoleAlertHandler],
    }).compile();

    handler = module.get<ConsoleAlertHandler>(ConsoleAlertHandler);
  });

  it('should be defined', () => {
    expect(handler).toBeDefined();
  });

  describe('handle', () => {
    it('should log critical severity alert with red color', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const alert = {
        id: '1',
        deviceId: 'device-123',
        severity: 'CRITICAL',
        type: 'TEMPERATURE',
        message: 'Temperature is extremely high',
        timestamp: '2023-01-01T00:00:00Z',
      };

      await handler.handle(alert);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('\x1b[31m') // Red color code
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[CRITICAL]')
      );
      consoleLogSpy.mockRestore();
    });

    it('should log warning severity alert with yellow color', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const alert = {
        id: '2',
        deviceId: 'device-456',
        severity: 'WARNING',
        type: 'HUMIDITY',
        message: 'Humidity is high',
        timestamp: '2023-01-01T00:00:00Z',
      };

      await handler.handle(alert);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('\x1b[33m') // Yellow color code
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARNING]')
      );
      consoleLogSpy.mockRestore();
    });

    it('should log info severity alert with cyan color', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const alert = {
        id: '3',
        deviceId: 'device-789',
        severity: 'INFO',
        type: 'SYSTEM',
        message: 'System is running normally',
        timestamp: '2023-01-01T00:00:00Z',
      };

      await handler.handle(alert);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('\x1b[36m') // Cyan color code
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO]')
      );
      consoleLogSpy.mockRestore();
    });

    it('should log unknown severity alert with default color', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const alert = {
        id: '4',
        deviceId: 'device-000',
        severity: 'UNKNOWN',
        type: 'SYSTEM',
        message: 'Unknown alert',
        timestamp: '2023-01-01T00:00:00Z',
      };

      await handler.handle(alert);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('\x1b[0m') // Default color code
      );
      consoleLogSpy.mockRestore();
    });

    it('should log alert information correctly', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      
      const alert = {
        id: '1',
        deviceId: 'device-123',
        severity: 'WARNING',
        type: 'TEMPERATURE',
        message: 'Temperature is high',
        timestamp: '2023-01-01T00:00:00Z',
      };

      await handler.handle(alert);
      
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARNING]')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('2023-01-01T00:00:00Z')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('device-123')
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Temperature is high')
      );
      consoleLogSpy.mockRestore();
    });
  });
});