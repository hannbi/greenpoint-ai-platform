import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import { tokenStorage } from '../services/tokenStorage';
import { userApi } from '../services/api/userApi';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

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
          console.error("Failed to decode token or fetch user info", error);
          await tokenStorage.removeAccessToken(); // 유효하지 않은 토큰 제거
        }
      }
      setLoading(false); // 로딩 완료
    };

    loadUser();
  }, []);

  const login = async (token) => {
    await tokenStorage.saveAccessToken(token);
    try {
      const decoded = jwtDecode(token);
      const initialUser = { nickname: decoded.nickname };
      const userInfo = await userApi.getUserInfo();
      setUser({ ...initialUser, points: userInfo.points });
    } catch (error) {
      console.error("Failed to process login", error);
    }
  };

  const logout = async () => {
    await tokenStorage.removeAccessToken();
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
