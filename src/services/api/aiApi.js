// src/services/api/aiApi.js
import apiClient from './aiapiClient';

const aiApi = {
  /**
   * AI 챗봇에게 질문
   * @param {string} prompt - 사용자 질문
   * @returns {Promise<string>} AI 응답
   */
  chat: async (prompt) => {
    try {
      const response = await apiClient.post('/chat', {
        prompt: prompt
      });
      return response;
    } catch (error) {
      console.error('AI 챗봇 에러:', error);
      throw error;
    }
  }
};

export default aiApi;
