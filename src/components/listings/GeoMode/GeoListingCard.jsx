import React from "react";
import { BedDouble, Bath, MapPinHouse, ExternalLink } from "lucide-react";

export const GeoListingCard = ({ listing }) => {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <div className="flex items-center bg-card rounded-lg overflow-hidden shadow-sm py-1">
            {/* Image Section - Left */}
            <div className="w-[100px] h-full flex-shrink-0">
                {listing.image_listing ? (
                    <img
                        src={listing.image_listing}
                        alt={listing.address || "Property"}
                        className="w-full h-full rounded-xl"
                    />
                ) : (
                    <div className="w-full h-full flex items-center bg-muted justify-center text-muted-foreground text-xs">
                        No Image
                    </div>
                )}
            </div>

            {/* Content Section - Right */}
            <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm truncate mr-2" title={listing.address}>
                            {listing.address || "Unknown Address"}
                        </h3>
                        {listing.listing_link && (
                            <a
                                href={`/details/${listing.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:text-primary/80"
                            >
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        )}
                    </div>
                    <p className="text-lg font-bold font-display text-primary leading-tight">
                        {formatCurrency(listing.current_price)}
                    </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    {listing.bedrooms !== null && (
                        <div className="flex items-center gap-1" title="Bedrooms">
                            <BedDouble className="w-3 h-3" />
                            <span>{listing.bedrooms}</span>
                        </div>
                    )}
                    {listing.bathrooms !== null && (
                        <div className="flex items-center gap-1" title="Bathrooms">
                            <Bath className="w-3 h-3" />
                            <span>{listing.bathrooms}</span>
                        </div>
                    )}
                    {listing.area && (
                        <div className="flex items-center gap-1 truncate" title="Lot Size">
                            <MapPinHouse className="w-3 h-3" />
                            <span className="truncate max-w-[60px]">{listing.area}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
