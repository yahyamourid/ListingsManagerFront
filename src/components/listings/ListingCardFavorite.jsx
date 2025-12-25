import React from "react";
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
  MapPinHouse
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

export function ListingCardFavorite({
  listing,
  onDelete,
}) {
  const navigate = useNavigate();

  const priceChange =
    listing.initial_price && listing.current_price
      ? (
          ((listing.current_price - listing.initial_price) /
            listing.initial_price) *
          100
        ).toFixed(1)
      : null;

  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest("a")) return;
    e.stopPropagation();
    window.open(`/details/${listing.id}`, "_blank");
  };

  return (
    <div className="listing-card cursor-pointer border " onClick={handleCardClick}>
      <div className="relative h-35 bg-muted">
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

        <div className="absolute top-6 -left-9 -rotate-45 overflow-hidden">
          <span
            className={`px-14 py-2 text-xs font-semibold rounded-full text-white uppercase ${
              listing.status === "for sale" && "bg-green-600"
            } ${
              listing.status === "pending" && "bg-yellow-600"
            } ${listing.status === "sold" && "bg-red-600 "}
            `}
          >
            {listing.status}
          </span>
        </div>

        <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-card/90 backdrop-blur-sm text-destructive"
              onClick={() => onDelete(listing.id)}
            >
              <Heart
                className="w-4 h-4 fill-current text-red-500"
              />
            </Button>
          {listing.zoning && (
            <span className="px-3 py-1 bg-card/90 backdrop-blur-sm text-foreground text-xs font-medium rounded-full">
              {listing.zoning}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-2xl font-bold font-display text-foreground">
              {formatCurrency(listing.current_price)}
            </p>
            {priceChange && priceChange !== "0.0" && (
              <p
                className={`text-xs font-medium ${
                  Number(priceChange) < 0 ? "text-success" : "text-destructive"
                }`}
              >
                {Number(priceChange) > 0 ? "+" : ""}
                {priceChange}% from initial
              </p>
            )}
          </div>

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

        {listing.listing_website && (
          <p className="text-xs text-muted-foreground mb-4">
            Source: {listing.listing_website}
          </p>
        )}
      </div>
    </div>
  );
}
