import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const storage = {
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  
  async getItem(key) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  
  async removeItem(key) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  }
};

export const tokenStorage = {
  saveUserId: async (userId) => {
    try {
      await storage.setItem('userId', userId);
    } catch (error) {
      throw error;
    }
  },

  getUserId: async () => {
    try {
      return await storage.getItem('userId');
    } catch (error) {
      return null;
    }
  },

  removeUserId: async () => {
    try {
      await storage.removeItem('userId');
    } catch (error) {
      throw error;
    }
  },

  saveDeviceId: async (id) => {
    try {
      await storage.setItem('deviceId', id);
    } catch (error) {
      throw error;
    }
  },
  
  getDeviceId: async () => {
    try {
      return await storage.getItem('deviceId');
    } catch (error) {
      return null;
    }
  },

  removeDeviceId: async () => {
    try {
      await storage.removeItem('deviceId');
    } catch (error) {
      throw error;
    }
  },
};
