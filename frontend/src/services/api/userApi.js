import apiClient from './apiClient';

export const userApi = {
  getUserInfo: async (userId) => {
    try {
      const response = await apiClient.get('/user/info', {
        params: { id: userId }
      });
      return {
        id: response.id,
        nickname: response.nickname,
        points: response.points || 0
      };
    } catch (error) {
      throw error;
    }
  },
};
