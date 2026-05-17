import { Injectable } from '@nestjs/common';

export interface HealthCheck {
  status: 'healthy' | 'unhealthy' | 'degraded';
  service: string;
  timestamp: Date;
  details?: Record<string, unknown>;
}

@Injectable()
export class HealthService {
  private checks: Map<string, () => Promise<HealthCheck>> = new Map();

  registerCheck(name: string, checkFn: () => Promise<HealthCheck>): void {
    this.checks.set(name, checkFn);
  }

  async checkAll(): Promise<HealthCheck[]> {
    const results: HealthCheck[] = [];
    
    for (const [name, checkFn] of this.checks) {
      try {
        const result = await checkFn();
        results.push(result);
      } catch (error) {
        results.push({
          status: 'unhealthy',
          service: name,
          timestamp: new Date(),
          details: { error: (error as Error).message },
        });
      }
    }

    return results;
  }

  async getHealth(): Promise<{ status: string; services: HealthCheck[] }> {
    const results = await this.checkAll();
    const hasUnhealthy = results.some(r => r.status === 'unhealthy');
    const hasDegraded = results.some(r => r.status === 'degraded');

    let status: string;
    if (hasUnhealthy) status = 'unhealthy';
    else if (hasDegraded) status = 'degraded';
    else status = 'healthy';

    return { status, services: results };
  }
}