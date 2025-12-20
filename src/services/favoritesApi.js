import { apiClient } from './apiClient';

export const favoritesApi = {
  getFavorites: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}/favorites`);
      return response.data || response;
    } catch (error) {
      if (error.status === 0) {
        const stored = localStorage.getItem(`favorites_${userId}`);
        return stored ? JSON.parse(stored) : [];
      }
      throw error;
    }
  },

  addFavorite: async (userId, listingId) => {
    try {
      const response = await apiClient.post(`/users/${userId}/favorites`, { listing_id: listingId });
      return response.data || response;
    } catch (error) {
      if (error.status === 0) {
        const stored = localStorage.getItem(`favorites_${userId}`);
        const favorites = stored ? JSON.parse(stored) : [];
        if (!favorites.includes(listingId)) {
          favorites.push(listingId);
          localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
        }
        return favorites;
      }
      throw error;
    }
  },

  removeFavorite: async (userId, listingId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}/favorites/${listingId}`);
      return response.data || response;
    } catch (error) {
      if (error.status === 0) {
        const stored = localStorage.getItem(`favorites_${userId}`);
        let favorites = stored ? JSON.parse(stored) : [];
        favorites = favorites.filter(id => id !== listingId);
        localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
        return favorites;
      }
      throw error;
    }
  },
};

export default favoritesApi;
