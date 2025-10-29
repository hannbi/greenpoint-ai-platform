// 토큰 저장을 위한 유틸리티
import AsyncStorage from '@react-native-async-storage/async-storage';

export const tokenStorage = {
  // 액세스 토큰 저장
  saveAccessToken: async (token) => {
    try {
      await AsyncStorage.setItem('accessToken', token);
    } catch (error) {
      console.error('토큰 저장 실패:', error);
    }
  },

  // 액세스 토큰 가져오기
  getAccessToken: async () => {
    try {
      return await AsyncStorage.getItem('accessToken');
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
      return null;
    }
  },

  // 토큰 삭제 (로그아웃)
  removeAccessToken: async () => {
    try {
      await AsyncStorage.removeItem('accessToken');
    } catch (error) {
      console.error('토큰 삭제 실패:', error);
    }
  },

  saveDeviceId: async (id) => {
    try {
      await AsyncStorage.setItem('deviceId', id);
    } catch (e) {
      console.error('deviceId 저장 실패:', e);
    }
  },
  
  getDeviceId: async () => {
    try {
      return await AsyncStorage.getItem('deviceId');
    } catch (e) {
      console.error('deviceId 조회 실패:', e);
      return null;
    }
  },

  removeDeviceId: async () => {
    try {
      await AsyncStorage.removeItem('deviceId');
    } catch (e) {
      console.error('deviceId 삭제 실패:', e);
    }
  },
};
