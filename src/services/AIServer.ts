import axios from 'axios';

const AIServer = axios.create({
  baseURL: import.meta.env.VITE_FEEDBACK_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

AIServer.interceptors.response.use(response => response.data);

interface CustomAxiosInstance {
  get<T = any>(url: string, config?: any): Promise<T>;
  post<T = any>(url: string, data?: any, config?: any): Promise<T>;
  put<T = any>(url: string, data?: any, config?: any): Promise<T>;
  delete<T = any>(url: string, config?: any): Promise<T>;
}

export default AIServer as CustomAxiosInstance;