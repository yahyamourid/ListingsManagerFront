import { apiClient, ApiError } from "./apiClient";
import { demoListings } from "./demoData";

/**
 * Helper to build query params safely
 */
const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, value);
    }
  });
  return query.toString();
};

export const listingsApi = {
  // =====================================================
  // ======================= READ ========================
  // =====================================================

  /**
   * Advanced search
   * GET /listings/search
   */
  searchListings: async (filters = {}) => {
    try {
      const query = buildQuery(filters);
      const response = await apiClient.get(`/listings/search?${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Advanced search WITH history
   * GET /listings/search-with-history
   */
  searchListingsWithHistory: async (filters = {}) => {
    const query = buildQuery(filters);
    const response = await apiClient.get(
      `/listings/search-with-history?${query}`
    );
    return response.data;
  },

  /**
   * Get single listing
   * GET /listings/{id}
   */
  getListing: async (id) => {
    try {
      const response = await apiClient.get(`/listings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get listing history
   * GET /listings/{id}/history
   */
  getListingHistory: async (id) => {
    try {
      const response = await apiClient.get(`/listings/${id}/history`);
      return response.data;
    } catch (error) {
      throw error
    }
  },

  // =====================================================
  // ======================= CREATE ======================
  // =====================================================

  /**
   * Create listing
   * POST /listings
   */
  createListing: async (payload) => {
    try {
      const response = await apiClient.post("/listings", payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // ======================= UPDATE ======================
  // =====================================================

  /**
   * Update listing
   * PUT /listings/{id}
   */
  updateListing: async (id, payload) => {
    try {
      const response = await apiClient.put(`/listings/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // ======================= ARCHIVE =====================
  // =====================================================

  /**
   * Archive listing (soft delete)
   * POST /listings/{id}/archive
   */
  archiveListing: async (id, reason = null) => {
    try {
      const response = await apiClient.post(
        `/listings/${id}/archive`,
        reason ? { reason } : null
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // =====================================================
  // ======================= DELETE ======================
  // =====================================================

  /**
   * Delete listing (hard delete)
   * DELETE /listings/{id}
   */
  deleteListing: async (id) => {
    try {
      const response = await apiClient.delete(`/listings/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const getListing = listingsApi.getListing;
export const getListingHistory = listingsApi.getListingHistory;
export default listingsApi;
