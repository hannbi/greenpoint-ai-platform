import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8082',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('/login')) {
      return {
        data: response.data,
        headers: response.headers,
        status: response.status,
      };
    }
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
    return Promise.reject({
      message,
      status: error.response?.status,
    });
  }
);

export default apiClient;
