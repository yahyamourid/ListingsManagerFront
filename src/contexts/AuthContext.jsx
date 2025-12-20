import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, usersApi, TokenManager } from '@/services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user on mount if token exists
  useEffect(() => {
    const initializeAuth = async () => {
      if (TokenManager.hasValidToken()) {
        try {
          const response = await usersApi.getMe();
          const userData = response.data;
          setUser(userData);
          localStorage.setItem('listingsUser', JSON.stringify(userData));
        } catch (error) {
          console.warn('Failed to fetch user profile:', error.message);
          // Try to load from localStorage as fallback
          const savedUser = localStorage.getItem('listingsUser');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            TokenManager.clearTokens();
          }
        }
      } else {
        // Check localStorage for demo mode
        const savedUser = localStorage.getItem('listingsUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      await authApi.login(email, password);
      
      // Fetch user profile after login
      const profileResponse = await usersApi.getMe();
      const userData = profileResponse.data;
      
      setUser(userData);
      localStorage.setItem('listingsUser', JSON.stringify(userData));
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message || 'Invalid credentials' };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    localStorage.removeItem('listingsUser');
  };

  const updateProfile = async ({ name }) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    try {
      // Note: Backend might need a profile update endpoint
      // For now, update locally
      const profileResponse = await usersApi.update(user.id, {full_name:name});
      const userData = profileResponse.data; 
      const updatedUser = { ...user, full_name: name };
      setUser(updatedUser);
      localStorage.setItem('listingsUser', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    try {
      await usersApi.updatePassword(oldPassword, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to change password' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await usersApi.forgotPassword(email);
      // In demo mode, return the OTP for display
      return { success: true, demoOtp: response._demoOtp };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to send OTP' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      await usersApi.resetPassword(email, otp, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to reset password' };
    }
  };

  const verifyOtp = async (email, otp) => {
    try {
      await usersApi.verifyOTP(email, otp)
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to verify otp' };
    }
  }

  // Role checks - using backend role values
  const isSubscriber = user?.role === 'subscriber';
  const isEditor = user?.role === 'editor';
  const isAdmin = user?.role === 'superadmin';
  const isSuperAdmin = user?.role === 'superadmin'; // Alias for compatibility
  const isAuthenticated = !!user;
  const canAccessDashboard = isEditor || isAdmin;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login,
      logout, 
      updateProfile,
      changePassword,
      forgotPassword,
      resetPassword,
      verifyOtp,
      isSubscriber,
      isEditor,
      isAdmin,
      isSuperAdmin,
      isAuthenticated,
      canAccessDashboard,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
