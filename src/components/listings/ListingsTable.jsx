import React, { useEffect, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ExternalLink,
  Pencil,
  Trash2,
  Heart,
  History,
  Archive,
  ArchiveRestore,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import formatDate from "@/utils/formateDate";

const formatCurrency = (value) => {
  // if (!value) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const columns = [
  { key: "updated_at", label: "Last Update", width: "w-2/12", sortable: true },
  { key: "address", label: "Address", width: "w-1/6" },
  { key: "current_price", label: "Price", width: "w-1/12", sortable: true },
  { key: "bedrooms", label: "Beds", width: "w-1/12" },
  { key: "bathrooms", label: "Baths", width: "w-1/12" },
  { key: "building_footage", label: "Int Size", width: "w-1/12" },
  { key: "area", label: "Area", width: "w-1/12" },
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
  onArchive,
  onToggleFavorite,
  onListingChanges,
}) {
  const [localListings, setLocalListings] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [hasSynced, setHasSynced] = useState(false);

  useEffect(() => {
    setLocalListings(listings);
    setHasSynced(true);
  }, [listings]);

  const handleRowClick = (listing, e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    e.stopPropagation();
    window.open(`/details/${listing.id}`, "_blank");
  };

  const handleFavoriteClick = async (listing, e) => {
    e.stopPropagation();

    setCurrentId(listing.id);

    setLocalListings((prev) =>
      prev.map((item) =>
        item.id === listing.id
          ? { ...item, is_favorite: !item.is_favorite }
          : item
      )
    );

    try {
      await onToggleFavorite(listing);
    } catch {
      setLocalListings((prev) =>
        prev.map((item) =>
          item.id === listing.id
            ? { ...item, is_favorite: listing.is_favorite }
            : item
        )
      );
    } finally {
      setCurrentId(null);
    }
  };

  const heartAnimation = (id) =>
    !isEditor && id === currentId
      ? "animate-pulse scale-110"
      : "transition-transform duration-200 hover:scale-110";

  return (
    <div className="bg-card rounded-xl shadow-[var(--shadow-card)] overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="table-header border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-4 text-left ${col.width} ${
                    col.sortable
                      ? "cursor-pointer hover:bg-muted/80"
                      : "cursor-default"
                  }`}
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
              <th className="px-4 py-4 w-24">Link</th>
              {(isEditor || onToggleFavorite) && (
                <th className="px-4 py-4 w-24">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {localListings.map((listing, index) => (
              <tr
                key={listing.id}
                className="border-b border-border/50 hover:bg-muted/30 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
                onClick={(e) => handleRowClick(listing, e)}
              >
                <td className="px-4 py-4 text-sm">
                  {formatDate(listing.updated_at)}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="truncate max-w-[250px]">
                      {listing.address || "-"}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 font-semibold">
                  {formatCurrency(listing.current_price)}
                </td>

                <td className="px-4 py-4">{listing.bedrooms}</td>
                <td className="px-4 py-4">{listing.bathrooms}</td>
                <td className="px-4 py-4">{listing.building_footage || "-"}</td>
                <td className="px-4 py-4">{listing.area || "-"}</td>
                <td className="px-4 py-4">{listing.listing_website || "-"}</td>

                <td className="px-4 py-4">
                  {listing.listing_link && (
                    <a
                      href={listing.listing_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent"
                    >
                      View <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </td>

                {(isEditor || onToggleFavorite) && (
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {/*Show Changes button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          onListingChanges(listing);
                        }}
                      >
                        <History className="w-4 h-4" />
                      </Button>
                      {onToggleFavorite && (
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={!isEditor && currentId === listing.id}
                          className={`h-8 w-8 ${
                            listing.is_favorite
                              ? "text-red-500"
                              : "hover:text-red-500"
                          }`}
                          onClick={(e) => handleFavoriteClick(listing, e)}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              listing.is_favorite ? "fill-current" : ""
                            } ${heartAnimation(listing.id)}`}
                          />
                        </Button>
                      )}

                      {isEditor && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(listing);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(listing);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button> */}

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchive(listing);
                            }}
                          >
                            {listing.is_archived ? (
                              <ArchiveRestore className="w-4 h-4" />
                            ) : (
                              <Archive className="w-4 h-4" />
                            )}
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

      {hasSynced && localListings.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No listings found
        </div>
      )}
    </div>
  );
}
