import axios from 'axios';

const AIServer = axios.create({
  baseURL: import.meta.env.VITE_FEEDBACK_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

AIServer.interceptors.response.use(response => response.data);

export default AIServer;