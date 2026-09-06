import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getProfileApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('solar_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('solar_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const res = await getProfileApi();
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('solar_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };
    verifyAuth();
  }, [token]);

  const login = async (credentials) => {
    const res = await loginApi(credentials);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('solar_token', res.data.token);
      localStorage.setItem('solar_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const register = async (userData) => {
    const res = await registerApi(userData);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('solar_token', res.data.token);
      localStorage.setItem('solar_user', JSON.stringify(res.data.user));
    }
    return res.data;
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('solar_token');
    localStorage.removeItem('solar_user');
  };

  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('solar_user', JSON.stringify(updatedUser));
  };

  const hasRole = (allowedRoles = []) => {
    if (!user) return false;
    if (user.accountType === 'personal') return true;
    const currentRole = user.role || 'Viewer';
    return allowedRoles.some(r => r.toLowerCase() === currentRole.toLowerCase());
  };

  const isAccountType = (allowedTypes = []) => {
    if (!user) return false;
    const currentType = (user.accountType || 'personal').toLowerCase();
    return allowedTypes.some(t => t.toLowerCase() === currentType);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        updateUserProfile,
        hasRole,
        isAccountType
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
