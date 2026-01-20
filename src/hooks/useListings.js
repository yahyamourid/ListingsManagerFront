import { useEffect, useState, useCallback } from "react";
import { listingsApi } from "../services/api";

export const useListings = (isSoldMode = false) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters & search
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(
    isSoldMode
      ? {
          status: "sold",
          sold: true,
        }
      : {},
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Sorting
  const [sortField, setSortField] = useState("updated_at");
  const [sortDirection, setSortDirection] = useState("desc");

  // Optional stats
  const [stats, setStats] = useState(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listingsApi.searchListings({
        search: searchTerm,
        ...filters,
        page: currentPage,
        page_size: itemsPerPage,
        sort_by: sortField,
        sort_direction: sortDirection,
      });

      setListings(data.items);
      setTotalItems(data.total);
      setStats(data.stats || null);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // ================= CRUD =================

  const createListing = async (payload) => {
    const created = await listingsApi.createListing(payload);
    fetchListings();
    return created;
  };

  const updateListing = async (id, payload) => {
    const updated = await listingsApi.updateListing(id, payload);
    fetchListings();
    return updated;
  };

  const archiveListing = async (id) => {
    const archived = await listingsApi.archiveListing(id);
    fetchListings();
    // return archived;
  };

  const restoreListing = async (id) => {
    const restored = await listingsApi.restoreListing(id);
    fetchListings();
    // return restored;
  };

  const deleteListing = async (id) => {
    await listingsApi.deleteListing(id);
    fetchListings();
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const refetch = () => {
    fetchListings();
  };

  return {
    listings,
    loading,
    error,

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
    handleSort,

    stats,

    fetchListings,
    createListing,
    updateListing,
    deleteListing,
    archiveListing,
    restoreListing,

    refetch
  };
};
