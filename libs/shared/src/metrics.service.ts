import { Injectable } from '@nestjs/common';

interface CounterMetric {
  name: string;
  labels: Record<string, string>;
  value: number;
}

interface GaugeMetric {
  name: string;
  labels: Record<string, string>;
  value: number;
}

interface HistogramMetric {
  name: string;
  labels: Record<string, string>;
  value: number;
  count: number;
  sum: number;
}

@Injectable()
export class MetricsService {
  private counters: Map<string, CounterMetric> = new Map();
  private gauges: Map<string, GaugeMetric> = new Map();
  private histograms: Map<string, HistogramMetric> = new Map();

  private getMetricKey(name: string, labels: Record<string, string>): string {
    const labelStr = Object.entries(labels).sort().map(([k, v]) => `${k}=${v}`).join(',');
    return `${name}{${labelStr}}`;
  }

  counter(name: string, labels: Record<string, string> = {}, value = 1): void {
    const key = this.getMetricKey(name, labels);
    const existing = this.counters.get(key);
    if (existing) {
      existing.value += value;
    } else {
      this.counters.set(key, { name, labels, value });
    }
  }

  gauge(name: string, labels: Record<string, string> = {}, value: number): void {
    const key = this.getMetricKey(name, labels);
    this.gauges.set(key, { name, labels, value });
  }

  histogram(name: string, labels: Record<string, string> = {}, value: number): void {
    const key = this.getMetricKey(name, labels);
    const existing = this.histograms.get(key);
    if (existing) {
      existing.value = value;
      existing.count += 1;
      existing.sum += value;
    } else {
      this.histograms.set(key, { name, labels, value, count: 1, sum: value });
    }
  }

  getMetrics(): string {
    const lines: string[] = [];

    for (const metric of this.counters.values()) {
      const labelStr = Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',');
      lines.push(`# TYPE ${metric.name} counter`);
      lines.push(`${metric.name}{${labelStr}} ${metric.value}`);
    }

    for (const metric of this.gauges.values()) {
      const labelStr = Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',');
      lines.push(`# TYPE ${metric.name} gauge`);
      lines.push(`${metric.name}{${labelStr}} ${metric.value}`);
    }

    for (const metric of this.histograms.values()) {
      const labelStr = Object.entries(metric.labels).map(([k, v]) => `${k}="${v}"`).join(',');
      lines.push(`# TYPE ${metric.name} histogram`);
      lines.push(`${metric.name}_count{${labelStr}} ${metric.count}`);
      lines.push(`${metric.name}_sum{${labelStr}} ${metric.sum}`);
    }

    return lines.join('\n');
  }

  reset(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }
}