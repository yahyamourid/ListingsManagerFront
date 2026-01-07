import React, { useState } from "react";
import { useListingsWithHistory } from "@/hooks/useListingsWithHistory";
import { FiltersBar } from "@/components/listings/FiltersBar";
import { Pagination } from "@/components/listings/Pagination";
import formatDate from "../../utils/formateDate";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, History, RefreshCw } from "lucide-react";

/* ---------------- CONSTANTS ---------------- */

const CHANGE_STYLE = {
  create: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "First Creation",
  },
  update: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    label: "Updated",
  },
  archive: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Archived",
  },
  restore: {
    bg: "bg-sky-100",
    text: "text-sky-700",
    label: "Restored",
  },
};

/* ---------------- COMPONENT ---------------- */

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

    sortDirection,
    setSortDirection,

    stats,
  } = useListingsWithHistory();

  const [expanded, setExpanded] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  return (
    /* MAIN WRAPPER — PREVENT PAGE HORIZONTAL SCROLL */
    <div className="w-full max-w-full overflow-x-hidden space-y-6">
      {/* ---------------- HEADER ---------------- */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Listings Archive</h1>
          <p className="text-muted-foreground">
            Listings with full history tracking
          </p>
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

      {/* ---------------- STATS ---------------- */}
      {stats && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
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

      {/* ---------------- FILTERS ---------------- */}
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
        isHistory
        sortDirection={sortDirection}
        handleSortDirection={handleSortDirection}
        isEditor={true}
      />

      {/* ---------------- CONTENT ---------------- */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <Card>
          <CardContent className="pt-4 space-y-4">
            {error && <p className="text-red-500">{error}</p>}

            {listings.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                No listings found
              </div>
            )}

            {listings.map((listing) => {
              const isExpanded = expanded[listing.id];
              const updateCount =
                listing.history?.filter((h) => h.change_type === "update")
                  .length || 0;

              return (
                <Card key={listing.id} className="border overflow-hidden">
                  {/* -------- LISTING HEADER -------- */}
                  <CardHeader
                    className="cursor-pointer hover:bg-muted/40 transition"
                    onClick={() => toggleExpand(listing.id)}
                  >
                    <div className="relative flex flex-col xl:flex-row gap-2 xl:justify-between xl:items-center">
                      <div>
                        <CardTitle className="text-base truncate">
                          {listing.address || "Unnamed listing"}
                        </CardTitle>

                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">
                            ${listing.current_price?.toLocaleString()}
                          </Badge>

                          <Badge
                            variant="outline"
                            className={
                              updateCount > 0
                                ? "border-amber-500 text-amber-500"
                                : "border-green-500 text-green-500"
                            }
                          >
                            {updateCount > 0
                              ? `${updateCount} updates`
                              : "No updates"}
                          </Badge>
                        </div>
                      </div>

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

                      <div className="absolute -top-3 -right-3">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {/* -------- HISTORY -------- */}
                  {isExpanded && (
                    <CardContent className="space-y-4">
                      {listing.history.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          No history available
                        </div>
                      ) : (
                        listing.history.map((h) => {
                          const style = CHANGE_STYLE[h.change_type];
                          const isCron = h.editor_full_name === "cron-job";

                          return (
                            <div
                              key={h.id}
                              className={`border rounded-xl p-4 space-y-3
                                ${
                                  isCron
                                    ? "border-accent/30 bg-yellow-50/40"
                                    : "border-violet-600/30 bg-violet-50/30"
                                }`}
                            >
                              {/* ---- HISTORY HEADER ---- */}
                              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <span
                                    className={`px-2 py-1 rounded text-xs font-semibold ${style.bg} ${style.text}`}
                                  >
                                    {style.label}
                                  </span>

                                  <span
                                    className={`text-xs font-bold uppercase ${
                                      isCron ? "text-accent" : "text-violet-600"
                                    }`}
                                  >
                                    By {h.editor_full_name}
                                  </span>
                                </div>

                                <span className="flex text-xs text-muted-foreground xl:items-end">
                                  {formatDate(h.changed_at)}
                                </span>
                              </div>

                              {/* ---- CREATE ---- */}
                              {h.change_type === "create" && (
                                <p className="text-sm text-muted-foreground italic">
                                  Listing created by {h.editor_full_name}
                                </p>
                              )}

                              {/* ---- UPDATE (ONLY THIS SCROLLS) ---- */}
                              {h.change_type === "update" &&
                                h.changes?.length > 0 && (
                                  <div className="w-full max-w-full overflow-hidden">
                                    <div
                                      className="
                                        flex gap-3
                                        overflow-x-auto
                                        max-w-full
                                        pb-2
                                        scrollbar-thin
                                        scrollbar-thumb-muted-foreground/30
                                      "
                                    >
                                      {h.changes.map((c, idx) => (
                                        <div
                                          key={idx}
                                          className="
                                            flex-shrink-0
                                            w-[220px]
                                            max-w-[220px]
                                            border
                                            rounded-lg
                                            p-3
                                            bg-muted/30
                                            overflow-hidden
                                          "
                                        >
                                          <p className="text-xs text-muted-foreground mb-1 truncate">
                                            {c.attribute}
                                          </p>

                                          <p className="text-sm font-medium break-words">
                                            <span className="line-through text-red-500 break-words">
                                              {String(c.old_value)}
                                            </span>
                                            <span className="mx-1">→</span>
                                            <span className="text-green-600 break-words">
                                              {String(c.new_value)}
                                            </span>
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                            </div>
                          );
                        })
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })}

            {/* ---------------- PAGINATION ---------------- */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
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
