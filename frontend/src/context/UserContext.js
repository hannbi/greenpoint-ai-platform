import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { tokenStorage } from '../services/tokenStorage';
import { userApi } from '../services/api/userApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const userId = await tokenStorage.getUserId();
      if (userId) {
        try {
          const userInfo = await userApi.getUserInfo(userId);
          setUser({
            id: userInfo.id,
            nickname: userInfo.nickname,
            points: userInfo.points
          });
        } catch (error) {
          await tokenStorage.removeUserId();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (userId) => {
    await tokenStorage.saveUserId(userId);
    try {
      const userInfo = await userApi.getUserInfo(userId);
      setUser({
        id: userInfo.id,
        nickname: userInfo.nickname,
        points: userInfo.points
      });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await tokenStorage.removeUserId();
    await tokenStorage.removeDeviceId();
    setUser(null);
  };

  const loginFromAuthResult = async (result) => {
    if (!result?.userId) throw new Error('No userId in result');

    await tokenStorage.saveUserId(result.userId);
    if (result.deviceId) {
      await tokenStorage.saveDeviceId(result.deviceId);
    }

    try {
      const userInfo = await userApi.getUserInfo(result.userId);
      setUser({
        id: userInfo.id,
        nickname: userInfo.nickname,
        points: userInfo.points
      });
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = useCallback(async () => {
    try {
      const userId = await tokenStorage.getUserId();
      if (!userId) return;
      
      const userInfo = await userApi.getUserInfo(userId);
      setUser({
        id: userInfo.id,
        nickname: userInfo.nickname,
        points: userInfo.points
      });
    } catch (error) {
      throw error;
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, loginFromAuthResult, logout, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
