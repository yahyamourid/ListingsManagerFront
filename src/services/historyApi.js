import { apiClient } from './apiClient';
import { demoListingHistory } from './demoData';

export const historyApi = {
  getHistory: async ({
    page = 1,
    pageSize = 20,
    sortOrder = 'desc',
    changeType = null,
    startDate = null,
    endDate = null,
  } = {}) => {
    try {
      let endpoint = `/listings/history?page=${page}&page_size=${pageSize}&sort_order=${sortOrder}`;
      if (changeType) endpoint += `&change_type=${changeType}`;
      if (startDate) endpoint += `&start_date=${startDate}`;
      if (endDate) endpoint += `&end_date=${endDate}`;
      
      const response = await apiClient.get(endpoint);
      return response;
    } catch (error) {
      if (error.status === 0) {
        console.warn('Backend not available, using demo history data');
        
        let filtered = [...demoListingHistory];
        
        // Filter by change type
        if (changeType) {
          filtered = filtered.filter(h => h.change_type === changeType);
        }
        
        // Filter by date range
        if (startDate) {
          const start = new Date(startDate);
          filtered = filtered.filter(h => new Date(h.timestamp) >= start);
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          filtered = filtered.filter(h => new Date(h.timestamp) <= end);
        }
        
        // Sort by date
        filtered.sort((a, b) => {
          const dateA = new Date(a.timestamp);
          const dateB = new Date(b.timestamp);
          return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
        });
        
        // Paginate
        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const items = filtered.slice(start, start + pageSize);
        
        return {
          success: true,
          message: 'History retrieved successfully',
          data: {
            items,
            total,
            pages: Math.ceil(total / pageSize),
            page,
            page_size: pageSize,
          },
        };
      }
      throw error;
    }
  },

  getHistoryByListing: async (listingId, page = 1, pageSize = 20) => {
    try {
      const response = await apiClient.get(`/listings/${listingId}/history?page=${page}&page_size=${pageSize}`);
      return response;
    } catch (error) {
      if (error.status === 0) {
        const filtered = demoListingHistory
          .filter(h => h.listing_id === parseInt(listingId))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        const total = filtered.length;
        const start = (page - 1) * pageSize;
        const items = filtered.slice(start, start + pageSize);
        
        return {
          success: true,
          message: 'History retrieved successfully',
          data: {
            items,
            total,
            pages: Math.ceil(total / pageSize),
            page,
            page_size: pageSize,
          },
        };
      }
      throw error;
    }
  },

  logChange: async (changeData) => {
    try {
      const response = await apiClient.post('/listings/history', changeData);
      return response;
    } catch (error) {
      if (error.status === 0) {
        const newEntry = {
          id: String(Date.now()),
          ...changeData,
          timestamp: new Date().toISOString(),
        };
        demoListingHistory.unshift(newEntry);
        return { success: true, message: 'Change logged successfully', data: newEntry };
      }
      throw error;
    }
  },
};

export default historyApi;
