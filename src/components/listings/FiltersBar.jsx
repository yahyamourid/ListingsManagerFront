import React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
}) {
  const hasActiveFilters =
    filters.min_price ||
    filters.max_price ||
    filters.bedrooms ||
    filters.bathrooms ||
    filters.listing_website ||
    filters.status ||
    filters.is_modified;

  const clearFilters = () => {
    onFiltersChange({
      min_price: "",
      max_price: "",
      bedrooms: "",
      bathrooms: "",
      listing_website: "",
      status: "",
      is_modified: "",
    });
  };
  const LISTING_WEBSITES = [
    { value: "sunbeltbonaire", label: "Sunbelt Reality" },
    { value: "kwbonaire", label: "KW Bonaire" },
    { value: "qvillas", label: "QVillas" },
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
            placeholder="Search by address, source, or zoning..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={onToggleFilters}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-accent text-accent-foreground text-xs rounded-full">
              Active
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
            {/* Min Price */}
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                Min Price
              </label>
              <Input
                type="number"
                placeholder="0"
                value={filters.min_price}
                onChange={(e) =>
                  onFiltersChange({ ...filters, min_price: e.target.value })
                }
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
                value={filters.max_price}
                onChange={(e) =>
                  onFiltersChange({ ...filters, max_price: e.target.value })
                }
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
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* IsModifies */}
            {isHistory && (
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1.5 block">
                  Modification
                </label>
                <Select
                  value={filters.is_modified}
                  onValueChange={(value) =>
                    onFiltersChange({
                      ...filters,
                      is_modified: value === "any" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="All Listings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">All Listings</SelectItem>
                    <SelectItem value="true">Modified Only</SelectItem>
                    <SelectItem value="false">Unchanged Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
