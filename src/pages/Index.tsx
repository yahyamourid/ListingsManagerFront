import React, { useState, useEffect } from 'react';
import { Building2, LayoutGrid, List, Plus, LogOut, Heart, User, LayoutDashboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useListings } from '@/hooks/useListings';
import { useChangeLog } from '@/hooks/useChangeLog';
import { useFavorites } from '@/hooks/useFavorites';
import { StatsCards } from '@/components/listings/StatsCards';
import { ListingsTable } from '@/components/listings/ListingsTable';
import { ListingCard } from '@/components/listings/ListingCard';
import { ListingFormModal } from '@/components/listings/ListingFormModal';
import { EditorFieldEditModal } from '@/components/listings/EditorFieldEditModal';
import { DeleteConfirmModal } from '@/components/listings/DeleteConfirmModal';
import { FiltersBar } from '@/components/listings/FiltersBar';
import { Pagination } from '@/components/listings/Pagination';

const Index = () => {
  const { toast } = useToast();
  const { user, isEditor, isAdmin, isSubscriber, canAccessDashboard, logout } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('table');
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditorEditModalOpen, setIsEditorEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [deletingListing, setDeletingListing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { logChange, saveInitialSnapshot } = useChangeLog();
  const { toggleFavorite, isFavorite } = useFavorites();

  const {
    listings,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort,
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
    stats,
    createListing,
    updateListing,
    deleteListing,
  } = useListings();

  // Save initial snapshots for all listings
  useEffect(() => {
    if (listings && listings.length > 0) {
      listings.forEach(listing => {
        saveInitialSnapshot(listing);
      });
    }
  }, [listings, saveInitialSnapshot]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleOpenCreateModal = () => {
    setEditingListing(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (listing) => {
    setEditingListing(listing);
    // For editors (non-admin), use the field edit modal
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (listing) => {
    setDeletingListing(listing);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingListing) {
        await updateListing(editingListing.id, data);
        toast({
          title: 'Success',
          description: 'Listing updated successfully',
        });
      } else {
        await createListing(data);
        toast({
          title: 'Success',
          description: 'Listing created successfully',
        });
      }
      setIsFormModalOpen(false);
      setEditingListing(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditorFieldSubmit = async ({ field, oldValue, newValue }) => {
    if (!editingListing) return;
    
    setIsSubmitting(true);
    try {
      // Prepare update data based on field
      const updateData = { ...editingListing };
      
      if (field === 'current_price') {
        updateData.current_price = newValue;
      } else if (field === 'status') {
        updateData.is_sold = newValue === 'sold';
        updateData.status = newValue;
      } else if (field === 'sale_date') {
        updateData.sale_date = newValue;
      }

      await updateListing(editingListing.id, updateData);

      // Log the change
      logChange(
        editingListing.id,
        field,
        oldValue,
        newValue,
        user?.email || 'Unknown',
        editingListing.address
      );

      toast({
        title: 'Success',
        description: `${field.replace('_', ' ')} updated successfully`,
      });

      setIsEditorEditModalOpen(false);
      setEditingListing(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingListing) return;
    
    setIsSubmitting(true);
    try {
      await deleteListing(deletingListing.id);
      toast({
        title: 'Success',
        description: 'Listing deleted successfully',
      });
      setIsDeleteModalOpen(false);
      setDeletingListing(null);
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete listing',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleFavorite = async (listingId) => {
    try {
      await toggleFavorite(listingId);
      toast({
        title: isFavorite(listingId) ? 'Removed' : 'Added',
        description: isFavorite(listingId) ? 'Removed from favorites' : 'Added to favorites',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadge = () => {
    if (isAdmin) return { label: 'Admin', className: 'bg-destructive/20 text-destructive' };
    if (isEditor) return { label: 'Editor', className: 'bg-accent/20 text-accent' };
    return { label: 'Subscriber', className: 'bg-primary/20 text-primary' };
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-foreground">
                  Listings Manager
                </h1>
                <p className="text-sm text-muted-foreground">
                  Real Estate Database
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 flex-wrap">
              {/* User Info */}
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <div className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-destructive' : isEditor ? 'bg-accent' : 'bg-primary'}`} />
                <span className="text-sm font-medium text-foreground">{user?.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${roleBadge.className}`}>
                  {roleBadge.label}
                </span>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'table'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('cards')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'cards'
                      ? 'bg-card text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>

              {/* Subscriber Actions */}
              {isSubscriber && (
                <>
                  <Button variant="outline" size="icon" onClick={() => navigate('/favorites')}>
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigate('/profile')}>
                    <User className="w-4 h-4" />
                  </Button>
                </>
              )}

              {/* Editor/Admin Actions */}
              {(isEditor || isAdmin) && (
                <>
                  <Button onClick={handleOpenCreateModal} className="btn-gradient">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Listing
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate(isAdmin ? '/admin' : '/editor')}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </>
              )}
              
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats */}
        {/* <StatsCards stats={stats} /> */}
        
        {/* Filters */}
        <div className="mb-6">
          <FiltersBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filters={filters}
            onFiltersChange={setFilters}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters(!showFilters)}
          />
        </div>
        
        {/* Loading/Error States */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-6 text-center">
            <p className="text-destructive font-medium">Error: {error}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure your FastAPI backend is running at the configured URL.
            </p>
          </div>
        )}
        
        {/* Listings */}
        {!loading && !error && (
          <>
            {viewMode === 'table' ? (
              <ListingsTable
                listings={listings}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                isEditor={isEditor || isAdmin}
                onEdit={handleOpenEditModal}
                onDelete={handleOpenDeleteModal}
                onToggleFavorite={isSubscriber ? handleToggleFavorite : undefined}
                isFavorite={isFavorite}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {listings.map((listing, index) => (
                  <div 
                    key={listing.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ListingCard
                      listing={listing}
                      isEditor={isEditor || isAdmin}
                      onEdit={handleOpenEditModal}
                      onDelete={handleOpenDeleteModal}
                      onToggleFavorite={isSubscriber ? handleToggleFavorite : undefined}
                      isFavorite={isFavorite(listing.id)}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(value) => {
                  setItemsPerPage(value);
                  setCurrentPage(1);
                }}
              />
            )}
          </>
        )}
      </main>

      {/* Modals */}
      <ListingFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingListing(null);
        }}
        onSubmit={handleFormSubmit}
        listing={editingListing}
        isLoading={isSubmitting}
      />

      <EditorFieldEditModal
        isOpen={isEditorEditModalOpen}
        onClose={() => {
          setIsEditorEditModalOpen(false);
          setEditingListing(null);
        }}
        listing={editingListing}
        onSubmit={handleEditorFieldSubmit}
        isLoading={isSubmitting}
      />
      
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingListing(null);
        }}
        onConfirm={handleDeleteConfirm}
        listing={deletingListing}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default Index;
