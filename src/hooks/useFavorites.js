import { useState, useEffect, useCallback } from 'react';
import { favoritesApi } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!user?.id) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await favoritesApi.getFavorites(user.id);
      setFavorites(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (listingId) => {
    if (!user?.id) return;
    
    try {
      await favoritesApi.addFavorite(user.id, listingId);
      setFavorites(prev => [...prev, listingId]);
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  };

  const removeFavorite = async (listingId) => {
    if (!user?.id) return;
    
    try {
      await favoritesApi.removeFavorite(user.id, listingId);
      setFavorites(prev => prev.filter(id => id !== listingId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  };

  const toggleFavorite = async (listingId) => {
    if (isFavorite(listingId)) {
      await removeFavorite(listingId);
    } else {
      await addFavorite(listingId);
    }
  };

  const isFavorite = (listingId) => {
    return favorites.includes(listingId);
  };

  return {
    favorites,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    refetch: fetchFavorites,
  };
};
