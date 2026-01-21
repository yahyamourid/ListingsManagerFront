import React, { useEffect, useState, useRef } from "react";
import { X, Copy, RefreshCcw, Trash2, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { cn } from "@/lib/utils";

const DEFAULT_CENTER = { lat: 12.155256231290371, lng: -68.26788999190961 };

const mapContainerStyle = {
  height: "100%",
  width: "100%",
};

const mapOptions = {
  mapTypeId: 'hybrid',
  disableDefaultUI: true,
  zoomControl: true,
  clickableIcons: false,
  streetViewControl: false,
  mapTypeControl: false,
}

export function CoordinatesMapModal({ isOpen, onClose, listing, onSave }) {
  const [coordinates, setCoordinates] = useState(DEFAULT_CENTER);
  const [hasCoordinates, setHasCoordinates] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    if (isOpen && listing) {
      if (listing.latitude && listing.longitude) {
        setCoordinates({
          lat: parseFloat(listing.latitude),
          lng: parseFloat(listing.longitude),
        });
        setHasCoordinates(true);
      } else {
        setCoordinates(DEFAULT_CENTER);
        setHasCoordinates(false);
      }
      setIsModified(false);
    }
  }, [isOpen, listing]);

  // Adjust map center when coordinates change
  useEffect(() => {
    if (mapRef.current && hasCoordinates) {
      mapRef.current.panTo(coordinates);
    }
  }, [coordinates, hasCoordinates]);


  const handleMapClick = (e) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCoordinates({ lat, lng });
      setHasCoordinates(true);
      setIsModified(true);
      mapRef.current?.setZoom(18);
    }
  };

  const handleMarkerDragEnd = (e) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setCoordinates({ lat, lng });
      setIsModified(true);
    }
  }

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setCoordinates((prev) => ({
      ...prev,
      [field]: parseFloat(value),
    }));
    setIsModified(true);
  };

  const handlePasteCallback = async () => {
    try {
      const text = await navigator.clipboard.readText();
      // Try to parse "lat, lng"
      const parts = text.split(/,\s*/);
      if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng)) {
          setCoordinates({ lat, lng });
          setHasCoordinates(true);
          setIsModified(true);
          mapRef.current?.setZoom(18);
        }
      }
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };

  const handleClear = () => {
    setCoordinates(DEFAULT_CENTER);
    setHasCoordinates(false);
    setIsModified(true);
    mapRef.current?.setZoom(14);
  };

  const handleReset = () => {
    if (listing?.latitude && listing?.longitude) {
      setCoordinates({
        lat: parseFloat(listing.latitude),
        lng: parseFloat(listing.longitude),
      });
      setHasCoordinates(true);
    } else {
      setCoordinates(DEFAULT_CENTER);
      setHasCoordinates(false);
    }
    setIsModified(false);
    mapRef.current?.setZoom(14);
  };

  const handleSave = () => {
    if (hasCoordinates) {
      onSave(listing, { latitude: coordinates.lat, longitude: coordinates.lng });
    } else {
      onSave(listing, { latitude: null, longitude: null });
    }
    onClose();
  };

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onUnmount = () => {
    mapRef.current = null;
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    if (isFullScreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFullScreen]);

  const renderInputs = () => (
    <div className="flex flex-col xl:flex-row gap-4 items-end xl:justify-between w-full pb-4">
      <div className="flex flex-col xl:flex-row w-full gap-2 xl:gap-6">
        <div className="grid gap-1.5 flex-1">
          <Label htmlFor="latitude" className={isFullScreen ? "text-foreground" : ""}>Latitude</Label>
          <Input
            id="latitude"
            type="number"
            value={hasCoordinates ? coordinates.lat : ""}
            onChange={(e) => handleInputChange(e, "lat")}
            placeholder="Latitude"
            className={isFullScreen ? "bg-background/80" : ""}
          />
        </div>
        <div className="grid gap-1.5 flex-1">
          <Label htmlFor="longitude" className={isFullScreen ? "text-foreground" : ""}>Longitude</Label>
          <Input
            id="longitude"
            type="number"
            value={hasCoordinates ? coordinates.lng : ""}
            onChange={(e) => handleInputChange(e, 'lng')}
            placeholder="Longitude"
            className={isFullScreen ? "bg-background/80" : ""}
          />
        </div>
      </div>
      <div className="flex gap-2 justify-center w-full xl:w-auto">
        <Button variant="outline" type="button" onClick={handleReset} disabled={!isModified} className={isFullScreen ? "bg-background/80" : ""}>
          <RefreshCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
        <Button variant="destructive" type="button" onClick={handleClear} disabled={!hasCoordinates} className={isFullScreen ? "opacity-90 hover:opacity-100" : ""}>
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative bg-card rounded-2xl shadow-xl overflow-hidden animate-scale-in flex flex-col transition-all duration-300",
          isFullScreen
            ? "fixed inset-0 w-full h-full rounded-none z-[60]"
            : "w-full max-w-5xl h-[90vh] px-8 py-2"
        )}
      >
        {!isFullScreen && (
          <div className="flex items-center justify-between py-2">
            <h2 className="text-xl font-bold font-display text-foreground">
              Edit Coordinates - {listing?.address}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Inputs - Render here only if NOT full screen */}
        {!isFullScreen && renderInputs()}

        <div className={cn("relative ", isFullScreen ? "h-full w-full" : "flex-1 min-h-0 bg-muted/20 rounded-xl overflow-hidden")}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={coordinates}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            onClick={handleMapClick}
            options={mapOptions}
          >
            {hasCoordinates && (
              <MarkerF
                position={coordinates}
                draggable={true}
                onDragEnd={handleMarkerDragEnd}
              />
            )}

            {/* Scale/Full Screen Toggle Button */}
            <div className="absolute top-4 right-4 z-[50]">
              <Button
                variant="secondary"
                size="icon"
                className="shadow-md bg-background/90 hover:bg-background"
                onClick={toggleFullScreen}
                title={isFullScreen ? "Exit Full Screen" : "Full Screen"}
              >
                {isFullScreen ? (
                  <Minimize2 className="h-5 w-5" />
                ) : (
                  <Maximize2 className="h-5 w-5" />
                )}
              </Button>
              {/* Close button in full screen */}
              {/* {isFullScreen && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="shadow-md bg-background/90 hover:bg-background ml-2"
                  onClick={() => {
                    setIsFullScreen(false);
                    onClose();
                  }}
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </Button>
              )} */}
            </div>

            {/* Absolute Input Card - Render here ONLY if full screen */}
            {isFullScreen && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-[50] animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-background/95 backdrop-blur-md border border-border/50 shadow-2xl rounded-xl p-3">
                  {renderInputs()}
                </div>
              </div>
            )}
          </GoogleMap>
        </div>

        {/* Footer Buttons - Render here only if NOT full screen */}
        {!isFullScreen && (
          <div className="p-4 flex justify-center items-center gap-4">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>
    </div>
  );
}
