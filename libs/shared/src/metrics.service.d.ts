export declare class MetricsService {
    private counters;
    private gauges;
    private histograms;
    private getMetricKey;
    counter(name: string, labels?: Record<string, string>, value?: number): void;
    gauge(name: string, labels: Record<string, string> | undefined, value: number): void;
    histogram(name: string, labels: Record<string, string> | undefined, value: number): void;
    getMetrics(): string;
    reset(): void;
}
//# sourceMappingURL=metrics.service.d.ts.map