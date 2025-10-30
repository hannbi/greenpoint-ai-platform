import apiClient from './aiapiClient';

const dischargeApi = {
    detectRecyclable: async (imageUri) => {
        try {
            // 파일명만 추출
            const filename = imageUri.split('/').pop();

            // JSON 형식으로 파일명 전송
            const baseURL = apiClient.defaults.baseURL;
            
            const response = await fetch(`${baseURL}/detectt`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_name: "image1.jpg"  // "image1.jpg"
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('이미지 감지 실패:', error);
            throw error;
        }
    },
};

export default dischargeApi;