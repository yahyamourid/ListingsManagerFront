import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ListingCardSkeleton() {
    return (
        <div className="bg-card rounded-xl border border-border overflow-hidden h-full shadow">
            {/* Image Skeleton */}
            <div className="h-48 w-full bg-muted animate-pulse relative">
                <div className="absolute top-3 right-3 h-8 w-8 rounded-md bg-muted-foreground/10" />
            </div>

            {/* Content Skeleton */}
            <div className="p-5 space-y-4">
                {/* Price and Action */}
                <div className="flex justify-between items-start">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>

                {/* Address */}
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>

                {/* Details (Beds/Baths) */}
                <div className="flex gap-4 pt-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-2 pt-4 mt-4 border-t border-border">
                    <Skeleton className="h-9 flex-1" />
                    <Skeleton className="h-9 flex-1" />
                </div>
            </div>
        </div>
    );
}
