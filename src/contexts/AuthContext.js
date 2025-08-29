import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
          
          // Set up automatic token refresh
          authService.setupTokenRefresh();
        } catch (error) {
          console.error('Error parsing user data:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      
      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      localStorage.setItem('userData', JSON.stringify(response.user));
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Set up automatic token refresh
      authService.setupTokenRefresh();
      
      toast.success(`Welcome back, ${response.user.username}!`);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      
      // Clear token refresh
      authService.clearTokenRefresh();
      
      setUser(null);
      setIsAuthenticated(false);
      
      toast.info('Logged out successfully');
    }
  };

  const refreshAuth = async () => {
    try {
      const newToken = await authService.refreshToken();
      if (newToken) {
        localStorage.setItem('accessToken', newToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.role === 'master') return true;
    return user.permissions?.[permission] || false;
  };

  const canAccessPage = (page) => {
    if (!user) return false;
    if (user.role === 'master') return true;
    const pages = user.permissions?.canViewPages || [];
    return pages.includes('*') || pages.includes(page);
  };

  const isMaster = () => user?.role === 'master';
  const isAdmin = () => user?.role === 'admin' || user?.role === 'master';

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
    hasPermission,
    canAccessPage,
    isMaster,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};