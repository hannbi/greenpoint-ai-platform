import axios from 'axios';
import { getAccessToken } from '../tokenStorage';

const apiClient = axios.create({
  baseURL: 'http://10.132.60.124:8082',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰이 필요 없는 경로 목록
const noAuthPaths = [
  '/auth/email/check',
  '/auth/email/send',
  '/auth/email/verify',
  '/auth/signup',
  '/auth/login',
  '/auth/social/kakao',
  '/auth/refresh',
];

// 요청 시 자동으로 토큰 추가
apiClient.interceptors.request.use(
  async (config) => {
    if (!noAuthPaths.some(path => config.url.includes(path))) {
      const at = await tokenStorage.getAccessToken();
      if (at) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${at}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 401 동시 처리 큐
let isRefreshing = false;
let subscribers = [];
const subscribe = (cb) => subscribers.push(cb);
const onRefreshed = (newAt) => { subscribers.forEach(cb => cb(newAt)); subscribers = []; };

async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve) => subscribe(resolve));
  }
  isRefreshing = true;
  try {
    const at = await tokenStorage.getAccessToken();
    const deviceId = await tokenStorage.getDeviceId();
    if (!deviceId) throw new Error('NO_DEVICE_ID');

    const res = await axios.post(
      `${API_BASE}/auth/refresh`,
      { deviceId },
      {
        // 만료된 AT라도 서버가 서명만 검증해서 userId 추출 가능해야 함(서버 구현 필수)
        headers: at ? { Authorization: `Bearer ${at}` } : {},
      }
    );

    const { accessToken } = res.data; // 서버가 새 AT만 내려줌(정책: RT는 미노출)
    if (accessToken) {
      await tokenStorage.saveAccessToken(accessToken);
    }
    onRefreshed(accessToken);
    return accessToken;
  } finally {
    isRefreshing = false;
  }
}

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('/login')) {
      return { data: response.data, headers: response.headers, status: response.status };
    }
    return response.data;
  },
  async (error) => {
    const original = error.config;
    const status = error.response?.status || error.status;

    if (status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newAt = await refreshAccessToken();
        return new Promise((resolve) => {
          subscribe(async () => {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${newAt}`;
            resolve(apiClient(original));
          });
        });
      } catch (e) {
        // 세션 만료/철회 → 클린업
        await tokenStorage.removeAccessToken();
        await tokenStorage.removeDeviceId();
        return Promise.reject(e);
      }
    }

    const message = error.response?.data?.message || '서버 오류가 발생했습니다.';
    return Promise.reject({ message, status });
  }
);

export default apiClient;
