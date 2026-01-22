import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  Square,
  ExternalLink,
  Pencil,
  Trash2,
  Heart,
  MapPinHouse,
  History,
  ShoppingCart,
  Calendar,
  ArchiveRestore,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const formatCurrency = (value) => {
  // if (!value) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

export function SoldListingCard({ listing, onListingChanges }) {
  const priceChange =
    listing.initial_price && listing.current_price
      ? (
          ((listing.current_price - listing.initial_price) /
            listing.initial_price) *
          100
        ).toFixed(1)
      : null;

  const handleCardClick = (e) => {
    // Don't navigate if clicking on action buttons or links
    if (e.target.closest("button") || e.target.closest("a")) return;
    e.stopPropagation();
    window.open(`/details/${listing.id}`, "_blank");
  };

  return (
    <div className="listing-card cursor-pointer border shadow-md" onClick={handleCardClick}>
      <div className="relative h-48 bg-muted">
        {listing.image_listing ? (
          <img
            src={listing.image_listing}
            alt={listing.address || "Property"}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Square className="w-12 h-12" />
          </div>
        )}

        {/* <div className="absolute top-6 -left-9 -rotate-45 overflow-hidden">
          <span
            className="px-12 py-2 text-xs bg-red-600 font-semibold rounded-full text-white uppercase"
          >
            {listing.status}
          </span>
        </div> */}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <ShoppingCart className="w-4 h-4" />
                <span>Sale price: </span>
              </div>
              <p className="text-2xl font-bold font-display text-cyan-600">
                {listing.sale_price !== 0
                  ? formatCurrency(listing.sale_price)
                  : "-"}
              </p>
            </div>
            {/* {priceChange && priceChange !== "0.0" && (
              <p
                className={`text-xs font-medium ${
                  Number(priceChange) < 0 ? "text-success" : "text-destructive"
                }`}
              >
                {Number(priceChange) > 0 ? "+" : ""}
                {priceChange}% from initial
              </p>
            )} */}
          </div>

          <div className="flex items-center gap-2">
            {listing.listing_link && (
              <a
                href={listing.listing_link}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
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
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <p className="text-sm truncate">
            {listing.address || "Address not available"}
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {listing.bedrooms !== null && (
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4" />
              <span>{listing.bedrooms} beds</span>
            </div>
          )}
          {listing.bathrooms !== null && (
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{listing.bathrooms} baths</span>
            </div>
          )}
          {listing.area && (
            <div className="flex items-center gap-1.5">
              <MapPinHouse className="w-4 h-4" />
              <span>{listing.area}</span>
            </div>
          )}
        </div>

        {listing.sale_date && (
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <p className="text-sm truncate">
              Sale date: {listing.sale_date || "Date not available"}
            </p>
          </div>
        )}
        {listing.listing_website && (
          <p className="text-xs text-muted-foreground mb-4">
            Source: {listing.listing_website}
          </p>
        )}
      </div>
    </div>
  );
}
