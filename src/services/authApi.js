import { apiClient, TokenManager, ApiError } from './apiClient';

export const authApi = {
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password }, { includeAuth: false });
      const { access_token, refresh_token } = response.data;
      TokenManager.setTokens(access_token, refresh_token);
      return response;
    } catch (error) {
      if (error.status === 0 || error.message === 'Network error') {
        throw new ApiError('Invalid credentials', 401);
      }
      throw error;
    }
  },

  register: async (userData) => {
    try {
      return await apiClient.post('/auth/register', userData);
    } catch (error) {
      throw error;
    }
  },

  refresh: async () => {
    try {
      const refreshToken = TokenManager.getRefreshToken();
      const response = await apiClient.post('/auth/refresh', { refresh_token: refreshToken }, { includeAuth: false });
      const { access_token, refresh_token } = response.data;
      TokenManager.setTokens(access_token, refresh_token);
      return response;
    } catch (error) {
      TokenManager.clearTokens();
      throw error;
    }
  },

  logout: () => {
    TokenManager.clearTokens();
    localStorage.removeItem('listingsUser');
  },

  isAuthenticated: () => TokenManager.hasValidToken(),
};

export default authApi;
