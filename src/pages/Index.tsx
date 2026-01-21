import React, { useState, useEffect } from "react";
import {
  Building2,
  LayoutGrid,
  List,
  Plus,
  LogOut,
  Heart,
  User,
  LayoutDashboard,
  Info,
  Hourglass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useListings } from "@/hooks/useListings";
import { useChangeLog } from "@/hooks/useChangeLog";
import { useFavorites } from "@/hooks/useFavorites";
import { StatsCards } from "@/components/listings/StatsCards";
import { ListingsTable } from "@/components/listings/ListingsTable";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingFormModal } from "@/components/listings/ListingFormModal";
import { EditorFieldEditModal } from "@/components/listings/EditorFieldEditModal";
import { DeleteConfirmModal } from "@/components/listings/DeleteConfirmModal";
import { ArchiveConfirmModal } from "@/components/listings/ArchiveConfirmModal";
import { ListingHistoryModal } from "@/components/listings/ListingHistoryModal";
import { CoordinatesMapModal } from "@/components/listings/CoordinatesMapModal";
import { FiltersBar } from "@/components/listings/FiltersBar";
import { Pagination } from "@/components/listings/Pagination";
import { scrapersApi } from "@/services/scrapersApi";
import formatDate from "@/utils/formateDate";

const Index = () => {
  const { toast } = useToast();
  const { user, isEditor, isAdmin, isSubscriber, canAccessDashboard, logout } =
    useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditorEditModalOpen, setIsEditorEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [deletingListing, setDeletingListing] = useState(null);
  const [archivingListing, setArchivingListing] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { logChange, saveInitialSnapshot } = useChangeLog();
  const { toggleFavorite, isFavorite, chan } = useFavorites();

  const [isOpenChanges, setOpenChanges] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapListing, setMapListing] = useState(null);

  const [lastScraped, setLastScraped] = useState(null);

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
    fetchListings,
    createListing,
    updateListing,
    deleteListing,
    archiveListing,
    restoreListing,
  } = useListings();

  // Save initial snapshots for all listings
  useEffect(() => {
    if (listings && listings.length > 0) {
      listings.forEach((listing) => {
        saveInitialSnapshot(listing);
      });
    }
    getLastScraped();
  }, [saveInitialSnapshot]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getLastScraped = async () => {
    const result = await scrapersApi.getLastScraped();
    setLastScraped(result.date_scraped);
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

  const handleOpenArchiveModal = (listing) => {
    setArchivingListing(listing);
    setIsArchiveModalOpen(true);
  }

  const handleOpenChangesModal = (listing) => {
    setSelectedListing(listing);
    setOpenChanges(true);
  };

  const handleOpenMapModal = (listing) => {
    setMapListing(listing);
    setIsMapModalOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingListing) {
        await updateListing(editingListing.id, data);
        toast({
          title: "Success",
          description: "Listing updated successfully",
        });
      } else {
        await createListing(data);
        toast({
          title: "Success",
          description: "Listing created successfully",
        });
      }
      setIsFormModalOpen(false);
      setEditingListing(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
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

      if (field === "current_price") {
        updateData.current_price = newValue;
      } else if (field === "status") {
        updateData.is_sold = newValue === "sold";
        updateData.status = newValue;
      } else if (field === "sale_date") {
        updateData.sale_date = newValue;
      }

      await updateListing(editingListing.id, updateData);

      // Log the change
      logChange(
        editingListing.id,
        field,
        oldValue,
        newValue,
        user?.email || "Unknown",
        editingListing.address
      );

      toast({
        title: "Success",
        description: `${field.replace("_", " ")} updated successfully`,
      });

      setIsEditorEditModalOpen(false);
      setEditingListing(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
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
        title: "Success",
        description: "Listing deleted successfully",
      });
      setIsDeleteModalOpen(false);
      setDeletingListing(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete listing",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchiveConfirm = async () => {
    if (!archivingListing) return;

    setIsSubmitting(true);
    try {
      if (archivingListing.is_archived) {
        await restoreListing(archivingListing.id);
        toast({
          title: "Success",
          description: "Listing restored successfully",
        });
      } else {
        await archiveListing(archivingListing.id);
        toast({
          title: "Success",
          description: "Listing archived successfully",
        });
      }
      setIsArchiveModalOpen(false);
      setArchivingListing(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to archive listing",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

    const handleMapSave = async (listing, newCoordinates) => {
      setIsSubmitting(true);
      try {
        await updateListing(listing.id, newCoordinates);
        toast({
          title: "Success",
          description: "Coordinates updated successfully",
        });
        setIsMapModalOpen(false);
        setMapListing(null);
      } catch (err) {
        toast({
          title: "Error",
          description: err.message || "Failed to update coordinates",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleToggleFavorite = async (listing) => {
      console.log(listing);
      try {
        await toggleFavorite(listing);
        toast({
          title: listing.is_favorite ? "Removed" : "Added",
          description: listing.is_favorite
            ? "Removed from favorites"
            : "Added to favorites",
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to update favorites",
          variant: "destructive",
        });
      }
    };

    const getRoleBadge = () => {
      if (isAdmin)
        return {
          label: "Admin",
          className: "bg-destructive/20 text-destructive",
        };
      if (isEditor)
        return { label: "Editor", className: "bg-accent/20 text-accent" };
      return { label: "Subscriber", className: "bg-primary/20 text-primary" };
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
                  <p className="text-sm text-muted-foreground">BonMLS</p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Last scrape */}
                {lastScraped && (
                  <div className="flex items-center gap-1 text-xs bg-muted px-4 py-1.5 rounded-lg">
                    <Hourglass className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-muted-foreground font-semibold ">Last Scraping</p>
                      <p className="text-foreground">{formatDate(lastScraped)}</p>
                    </div>
                  </div>
                )}
                {/* User Info */}
                <div className="flex items-center gap-2 px-5 py-3 bg-muted rounded-lg">
                  <div
                    className={`w-2 h-2 rounded-full ${isAdmin
                      ? "bg-destructive"
                      : isEditor
                        ? "bg-accent"
                        : "bg-primary"
                      }`}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {user?.full_name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${roleBadge.className}`}
                  >
                    {roleBadge.label}
                  </span>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-muted rounded-lg p-1">
                  <button
                    onClick={() => {
                      setViewMode("table");
                      fetchListings();
                    }}
                    className={`p-2 rounded-md transition-all ${viewMode === "table"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setViewMode("cards");
                      fetchListings();
                    }}
                    className={`p-2 rounded-md transition-all ${viewMode === "cards"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    <LayoutGrid className="w-5 h-5" />
                  </button>
                </div>

                {/* Subscriber Actions */}
                {isSubscriber && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate("/favorites")}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => navigate("/profile")}
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </>
                )}

                {/* Editor/Admin Actions */}
                {(isEditor || isAdmin) && (
                  <>
                    <Button
                      onClick={handleOpenCreateModal}
                      className="btn-gradient"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Listing
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate(isAdmin ? "/admin" : "/editor")}
                      className="flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </Button>
                  </>
                )}

                {isEditor && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigate("/favorites")}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
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
              isEditor={isEditor || isAdmin}
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
              {viewMode === "table" ? (
                <ListingsTable
                  listings={listings}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSort={handleSort}
                  isEditor={isEditor || isAdmin}
                  onEdit={handleOpenEditModal}
                  onDelete={handleOpenDeleteModal}
                  onArchive={handleOpenArchiveModal}
                  onListingChanges={handleOpenChangesModal}
                  onToggleFavorite={
                    isSubscriber || isEditor ? handleToggleFavorite : undefined
                  }
                  isFavorite={isFavorite}
                  onOpenMap={handleOpenMapModal}
                />
              ) : listings.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No listings found
                </div>
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
                        onListingChanges={handleOpenChangesModal}
                        onArchive={handleOpenArchiveModal}
                        onToggleFavorite={
                          isSubscriber || isEditor
                            ? handleToggleFavorite
                            : undefined
                        }
                        onOpenMap={handleOpenMapModal}
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

        <ArchiveConfirmModal
          isOpen={isArchiveModalOpen}
          onClose={() => {
            setIsArchiveModalOpen(false);
            setArchivingListing(null);
          }}
          onConfirm={handleArchiveConfirm}
          listing={archivingListing}
          isLoading={isSubmitting}
        />

        {selectedListing && (
          <ListingHistoryModal
            isOpen={isOpenChanges}
            onClose={() => {
              setOpenChanges(false);
              setSelectedListing(null);
            }}
            listingId={selectedListing.id}
          />
        )}

        <CoordinatesMapModal
          isOpen={isMapModalOpen}
          onClose={() => {
            setIsMapModalOpen(false);
            setMapListing(null);
          }}
          listing={mapListing}
          onSave={handleMapSave}
        />
      </div>
    );
  };

  export default Index;
