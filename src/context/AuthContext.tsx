import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
  token: string | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const navigate = useNavigate();

  const login = (email: string, password: string) => {
    // Здесь мы эмулируем успешный логин и сохраняем токен
    const mockToken = 'mock-token';
    setToken(mockToken);
    localStorage.setItem('token', mockToken);
    navigate('/dashboard');
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
