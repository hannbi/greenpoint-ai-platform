import apiClient from './apiClient';

const dischargeApi = {
    analyzeRecyclables: async (imageUri, userId) => {
        try {
            // 파일명만 추출
            const filename = imageUri.split('/').pop();

            // JSON 형식으로 파일명과 userId만 전송
            const response = await apiClient.post('/discharge/analyze', {
                filename: filename,
                id: userId
            });

            return response;
        } catch (error) {
            console.error('이미지 분석 요청 실패:', error);
            throw error;
        }
    },
};

export default dischargeApi;
