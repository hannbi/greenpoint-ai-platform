import apiClient from './apiClient';

export const userApi = {
  // 사용자 정보 조회
  getUserInfo: async () => {
    try {
      // 실제 API 엔드포인트로 수정해야 합니다.
      const response = await apiClient.get('/user/me'); 
      return response;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // 기본값 또는 에러 처리
      return { points: 0 }; 
    }
  },
};
