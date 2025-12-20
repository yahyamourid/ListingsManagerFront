import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Pencil,
  Trash2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const formatCurrency = (value) => {
  if (!value) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const columns = [
  { key: "id", label: "ID", width: "w-1/12", sortable: true },
  { key: "address", label: "Address", width: "w-1/12" },
  { key: "current_price", label: "Price", width: "w-1/12", sortable: true },
  { key: "bedrooms", label: "Beds", width: "w-1/12" },
  { key: "bathrooms", label: "Baths", width: "w-1/12" },
  { key: "building_footage", label: "Buil Ft", width: "w-1/6" },
  { key: "lot_footage", label: "Lot Ft", width: "w-1/6" },
  { key: "listing_website", label: "Source", width: "w-1/12" },
];

function SortIcon({ field, sortField, sortDirection }) {
  if (field !== sortField) {
    return <ChevronUp className="w-4 h-4 text-muted-foreground/30" />;
  }
  return sortDirection === "asc" ? (
    <ChevronUp className="w-4 h-4 text-accent" />
  ) : (
    <ChevronDown className="w-4 h-4 text-accent" />
  );
}

export function ListingsTable({
  listings,
  sortField,
  sortDirection,
  onSort,
  isEditor,
  onEdit,
  onDelete,
  onToggleFavorite,
  isFavorite,
}) {
  const navigate = useNavigate();

  const handleRowClick = (listing, e) => {
    // Don't navigate if clicking on action buttons or links
    if (e.target.closest("button") || e.target.closest("a")) return;
    navigate(`/details/${listing.id}`);
  };

  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header border-b border-border w-full ">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-4 text-left ${col.width} w-full${col.sortable ? "cursor-pointer hover:bg-muted/80" : "cursor-default"}`}
                  onClick={col.sortable ? () => onSort(col.key) : undefined}
                >
                  <div className="flex items-center gap-2">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <SortIcon
                        field={col.key}
                        sortField={sortField}
                        sortDirection={sortDirection}
                      />
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-4 text-left w-24">Link</th>
              {(isEditor || onToggleFavorite) && (
                <th className="px-4 py-4 text-left w-24">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {listings.map((listing, index) => (
              <tr
                key={listing.id}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-fade-in cursor-pointer"
                style={{ animationDelay: `${index * 30}ms` }}
                onClick={(e) => handleRowClick(listing, e)}
              >
                <td className="px-4 py-4 text-sm font-medium text-foreground">
                  #{listing.id}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    {listing.image_listing && (
                      <img
                        src={listing.image_listing}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <span className="text-sm text-foreground truncate max-w-[180px]">
                      {listing.address || "-"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-foreground">
                  {formatCurrency(listing.current_price)}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {listing.bedrooms || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {listing.bathrooms || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {listing.building_footage || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {listing.lot_footage || "-"}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {listing.listing_website || "-"}
                </td>
                <td className="px-4 py-4">
                  {listing.listing_link && (
                    <a
                      href={listing.listing_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent hover:text-accent/80 transition-colors text-sm"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </td>
                {(isEditor || onToggleFavorite) && (
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {onToggleFavorite && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            isFavorite(listing.id)
                              ? "text-destructive"
                              : "hover:text-destructive"
                          }`}
                          onClick={() => onToggleFavorite(listing.id)}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              isFavorite(listing.id) ? "fill-current" : ""
                            }`}
                          />
                        </Button>
                      )}
                      {isEditor && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-accent/10 hover:text-accent"
                            onClick={() => onEdit(listing)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => onDelete(listing)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {listings.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No listings found
        </div>
      )}
    </div>
  );
}
