import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelemetryRepository } from './telemetry.repository';
import { AlertRepository } from './alert.repository';

export const DATABASE_CONFIG = 'DATABASE_CONFIG';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONFIG,
      useValue: {
        host: process.env.POSTGRES_HOST || 'localhost',
        port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
        username: process.env.POSTGRES_USER || 'rtsp',
        password: process.env.POSTGRES_PASSWORD || 'rtsp',
        database: process.env.POSTGRES_DB || 'rtsp',
      } as DatabaseConfig,
    },
    TelemetryRepository,
    AlertRepository,
  ],
  exports: [TelemetryRepository, AlertRepository, DATABASE_CONFIG],
})
export class DatabaseModule {}