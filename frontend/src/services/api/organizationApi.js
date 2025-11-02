import apiClient from './apiClient';

export const organizationApi = {
  getOrganizations: async () => {
    try {
      const response = await apiClient.get('/organization/name');
      return response;
    } catch (error) {
      throw error;
    }
  },
};
