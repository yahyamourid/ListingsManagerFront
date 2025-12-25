import { apiClient } from './apiClient';

export const favoritesApi = {
  getFavorites: async (page, page_size) => {
    try {
      const response = await apiClient.get(`/favorites?page=${page}&page_size=${page_size}`);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  addFavorite: async (listingId) => {
    try {
      const response = await apiClient.post(`/favorites/${listingId}`);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  removeFavorite: async (listingId) => {
    try {
      const response = await apiClient.delete(`/favorites/${listingId}`);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },

  checkFavorite: async (listingId) => {
    try {
      const response = await apiClient.get(`/favorites/${listingId}/check`);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },
};

export default favoritesApi;
