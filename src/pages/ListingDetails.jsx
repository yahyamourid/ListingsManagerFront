import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Square,
  ExternalLink,
  Building,
  Plus,
  Pen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { listingsApi } from "@/services/api";
import { MapView } from "@/components/listings/MapView";
import { useAuth } from "@/contexts/AuthContext";
import { ListingFormModal } from "@/components/listings/ListingFormModal";
import { useToast } from '@/hooks/use-toast';
/* ===================== HELPERS ===================== */

const formatCurrency = (value) => {
  if (value === null || value === undefined) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

/* ===================== STATUS BADGE ===================== */

function StatusBadge({ status }) {
  if (!status) return null;

  const styles = {
    active: "bg-green-100 text-green-700 border-green-300",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
    sold: "bg-red-100 text-red-700 border-red-300",
  };

  const cls =
    styles[status.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-semibold border ${cls}`}
    >
      {status.toUpperCase()}
    </span>
  );
}

/* ===================== SELECTED ATTRIBUTES GRID ===================== */

function SelectedAttributesGrid({ listing }) {
  const Item = ({ label, value, isLink }) => {
    if (!value) return null;

    return (
      <div className="p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </p>

        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium hover:underline"
          >
            View {label}
          </a>
        ) : (
          <p className="text-foreground font-medium break-words">{value}</p>
        )}
      </div>
    );
  };

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      <Item
        label="Initial Price"
        value={listing.initial_price && formatCurrency(listing.initial_price)}
      />

      <Item
        label="Sale Price"
        value={listing.sale_price && formatCurrency(listing.sale_price)}
      />

      <Item label="Listing Website" value={listing.listing_website} />

      <Item label="Building Footage" value={listing.building_footage} />

      <Item label="Lot Footage" value={listing.lot_footage} />

      {/* Zoning Plan */}
      <Item label="Zoning Plan" value={listing.zoning_plan} isLink />

      {/* Zoning Description */}
      <Item
        label="Zoning Description"
        value={listing.zoning_description}
        isLink
      />
    </div>
  );
}

/* ===================== MAIN COMPONENT ===================== */

export default function ListingDetails() {
  const { toast } = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isEditor, isAdmin, isSubscriber } = useAuth();

  const fetchListing = async () => {
    try {
      setLoading(true);
      const data = await listingsApi.getListing(id);
      setListing(data);
    } catch {
      setError("Listing not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  const handleOpenModal = () => {
    setModalOpen(!isModalOpen);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await listingsApi.updateListing(listing.id, data);
      toast({
        title: "Success",
        description: "Listing updated successfully",
      });
      setModalOpen(false);
      fetchListing();
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-accent rounded-full" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listings
        </Button>
      </div>
    );
  }

  const priceChange =
    listing.initial_price && listing.current_price
      ? (
          ((listing.current_price - listing.initial_price) /
            listing.initial_price) *
          100
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-screen bg-background">
      {/* ===================== HEADER ===================== */}
      <header className="sticky flex justify-between items-center px-5 top-0 z-10 bg-card border-b">
        <div className="px-6 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <h1 className="text-lg font-semibold">Listing Details</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                ID: #{listing.id}
              </span>
              <StatusBadge status={listing.status} />
            </div>
          </div>
        </div>
        {/* Editor/Admin Actions */}
        {(isEditor || isAdmin) && (
          <div>
            <Button onClick={handleOpenModal} className="btn-gradient">
              <Pen className="w-4 h-4 mr-2" />
              Edit Listing
            </Button>
          </div>
        )}
      </header>

      {/* ===================== CONTENT ===================== */}
      <main className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-2 gap-8">
        {/* ===================== DETAILS ===================== */}
        <div className="space-y-6">
          <p className="text-4xl font-bold">{listing.page_title}</p>

          {/* PRICE */}
          <div>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-bold">
                {formatCurrency(listing.current_price)}
              </h2>

              {priceChange && priceChange !== "0.0" && (
                <span
                  className={`text-sm font-medium ${
                    priceChange < 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {priceChange > 0 ? "+" : ""}
                  {priceChange}%
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="w-5 h-5" />
              <span>{listing.address || "Address not available"}</span>
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="flex gap-6 p-4 bg-card border rounded-xl">
            {listing.bedrooms !== null && (
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-accent" />
                <strong>{listing.bedrooms}</strong> beds
              </div>
            )}
            {listing.bathrooms !== null && (
              <div className="flex items-center gap-2">
                <Bath className="w-5 h-5 text-accent" />
                <strong>{listing.bathrooms}</strong> baths
              </div>
            )}
            {listing.lot_footage && (
              <div className="flex items-center gap-2">
                <Square className="w-5 h-5 text-accent" />
                <strong>{listing.lot_footage}</strong>
              </div>
            )}
          </div>

          {/* SELECTED ATTRIBUTES */}
          <SelectedAttributesGrid listing={listing} />

          {/* AMENITIES */}
          {listing.amenities?.length > 0 && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground uppercase mb-2">
                Amenities
              </p>
              <div className="flex flex-wrap gap-2">
                {listing.amenities.map((a, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-accent text-white rounded-full text-sm"
                  >
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-7 ">
          {/* ===================== IMAGE ===================== */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
              {listing.image_listing ? (
                <img
                  src={listing.image_listing}
                  alt="Property"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building className="w-16 h-16 text-muted-foreground" />
                </div>
              )}

              {listing.status === "sold" && (
                <span className="absolute top-4 left-4 px-4 py-2 bg-red-600 text-white rounded-full text-sm font-semibold">
                  SOLD
                </span>
              )}
            </div>

            {listing.listing_link && (
              <a
                href={listing.listing_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90"
              >
                View Original Listing <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          {listing.latitude && listing.longitude && (
            <MapView
              latitude={Number(listing.latitude)}
              longitude={Number(listing.longitude)}
              address={listing.address}
            />
          )}
        </div>
      </main>
      {/* Modals */}
      <ListingFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen()
        }}
        onSubmit={handleFormSubmit}
        listing={listing}
        isLoading={isSubmitting}
      />
    </div>
  );
}
