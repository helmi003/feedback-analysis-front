import axios from 'axios';
import { metricsCollector } from './MetricsCollector';

// Simple tracking without extending Axios types
const requestTimes = new Map<string, number>();

const http = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to track API calls
http.interceptors.request.use(
  (config) => {
    // Create a unique ID for this request
    const requestId = `${config.method}-${config.url}-${Date.now()}`;
    requestTimes.set(requestId, performance.now());
    // Store the ID in a header that we can retrieve later
    config.headers['X-Request-ID'] = requestId;
    return config;
  },
  (error) => {
    metricsCollector.trackError('request_error');
    return Promise.reject(error);
  }
);

// Add response interceptor to track metrics
http.interceptors.response.use(
  (response) => {
    const requestId = response.config.headers['X-Request-ID'] as string;
    const startTime = requestTimes.get(requestId);
    const endTime = performance.now();
    
    if (startTime) {
      const duration = endTime - startTime;
      console.log(`API ${response.config.method?.toUpperCase()} ${response.config.url} took ${duration.toFixed(2)}ms`);
      requestTimes.delete(requestId);
    }
    
    // Track successful API calls
    metricsCollector.trackApiCall(
      response.config.url || 'unknown',
      response.config.method?.toUpperCase() || 'GET',
      response.status
    );
    
    return response.data;
  },
  (error) => {
    const requestId = error.config?.headers['X-Request-ID'] as string;
    if (requestId) {
      requestTimes.delete(requestId);
    }
    
    // Track failed API calls
    metricsCollector.trackApiCall(
      error.config?.url || 'unknown',
      error.config?.method?.toUpperCase() || 'GET',
      error.response?.status || 0
    );
    
    // Track API errors
    metricsCollector.trackError('api_error');
    
    return Promise.reject(error);
  }
);

interface CustomAxiosInstance {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}

export default http as CustomAxiosInstance;