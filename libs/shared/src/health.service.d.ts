export interface HealthCheck {
    status: 'healthy' | 'unhealthy' | 'degraded';
    service: string;
    timestamp: Date;
    details?: Record<string, unknown>;
}
export declare class HealthService {
    private checks;
    registerCheck(name: string, checkFn: () => Promise<HealthCheck>): void;
    checkAll(): Promise<HealthCheck[]>;
    getHealth(): Promise<{
        status: string;
        services: HealthCheck[];
    }>;
}
//# sourceMappingURL=health.service.d.ts.map