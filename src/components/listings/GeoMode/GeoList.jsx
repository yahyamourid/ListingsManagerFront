import React, { useRef, useEffect, useState } from "react";
import { ListingCard } from "../ListingCard";
import { ListingCardSkeleton } from "../ListingCardSkeleton";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const GeoList = ({
  listings,
  hoveredListingId,
  onCardHover,
  isEditor,
  onEdit,
  onDelete,
  onListingChanges,
  onArchive,
  onToggleFavorite,
  onOpenMap,
  loading,
  fullWidth = false,
  totalItems,
}) => {
  const scrollRefs = useRef({});
  const listContainerRef = useRef(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Reset page when listings change (new search/map move)
  useEffect(() => {
    setPage(1);
  }, [listings]);

  // Scroll to hovered item if needed?
  // Maybe annoying if it jumps around. User didn't strictly ask for scroll-to on hover.
  // "hover the point... and that card of the listing diplayed inside the map"
  // "hover the card... her position in the map will be cored with dufferetnt color"
  // So primarily synchronization is coloring.

  useEffect(() => {
    if (hoveredListingId && scrollRefs.current[hoveredListingId]) {
      // scrollRefs.current[hoveredListingId].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [hoveredListingId]);

  // Pagination Logic
  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const displayedListings = listings.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);

      listContainerRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="h-full px-4 pr-2 flex flex-col">
      {/* Total Items Header */}
      <div className="flex justify-end mb-4 pt-2">
        <div className="bg-foreground text-background px-4 py-1.5 rounded-full text-xs font-bold tracking-wider flex items-center gap-2 shadow-lg transform hover:scale-105 transition-all">
          <Building2 className="w-3.5 h-3.5" />
          {loading ? (
            <span className="animate-pulse">SEARCHING...</span>
          ) : (
            <span>
              {totalItems} {totalItems === 1 ? "RESULT" : "RESULTS"} FOUND
            </span>
          )}
        </div>
      </div>

      <div
        ref={listContainerRef}
        id="geo-list-container"
        className="
    flex-1 pr-2 max-h-[65vh] overflow-auto scrollbar-thin
    scrollbar-thumb-gray-400
    scrollbar-track-background
    hover:scrollbar-thumb-gray-700
  "
      >
        {/* "grid diplay in the left two cards by line" */}
        <div
          className={`grid grid-cols-1 ${fullWidth ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "md:grid-cols-2"} gap-4 p-2`}
        >
          {loading ? (
            // Show 10 skeletons
            Array.from({ length: 10 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))
          ) : listings.length > 0 ? (
            displayedListings.map((listing) => {
              const isHovered = hoveredListingId === listing.id;
              return (
                <div
                  key={listing.id}
                  ref={(el) => (scrollRefs.current[listing.id] = el)}
                  className={`transition-all duration-200 rounded-xl ${
                    isHovered ? " bg-accent/5 transform scale-[1.02] border border-accent" : ""
                  }`}
                  onMouseEnter={() => onCardHover(listing.id)}
                  onMouseLeave={() => onCardHover(null)}
                >
                  <ListingCard
                    listing={listing}
                    isEditor={isEditor}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onListingChanges={onListingChanges}
                    onArchive={onArchive}
                    onToggleFavorite={onToggleFavorite}
                    onOpenMap={onOpenMap}
                  />
                </div>
              );
            })
          ) : (
            <div
              className={`text-center py-12 text-muted-foreground ${fullWidth ? "col-span-full" : "col-span-2"}`}
            >
              No listings found in this area
            </div>
          )}
        </div>

        {/* Pagination Footer */}
        {!loading && listings.length > 10 && (
          <div className="flex justify-center items-center gap-3 py-4 mt-auto border-t border-border/50">
            {/* First Page */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(1)}
              disabled={page === 1}
              className="h-8 w-8 rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground"
              title="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            {/* Previous Page */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="h-8 w-8 rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground"
              title="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Indicator */}
            <span className="text-sm font-medium text-muted-foreground bg-muted/30 px-3 py-1 rounded-full">
              Page <span className="text-foreground font-bold">{page}</span> of{" "}
              {totalPages}
            </span>

            {/* Next Page */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="h-8 w-8 rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground"
              title="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            {/* Last Page */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(totalPages)}
              disabled={page === totalPages}
              className="h-8 w-8 rounded-full shadow-sm hover:bg-accent hover:text-accent-foreground"
              title="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
