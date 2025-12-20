import { apiClient, ApiError } from './apiClient';
import { demoListings } from './demoData';

/**
 * Helper to build query params safely
 */
const buildQuery = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
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
      if (error.status === 0) {
        console.warn('Backend unavailable, using demo data');
        return {
          items: demoListings,
          total: demoListings.length,
          page: 1,
          page_size: demoListings.length,
        };
      }
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
      if (error.status === 0) {
        const listing = demoListings.find(l => l.id === Number(id));
        if (!listing) {
          throw new ApiError('Listing not found', 404);
        }
        return listing;
      }
      throw error;
    }
  },

  /**
   * Get listing history
   * GET /listings/{id}/history
   */
  getListingHistory: async (id, { page = 1, page_size = 20 } = {}) => {
    const query = buildQuery({ page, page_size });
    const response = await apiClient.get(
      `/listings/${id}/history?${query}`
    );
    return response.data;
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
      const response = await apiClient.post('/listings', payload);
      return response.data;
    } catch (error) {
      if (error.status === 0) {
        const newId =
          Math.max(0, ...demoListings.map(l => l.id)) + 1;
        const newListing = { ...payload, id: newId };
        demoListings.push(newListing);
        return newListing;
      }
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
      const response = await apiClient.put(
        `/listings/${id}`,
        payload
      );
      return response.data;
    } catch (error) {
      if (error.status === 0) {
        const index = demoListings.findIndex(l => l.id === id);
        if (index === -1) {
          throw new ApiError('Listing not found', 404);
        }
        demoListings[index] = {
          ...demoListings[index],
          ...payload,
        };
        return demoListings[index];
      }
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
    const response = await apiClient.post(
      `/listings/${id}/archive`,
      reason ? { reason } : null
    );
    return response.data;
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
      if (error.status === 0) {
        const index = demoListings.findIndex(l => l.id === id);
        if (index === -1) {
          throw new ApiError('Listing not found', 404);
        }
        demoListings.splice(index, 1);
        return { message: 'Deleted successfully' };
      }
      throw error;
    }
  },
};

export const getListing = listingsApi.getListing;
export default listingsApi;
