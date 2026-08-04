import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('pos_jwt_token');
    const storedUser = localStorage.getItem('pos_user_data');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setToken(data.token);
    setUser(data);
    localStorage.setItem('pos_jwt_token', data.token);
    localStorage.setItem('pos_user_data', JSON.stringify(data));
    return data;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    setToken(data.token);
    setUser(data);
    localStorage.setItem('pos_jwt_token', data.token);
    localStorage.setItem('pos_user_data', JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('pos_jwt_token');
    localStorage.removeItem('pos_user_data');
  };

  const hasRole = (...roles) => {
    return user && roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, loading, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
