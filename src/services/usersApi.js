import { apiClient, TokenManager, ApiError } from './apiClient';
import { demoUsers, demoPasswords, demoOtps } from './demoData';

export const usersApi = {
  getMe: async () => {
    try {
      return await apiClient.get('/users/me');
    } catch (error) {
      if (error.status === 0) {
        const token = TokenManager.getAccessToken();
        if (token) {
          try {
            const decoded = JSON.parse(atob(token));
            const user = demoUsers.find(u => u.id === decoded.user_id);
            if (user) {
              return { success: true, message: 'User profile retrieved successfully', data: user };
            }
          } catch (e) {
            throw new ApiError('Invalid session', 401);
          }
        }
        throw new ApiError('Not authenticated', 401);
      }
      throw error;
    }
  },

  getAll: async (page = 1, pageSize = 20, search = null, role = null) => {
    try {
      let endpoint = `/users?page=${page}&page_size=${pageSize}`;
      if (search) endpoint += `&search=${encodeURIComponent(search)}`;
      if (role) endpoint += `&role=${role}`;
      return await apiClient.get(endpoint);
    } catch (error) {
      throw error;
    }
  },

  getById: async (userId) => {
    try {
      return await apiClient.get(`/users/${userId}`);
    } catch (error) {
      throw error;
    }
  },

  create: async (userData) => {
    try {
      return await apiClient.post('/users', userData);
    } catch (error) {
      throw error;
    }
  },

  update: async (userId, userData) => {
    try {
      return await apiClient.put(`/users/${userId}`, userData);
    } catch (error) {
      throw error;
    }
  },

  updateRole: async (userId, role) => {
    try {
      return await apiClient.put(`/users/${userId}/role?role=${role}`, {});
    } catch (error) {
      throw error;
    }
  },

  toggleActivation: async (userId) => {
    try {
      return await apiClient.post(`/users/${userId}/activate`, {});
    } catch (error) {
      throw error;
    }
  },

  delete: async (userId) => {
    try {
      return await apiClient.delete(`/users/${userId}`);
    } catch (error) {
      throw error;
    }
  },

  updatePassword: async (currentPassword, newPassword) => {
    try {
      return await apiClient.put('/users/me/password', { current_password: currentPassword, new_password: newPassword });
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email) => {
    try {
      return await apiClient.post('/users/forgot-password', { email }, { includeAuth: false });
    } catch (error) {
      throw error;
    }
  },


  verifyOTP: async (email, otp) => {
    try{
      return await apiClient.post('/users/verify-otp', { email, otp}, { includeAuth: false });
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (email, otp, newPassword) => {
    try {
      return await apiClient.post('/users/reset-password', { email, otp, new_password: newPassword }, { includeAuth: false });
    } catch (error) {
      throw error;
    }
  },
};

export default usersApi;
