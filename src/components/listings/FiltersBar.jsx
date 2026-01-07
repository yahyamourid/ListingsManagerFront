import React, { useState } from "react";
import { Search, SlidersHorizontal, X, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FiltersBar({
  searchTerm,
  onSearchChange,
  filters,
  onFiltersChange,
  showFilters,
  onToggleFilters,
  isHistory,
  sortDirection,
  handleSortDirection,
  isEditor = false,
}) {
  const [localSearch, setLocalSearch] = useState(searchTerm || "");

  const hasActiveFilters =
    filters.min_price ||
    filters.max_price ||
    filters.bedrooms ||
    filters.bathrooms ||
    filters.listing_website ||
    filters.status ||
    filters.history_type ||
    filters.updated_at ||
    filters.archive === true;

  const clearFilters = () => {
    onFiltersChange({
      min_price: "",
      max_price: "",
      bedrooms: "",
      bathrooms: "",
      listing_website: "",
      status: "",
      history_type: "",
      updated_at: "",
      archive: false,
    });
  };

  const applySearch = () => {
    onSearchChange(localSearch.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      applySearch();
    }
  };

  const LISTING_WEBSITES = [
    { value: "sunbelt_realty", label: "Sunbelt Realty" },
    { value: "harbourtown", label: "Harbour Town" },
    { value: "kwbonaire", label: "KW Bonaire" },
    { value: "ncl_real_estate", label: "NCL Real Estate" },
    { value: "qvillas", label: "QVillas" },
    { value: "real_estate_guy", label: "Real Estate Guy" },
    { value: "remax_bonaire", label: "Remax Bonaire" },
    { value: "caribbeanhome", label: "Caribbean Home" },
    // add more anytime
  ];
  return (
    <div className="space-y-4 w-full">
      {/* Search + Filters toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by address or area"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
        </div>

        <Button onClick={applySearch}>Search</Button>

        {isHistory && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSortDirection()}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="w-4 h-4" />
            {sortDirection === "asc" ? "Old Items" : "Recent Items"}
          </Button>
        )}

        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
              FILTERS ON
            </span>
          )}
        </Button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-card rounded-xl p-4 border border-border animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Filter Listings</h3>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              isHistory
                ? "lg:grid-cols-4"
                : isEditor
                ? "lg:grid-cols-7"
                : "lg:grid-cols-6"
            } gap-4`}
          >
            {/* Updated At Filter (only for history) */}
            {isHistory && (
              <div className="">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                    Updated Date
                  </label>
                  <Input
                    type="date"
                    value={filters.updated_at ?? ""}
                    onChange={(e) =>
                      onFiltersChange({
                        ...filters,
                        updated_at: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* IsModifies */}
            {isHistory && (
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Archive Type
                </label>
                <Select
                  value={filters.history_type}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      history_type: value === "any" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">All</SelectItem>
                    <SelectItem value="2">Modified Only</SelectItem>
                    <SelectItem value="1">Created Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Min Price */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Min Price
              </label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                value={filters.min_price ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  onFiltersChange({
                    ...filters,
                    min_price: value.startsWith("-") ? "" : value,
                  });
                }}
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Max Price
              </label>
              <Input
                type="number"
                placeholder="No limit"
                min="0"
                value={filters.max_price ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  onFiltersChange({
                    ...filters,
                    max_price: value.startsWith("-") ? "" : value,
                  });
                }}
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Min Bedrooms
              </label>
              <Select
                value={filters.bedrooms}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    bedrooms: value === "any" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Min Bathrooms
              </label>
              <Select
                value={filters.bathrooms}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    bathrooms: value === "any" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Listing Website */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Website
              </label>
              <Select
                value={filters.listing_website}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    listing_website: value === "any" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {LISTING_WEBSITES.map((site) => (
                    <SelectItem key={site.value} value={site.value}>
                      {site.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Status
              </label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  onFiltersChange({
                    ...filters,
                    status: value === "any" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="for sale">FOR SALE</SelectItem>
                  <SelectItem value="pending">PENDING</SelectItem>
                  <SelectItem value="sold">SOLD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Archived toggle */}
            {isEditor && (
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Archive
                </label>
                <div className="flex items-center mx-auto rounded-lg border border-border bg-background px-3 py-2">
                  <Switch
                    checked={Boolean(filters.archive)}
                    disabled={!isEditor}
                    onCheckedChange={(checked) =>
                      isEditor &&
                      onFiltersChange({
                        ...filters,
                        archive: checked,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
