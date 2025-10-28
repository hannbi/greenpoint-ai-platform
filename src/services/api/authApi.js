import apiClient from './apiClient';

// 인증 관련 API
export const authApi = {
  // 이메일 중복 확인
  checkEmail: async (email) => {
    return apiClient.post('/auth/email/check', null, {
        params: { email }
      });
  },

  // 인증 코드 발송
  sendVerificationCode: async (email) => {
    return apiClient.post('/auth/email/send', null, {
      params: { email }
    });
  },

  // 인증 코드 검증
  verifyCode: async (email, code) => {
    return apiClient.post('/auth/email/verify', null, { params: { email, code } });
  },

  // 회원가입
  signup: async (signupData) => {
    return apiClient.post('/auth/signup', signupData);
  },

  // 로그인
  login: async (email, password) => {
    return apiClient.post('/auth/login', { email, password });
  },

  // 로그아웃 - 아직 없
  logout: async () => {
    return apiClient.post('/auth/logout');
  },

  // 토큰 갱신 - 아직 없
  refreshToken: async () => {
    return apiClient.post('/auth/refresh');
  },
};
