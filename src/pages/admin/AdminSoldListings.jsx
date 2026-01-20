import React, { useState, useEffect } from "react";
import {
  Building2,
  LayoutGrid,
  List,
  RefreshCw,
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
import { FiltersBar } from "@/components/listings/FiltersBar";
import { Pagination } from "@/components/listings/Pagination";
import { SoldListingTable } from "@/components/listings/SoldListingTable";
import { SoldListingCard } from "@/components/listings/SoldListingCard";
import { ListingHistoryModal } from "@/components/listings/ListingHistoryModal";

const AdminSoldListings = () => {
  const { toast } = useToast();
  const { user, isEditor, isAdmin, isSubscriber, canAccessDashboard, logout } =
    useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("table");
  const [showFilters, setShowFilters] = useState(false);

  const [isOpenChanges, setOpenChanges] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

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
    refetch,
    stats,
    fetchListings,
    createListing,
    updateListing,
    deleteListing,
    archiveListing,
    restoreListing,
  } = useListings(true);

  const handleOpenChangesModal = (listing) => {
    setSelectedListing(listing);
    setOpenChanges(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between ">
        <div>
          <h1 className="text-2xl font-bold">Sold Listings</h1>
          <p className="text-muted-foreground">Listings with sold status</p>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center rounded-lg p-1">
            <button
              onClick={() => {
                setViewMode("table");
                // fetchListings();
              }}
              className={`p-2 rounded-md transition-all ${
                viewMode === "table"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                setViewMode("cards");
                // fetchListings();
              }}
              className={`p-2 rounded-md transition-all ${
                viewMode === "cards"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              currentPage !== 1 ? setCurrentPage(1) : refetch();
            }}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>
      {/* Main Content */}
      <main className="py-6">
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
            isSoldMode={true}
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
              <SoldListingTable
                listings={listings}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onListingChanges={handleOpenChangesModal}
              />
            ) : listings.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                No listings found
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing, index) => (
                  <div
                    key={listing.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <SoldListingCard
                      listing={listing}
                      onListingChanges={handleOpenChangesModal}
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
    </div>
  );
};

export default AdminSoldListings;
