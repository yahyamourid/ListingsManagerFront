import { apiClient } from "./apiClient";

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

export const scrapersApi = {
  // =====================================================
  // ======================= READ ========================
  // =====================================================

  /**
   * Get all scrapers (paginated)
   * GET /scrapers
   */
  getAllScrapers: async ({ page = 1, page_size = 20 } = {}) => {
    const query = buildQuery({ page, page_size });
    const response = await apiClient.get(`/scrapers?${query}`);
    return response.data;
  },

  /**
   * Get last scraped
   * GET /scrapers/last
   */
  getLastScraped: async () => {
    const response = await apiClient.get("/scrapers/last");
    return response.data;
  },

  /**
   * Get scrapers by date
   * GET /scrapers/by-date
   */
  getScrapersByDate: async (date) => {
    const query = buildQuery({ scraped_date: date });
    const response = await apiClient.get(`/scrapers/by-date?${query}`);
    return response.data;
  },
};

export const getScrapersByDate = scrapersApi.getScrapersByDate;
export const getLastScraped = scrapersApi.getLastScraped;

export default scrapersApi;
