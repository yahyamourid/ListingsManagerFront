import { apiClient, ApiError } from './apiClient';

export const statisticsApi = {
    getStatsUsers : async () => {
        try {
            const response = await apiClient.get("/statistics/users")
            return response.data
        } catch (error) {
            throw error
        }
    },


    getStatsListings : async () => {
        try {
            const response = await apiClient.get("/statistics/listings")
            return response.data
        } catch (error) {
            throw error
        }
    }
}