import React, { useState, useMemo } from 'react';
import { useListings } from '@/hooks/useListings';
import { useChangeLog } from '@/hooks/useChangeLog';
import { ListingsTable } from '@/components/listings/ListingsTable';
import { FiltersBar } from '@/components/listings/FiltersBar';
import { Pagination } from '@/components/listings/Pagination';
import { EditorFieldEditModal } from '@/components/listings/EditorFieldEditModal';
import { useToast } from '@/hooks/use-toast';

const EditorListings = () => {
  const { data: listings = [], isLoading, refetch } = useListings();
  const { logChange, saveInitialSnapshot, getInitialSnapshot } = useChangeLog();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'address', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  // Save initial snapshots
  useMemo(() => {
    listings.forEach(listing => {
      if (!getInitialSnapshot(listing.id)) {
        saveInitialSnapshot(listing);
      }
    });
  }, [listings]);

  const filteredListings = useMemo(() => {
    let result = [...listings];
    
    if (searchQuery) {
      result = result.filter(listing =>
        listing.address?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(listing => listing.status === statusFilter);
    }
    
    result.sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      const modifier = sortConfig.direction === 'asc' ? 1 : -1;
      return aVal > bVal ? modifier : -modifier;
    });
    
    return result;
  }, [listings, searchQuery, statusFilter, sortConfig]);

  const paginatedListings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredListings.slice(start, start + itemsPerPage);
  }, [filteredListings, currentPage, itemsPerPage]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleOpenEditModal = (listing) => {
    setEditingListing(listing);
    setEditModalOpen(true);
  };

  const handleEditorFieldSubmit = async (listingId, field, value) => {
    const listing = listings.find(l => l.id === listingId);
    if (!listing) return;
    
    const oldValue = listing[field];
    
    logChange({
      listingId,
      address: listing.address,
      field,
      oldValue,
      newValue: value,
    });
    
    // In real app, this would call API
    toast({
      title: 'Change Logged',
      description: `${field} updated from "${oldValue}" to "${value}"`,
    });
    
    setEditModalOpen(false);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Manage Listings</h1>
        <p className="text-muted-foreground">Edit listing prices, status, and sale dates</p>
      </div>

      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <ListingsTable
        listings={paginatedListings}
        sortConfig={sortConfig}
        onSort={handleSort}
        onEdit={handleOpenEditModal}
        showActions={true}
      />

      <Pagination
        currentPage={currentPage}
        totalItems={filteredListings.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <EditorFieldEditModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        listing={editingListing}
        onSubmit={handleEditorFieldSubmit}
      />
    </div>
  );
};

export default EditorListings;
