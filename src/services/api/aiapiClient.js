import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://10.132.60.124:8000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('/login')) {
      return { data: response.data, headers: response.headers, status: response.status };
    }
    return response.data;
  },
  async (error) => {
    const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default apiClient;
