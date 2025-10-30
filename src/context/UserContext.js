import React, { createContext, useState, useEffect, useContext } from 'react';
import { tokenStorage } from '../services/tokenStorage';
import { userApi } from '../services/api/userApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = await tokenStorage.getAccessToken();
      if (token) {
        try {
          const userInfo = await userApi.getUserInfo();
          setUser({
            id: userInfo.id,
            nickname: userInfo.nickname,
            points: userInfo.points
          });
        } catch (error) {
          console.error('Failed to fetch user info', error);
          await tokenStorage.removeAccessToken();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // 기존 로컬 로그인 시
  const login = async (token) => {
    await tokenStorage.saveAccessToken(token);
    try {
      const userInfo = await userApi.getUserInfo();
      setUser({
        id: userInfo.id,
        nickname: userInfo.nickname,
        points: userInfo.points
      });
    } catch (error) {
      console.error('Failed to process login', error);
    }
  };

  const logout = async () => {
    await tokenStorage.removeAccessToken();
    await tokenStorage.removeDeviceId();
    setUser(null);
  };

  // 소셜 로그인 응답 처리
  const loginFromAuthResult = async (result) => {
    if (!result?.accessToken) throw new Error('No accessToken in result');

    await tokenStorage.saveAccessToken(result.accessToken);
    if (result.deviceId) {
      await tokenStorage.saveDeviceId(result.deviceId);
    }

    try {
      const userInfo = await userApi.getUserInfo();
      setUser({
        id: userInfo.id,
        nickname: userInfo.nickname,
        points: userInfo.points
      });
    } catch (e) {
      console.error('Failed to finalize social login', e);
    }
  };

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    try {
      const userInfo = await userApi.getUserInfo();
      setUser({
        id: userInfo.id,
        nickname: userInfo.nickname,
        points: userInfo.points
      });
    } catch (error) {
      console.error('Failed to refresh user info', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, loginFromAuthResult, logout, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
