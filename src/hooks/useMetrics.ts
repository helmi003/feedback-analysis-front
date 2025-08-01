import { useEffect } from 'react';
import { metricsCollector } from '../services/MetricsCollector';

export const useMetrics = () => {
  // Track page views
  const trackPageView = (pageName: string) => {
    metricsCollector.trackPageView(pageName);
  };

  // Hook for tracking component lifecycle
  const useComponentLifecycle = (componentName: string) => {
    useEffect(() => {
      const mountTimer = metricsCollector.startTimer('component_mount');
      metricsCollector.trackUserInteraction('mount', componentName);

      return () => {
        metricsCollector.endTimer(mountTimer, 'component_mount');
        metricsCollector.trackUserInteraction('unmount', componentName);
      };
    }, [componentName]);
  };

  // Hook for tracking page views
  const usePageView = (pageName: string) => {
    useEffect(() => {
      metricsCollector.trackPageView(pageName);
    }, [pageName]);
  };

  // Track user interactions
  const trackClick = (elementName: string, componentName?: string) => {
    metricsCollector.trackUserInteraction('click', componentName || elementName);
  };

  const trackError = (error: Error, componentName?: string) => {
    metricsCollector.trackError(error.name, componentName);
    console.error('Tracked error:', error);
  };

  // Track API calls
  const trackApiCall = (endpoint: string, method: string = 'GET', status: number = 200) => {
    metricsCollector.trackApiCall(endpoint, method, status);
  };

  return {
    trackPageView,
    useComponentLifecycle,
    usePageView,
    trackClick,
    trackError,
    trackApiCall,
    metricsCollector
  };
};

export default useMetrics;
