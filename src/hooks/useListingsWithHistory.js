import { useEffect, useState, useCallback } from "react";
import { listingsApi } from "@/services/api";

export const useListingsWithHistory = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search & filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting
  const [sortField, setSortField] = useState("updated_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Extra stats from backend
  const [stats, setStats] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await listingsApi.searchListingsWithHistory({
        search: searchTerm,
        ...filters,
        page: currentPage,
        page_size: itemsPerPage,
        sort_by: sortField,
        sort_direction: sortDirection,
      });

      setListings(res.items);
      setTotalItems(res.total);
      setTotalPages(res.pages);
      setStats({
        total_all: res.total_all,
        total_modified: res.total_modified,
        total_not_modified: res.total_not_modified,
      });
    } catch (err) {
      setError(err.message || "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [
    searchTerm,
    filters,
    currentPage,
    itemsPerPage,
    sortField,
    sortDirection,
  ]);

  const refetch = () => {
    fetchListings();
  };
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return {
    listings,
    loading,
    error,

    refetch,

    searchTerm,
    setSearchTerm,
    filters,
    setFilters,

    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    totalItems,

    sortField,
    sortDirection,
    setSortField,
    setSortDirection,

    stats,
  };
};
