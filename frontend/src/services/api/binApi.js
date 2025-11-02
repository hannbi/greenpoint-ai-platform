import apiClient from './apiClient';

export const binApi = {
  getBins: async (minX, minY, maxX, maxY) => {
    try {
      const response = await apiClient.get('/bin/get', {
        params: { 
          minX: minX,
          minY: minY,
          maxX: maxX,
          maxY: maxY
        }
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
};
