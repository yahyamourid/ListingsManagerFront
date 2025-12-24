import React, { useState } from "react";
import { useListingsWithHistory } from "@/hooks/useListingsWithHistory";
import { FiltersBar } from "@/components/listings/FiltersBar";
import { Pagination } from "@/components/listings/Pagination";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  History,
  DollarSign,
  Tag,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

const AdminArchive = () => {
  const {
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
  } = useListingsWithHistory();

  const [expanded, setExpanded] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-2xl font-bold">Listings Archive</h1>
          <p className="text-muted-foreground">
            Listings with price & status history
          </p>
        </div>
        {/* Reload */}
        <div className="flex">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              currentPage != 1 ? setCurrentPage(1) : refetch();
            }}
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold">{stats.total_all}</p>
              <p className="text-sm text-muted-foreground">Total listings</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-amber-500">
                {stats.total_modified}
              </p>
              <p className="text-sm text-muted-foreground">Modified</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <p className="text-2xl font-bold text-green-500">
                {stats.total_not_modified}
              </p>
              <p className="text-sm text-muted-foreground">Unchanged</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters & Sort */}
      <div className="flex items-top gap-3 w-full">
        <div className="flex w-11/12">
          <FiltersBar
            searchTerm={searchTerm}
            onSearchChange={(v) => {
              setSearchTerm(v);
              setCurrentPage(1);
            }}
            filters={filters}
            onFiltersChange={(f) => {
              setFilters(f);
              setCurrentPage(1);
            }}
            showFilters={showFilters}
            onToggleFilters={() => setShowFilters((p) => !p)}
            isHistory={true}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            setCurrentPage(1);
          }}
          className="flex items-center gap-2 w-1/12"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortDirection === "asc" ? "Old" : "New"}
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Card>
          <CardContent className="pt-4">
            {error && <p className="text-red-500">{error}</p>}

            {!loading && listings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                No listings found
              </div>
            )}

            <div className="space-y-4">
              {listings.map((listing) => {
                const isExpanded = expanded[listing.id];
                const hasHistory = listing.history?.length > 0;

                return (
                  <Card key={listing.id} className="border">
                    <CardHeader
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => toggleExpand(listing.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <CardTitle className="text-base">
                            {listing.address || "Unnamed listing"}
                          </CardTitle>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">
                              ${listing.current_price?.toLocaleString()}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                hasHistory
                                  ? "border-amber-500 text-amber-500"
                                  : "border-green-500 text-green-500"
                              }
                            >
                              {hasHistory
                                ? `${listing.history.length} changes`
                                : "No changes"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`/details/${listing.id}`, "_blank");
                            }}
                          >
                            Details
                          </Button>
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    {isExpanded && (
                      <CardContent className="space-y-3">
                        {hasHistory ? (
                          listing.history.map((h) => (
                            <div
                              key={h.id}
                              className="flex gap-3 p-3 border rounded-lg"
                            >
                              {h.change_type === "price" ? (
                                <div className="w-8 h-8 flex items-center justify-center rounded bg-muted">
                                  <DollarSign className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 flex items-center justify-center rounded bg-violet-300">
                                  <Tag className="w-4 h-4" />
                                </div>
                              )}

                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  {h.change_type === "price"
                                    ? `Price: $${h.old_price} → $${h.new_price}`
                                    : `Status: ${h.old_status} → ${h.new_status}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Changed by{" "}
                                  <span className="font-semibold text-foreground text-blue-600">
                                    {h.editor_full_name}
                                  </span>{" "}
                                  at{" "}
                                  {format(
                                    new Date(h.changed_at),
                                    "MMM dd, yyyy HH:mm"
                                  )}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">
                              No modifications recorded for this listing
                            </p>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={(page) => {
                setCurrentPage(page);
              }}
              onItemsPerPageChange={(v) => {
                setItemsPerPage(v);
                setCurrentPage(1);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminArchive;
