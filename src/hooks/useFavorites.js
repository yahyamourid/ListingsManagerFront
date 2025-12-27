import { useState, useEffect, useCallback } from "react";
import { favoritesApi } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const fetchFavorites = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await favoritesApi.getFavorites(currentPage, itemsPerPage);
      setFavorites(data.items);
      setTotalItems(data.total);
    } catch (err) {
      setError(err.message || "Error fetching favorites");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = async (listingId) => {
    try {
      await favoritesApi.addFavorite(listingId);
      fetchFavorites();
    } catch (err) {
      setError(err.message || "Error adding favorite");
      throw err;
    }
  };

  const removeFavorite = async (listingId) => {
    if (!user?.id) return;

    try {
      await favoritesApi.removeFavorite(listingId);
      if (favorites.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
        return;
      }
      fetchFavorites();
    } catch (err) {
      setError(err.message || "Error removing favorite");
      throw err;
    }
  };

  const toggleFavorite = async (listing) => {
    if (listing.is_favorite) {
      await removeFavorite(listing.id);
    } else {
      await addFavorite(listing.id);
    }
  };

  return {
    favorites,
    loading,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refetch: fetchFavorites,
    setCurrentPage,
    setItemsPerPage,
    setTotalItems,
  };
};
