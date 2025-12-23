import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Predefined listing websites
const LISTING_WEBSITES = [
  { value: "sunbeltbonaire", label: "Sunbelt Realty" },
  { value: "harbourtown", label: "Harbour Town" },
  { value: "kwbonaire", label: "KW Bonaire" },
  { value: "ncl_real_estate", label: "NCL Real Estate" },
  { value: "qvillas", label: "QVillas" },
  { value: "real_estate_guy", label: "Real Estate Guy" },
  { value: "remax_bonaire", label: "Remax Bonaire" },
  // add more anytime
];

const initialFormState = {
  page_title: "",
  date_first_listed: "",
  listing_link: "",
  latitude: "",
  longitude: "",
  address: "",
  area: "",
  initial_price: "",
  current_price: "",
  bedrooms: "",
  bathrooms: "",
  amenities: "",
  listing_website: "",
  building_footage: "",
  lot_footage: "",
  zoning_plan: "",
  zoning_description: "",
  sale_date: "",
  sale_price: "",
  image_listing: "",
  status: "",
  parcel_number: "",
};

export function ListingFormModal({
  isOpen,
  onClose,
  onSubmit,
  listing,
  isLoading,
}) {
  const [formData, setFormData] = useState(initialFormState);
  const isEditing = !!listing;

  useEffect(() => {
    if (listing) {
      setFormData({
        page_title: listing.page_title || "",
        date_first_listed: listing.date_first_listed || "",
        listing_link: listing.listing_link || "",
        latitude: listing.latitude || "",
        longitude: listing.longitude || "",
        address: listing.address || "",
        area: listing.area || "",
        initial_price: listing.initial_price || "",
        current_price: listing.current_price || "",
        bedrooms: listing.bedrooms || "",
        bathrooms: listing.bathrooms || "",
        amenities: listing.amenities ? listing.amenities.join(", ") : "",
        listing_website: listing.listing_website || "",
        building_footage: listing.building_footage || "",
        lot_footage: listing.lot_footage || "",
        zoning_plan: listing.zoning_plan || "",
        zoning_description: listing.zoning_description || "",
        sale_date: listing.sale_date || "",
        sale_price: listing.sale_price || "",
        image_listing: listing.image_listing || "",
        status: listing.status || "",
        parcel_number: listing.parcel_number || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [listing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      initial_price: formData.initial_price
        ? parseFloat(formData.initial_price)
        : null,
      current_price: formData.current_price
        ? parseFloat(formData.current_price)
        : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
      sale_price: formData.sale_price ? parseFloat(formData.sale_price) : null,
      amenities: formData.amenities
        ? formData.amenities
            .split(",")
            .map((a) => a.trim())
            .filter(Boolean)
        : [],
      date_first_listed: formData.date_first_listed || null,
      sale_date: formData.sale_date || null,
    };

    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-card rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold font-display text-foreground">
            {isEditing ? "Edit Listing" : "Add New Listing"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Page Title */}
            <div className="md:col-span-2">
              <Label htmlFor="page_title">Page Title</Label>
              <Input
                id="page_title"
                name="page_title"
                value={formData.page_title}
                onChange={handleChange}
                placeholder="Beautiful House in Miami"
                className="mt-1.5"
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State"
                className="mt-1.5"
              />
            </div>

            {/* Area */}
            <div>
              <Label htmlFor="area">Area</Label>
              <Input
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="Downtown"
                className="mt-1.5"
              />
            </div>

            {/* Listing Link */}
            <div>
              <Label htmlFor="listing_link">Listing Link</Label>
              <Input
                id="listing_link"
                name="listing_link"
                value={formData.listing_link}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>

            {/* Listing Website */}
            <div>
              <Label htmlFor="listing_website">Listing Website</Label>
              <Select
                value={formData.listing_website}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, listing_website: value }))
                }
              >
                <SelectTrigger className="bg-background mt-1.5">
                  <SelectValue placeholder="Select website" />
                </SelectTrigger>
                <SelectContent>
                  {LISTING_WEBSITES.map((site) => (
                    <SelectItem key={site.value} value={site.value}>
                      {site.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Latitude / Longitude */}
            <div>
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                name="latitude"
                type="number"
                step="any"
                value={formData.latitude}
                onChange={handleChange}
                placeholder="40.7128"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                name="longitude"
                type="number"
                step="any"
                value={formData.longitude}
                onChange={handleChange}
                placeholder="-74.0060"
                className="mt-1.5"
              />
            </div>

            {/* Initial Price / Current Price */}
            <div>
              <Label htmlFor="initial_price">Initial Price</Label>
              <Input
                id="initial_price"
                name="initial_price"
                type="number"
                min="0"
                value={formData.initial_price ?? ""}
                onChange={(e) => {
                  const value = e.target.value;

                  setFormData({
                    ...formData,
                    initial_price: value.startsWith("-") ? null : value,
                  });
                }}
                placeholder="500000"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="current_price">Current Price</Label>
              <Input
                id="current_price"
                name="current_price"
                type="number"
                min="0"
                value={formData.current_price ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    current_price: value.startsWith("-") ? null : value,
                  });
                }}
                placeholder="495000"
                className="mt-1.5"
              />
            </div>

            {/* Bedrooms / Bathrooms */}
            <div>
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                min="0"
                value={formData.bedrooms ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    bedrooms: value.startsWith("-") ? null : value,
                  });
                }}
                placeholder="3"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                min="0"
                step="0.5"
                value={formData.bathrooms ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    bathrooms: value.startsWith("-") ? null : value,
                  });
                }}
                placeholder="2.5"
                className="mt-1.5"
              />
            </div>

            {/* Building Footage / Lot Footage */}
            <div>
              <Label htmlFor="building_footage">Int Size</Label>
              <Input
                id="building_footage"
                name="building_footage"
                value={formData.building_footage}
                onChange={handleChange}
                placeholder="2000 sq ft"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="lot_footage">Lot Size</Label>
              <Input
                id="lot_footage"
                name="lot_footage"
                value={formData.lot_footage}
                onChange={handleChange}
                placeholder="5000 sq ft"
                className="mt-1.5"
              />
            </div>

            {/* Zoning */}
            <div>
              <Label htmlFor="zoning_plan">Zoning Plan</Label>
              <Input
                id="zoning_plan"
                name="zoning_plan"
                value={formData.zoning_plan}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="zoning_description">Zoning Description</Label>
              <Input
                id="zoning_description"
                name="zoning_description"
                value={formData.zoning_description}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>

            {/* Dates */}
            <div>
              <Label htmlFor="date_first_listed">Date First Listed</Label>
              <Input
                id="date_first_listed"
                name="date_first_listed"
                type="date"
                value={formData.date_first_listed}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="sale_date">Sale Date</Label>
              <Input
                id="sale_date"
                name="sale_date"
                type="date"
                value={formData.sale_date}
                onChange={handleChange}
                className="mt-1.5"
              />
            </div>

            {/* Sale Price */}
            <div>
              <Label htmlFor="sale_price">Sale Price</Label>
              <Input
                id="sale_price"
                name="sale_price"
                type="number"
                min="0"
                value={formData.sale_price ?? ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    sale_price: value.startsWith("-") ? null : value,
                  });
                }}
                placeholder="490000"
                className="mt-1.5"
              />
            </div>

            {/* Image */}
            <div>
              <Label htmlFor="image_listing">Image URL</Label>
              <Input
                id="image_listing"
                name="image_listing"
                value={formData.image_listing}
                onChange={handleChange}
                placeholder="https://..."
                className="mt-1.5"
              />
            </div>

            {/* Amenities */}
            <div className="md:col-span-2">
              <Label htmlFor="amenities">Amenities (comma separated)</Label>
              <Textarea
                id="amenities"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="Pool, Garage, Garden"
                className="mt-1.5"
                rows={2}
              />
            </div>
            {/* Parcel Number*/}
            <div>
              <Label htmlFor="parcel_number">Parcel Number</Label>
              <Input
                id="parcel_number"
                name="parcel_number"
                value={formData.parcel_number}
                onChange={handleChange}
                placeholder="9xxxxx0"
                className="mt-1.5"
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="bg-background mt-1.5">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="btn-gradient" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : isEditing
                ? "Update Listing"
                : "Create Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
