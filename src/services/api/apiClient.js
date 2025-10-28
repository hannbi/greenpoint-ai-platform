import axios from 'axios';
import { getAccessToken } from '../tokenStorage';

const apiClient = axios.create({
  baseURL: 'http://localhost:8082',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 시 자동으로 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    // AsyncStorage에서 토큰 가져오기
    const token = await getAccessToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization 헤더 추가됨:', token.substring(0, 20) + '...');
    }
    
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
