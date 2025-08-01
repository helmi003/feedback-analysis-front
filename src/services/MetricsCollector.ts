// Simple metrics collector for frontend monitoring
class MetricsCollector {
  private metrics: Map<string, number> = new Map();
  private timers: Map<string, number> = new Map();

  // Track page views
  trackPageView(page: string) {
    const key = `page_views_${page}`;
    this.metrics.set(key, (this.metrics.get(key) || 0) + 1);
  }

  // Track API calls
  trackApiCall(endpoint: string, method: string, status: number) {
    const key = `api_calls_${method}_${endpoint}_${status}`;
    this.metrics.set(key, (this.metrics.get(key) || 0) + 1);
  }

  // Start timing an operation
  startTimer(operation: string): string {
    const timerId = `${operation}_${Date.now()}`;
    this.timers.set(timerId, performance.now());
    return timerId;
  }

  // End timing and record duration
  endTimer(timerId: string, operation: string) {
    const startTime = this.timers.get(timerId);
    if (startTime) {
      const duration = performance.now() - startTime;
      const key = `duration_${operation}`;
      this.metrics.set(key, duration);
      this.timers.delete(timerId);
    }
  }

  // Track user interactions
  trackUserInteraction(action: string, component: string) {
    const key = `user_interactions_${component}_${action}`;
    this.metrics.set(key, (this.metrics.get(key) || 0) + 1);
  }

  // Track errors
  trackError(errorType: string, component?: string) {
    const key = component ? `errors_${component}_${errorType}` : `errors_${errorType}`;
    this.metrics.set(key, (this.metrics.get(key) || 0) + 1);
  }

  // Get all metrics in Prometheus format
  getMetricsPrometheusFormat(): string {
    let output = '';
    for (const [key, value] of this.metrics.entries()) {
      output += `${key} ${value}\n`;
    }
    return output;
  }

  // Send metrics to a metrics endpoint (if you have one)
  async sendMetrics() {
    try {
      const metrics = this.getMetricsPrometheusFormat();
      // You can send this to your backend or a metrics collection service
      console.log('Metrics:', metrics);
      
      // Example: Send to your backend
      // await fetch('/api/metrics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'text/plain' },
      //   body: metrics
      // });
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }

  // Clear all metrics
  clear() {
    this.metrics.clear();
    this.timers.clear();
  }
}

export const metricsCollector = new MetricsCollector();

// Auto-send metrics every 30 seconds
setInterval(() => {
  metricsCollector.sendMetrics();
}, 30000);

export default MetricsCollector;
