import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
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
          const decoded = jwtDecode(token);
          const initialUser = { nickname: decoded.nickname };
          const userInfo = await userApi.getUserInfo();
          setUser({ ...initialUser, points: userInfo.points });
        } catch (error) {
          console.error('Failed to decode token or fetch user info', error);
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
      const decoded = jwtDecode(token);
      const initialUser = { nickname: decoded.nickname };
      const userInfo = await userApi.getUserInfo();
      setUser({ ...initialUser, points: userInfo.points });
    } catch (error) {
      console.error('Failed to process login', error);
    }
  };

  const logout = async () => {
    await tokenStorage.removeAccessToken();
    await tokenStorage.removeDeviceId();
    setUser(null);
  };

  // 소셜 로그인 응답 처리 (refreshToken 저장 제거)
  const loginFromAuthResult = async (result) => {
    // result: { userId, deviceId, accessToken, rtJti?, roles? }  // RT 없음
    if (!result?.accessToken) throw new Error('No accessToken in result');

    await tokenStorage.saveAccessToken(result.accessToken);
    if (result.deviceId) {
      await tokenStorage.saveDeviceId(result.deviceId);
    }

    try {
      const decoded = jwtDecode(result.accessToken);
      const initialUser = { nickname: decoded.nickname };
      const userInfo = await userApi.getUserInfo();
      setUser({ ...initialUser, points: userInfo.points });
    } catch (e) {
      console.error('Failed to finalize social login', e);
    }
  };

  return (
    <UserContext.Provider value={{ user, login, loginFromAuthResult, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
