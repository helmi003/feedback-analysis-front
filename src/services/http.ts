import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_SERVER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(response => response.data);

export default http;