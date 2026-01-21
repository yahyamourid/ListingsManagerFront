import { GoogleMap, MarkerF, InfoWindowF } from "@react-google-maps/api";
import { useState } from "react";

export function MapView({
  latitude,
  longitude,
  address,
  mapContainerStyle = { width: "100%", height: "320px" }, // default size
  zoom = 15,
}) {
  const [markerPosition, setMarkerPosition] = useState(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [infoOpen, setInfoOpen] = useState(false);

  if (!latitude || !longitude) return null;

  const coordinates = { lat: latitude, lng: longitude };

  const mapOptions = {
    mapTypeId: "hybrid",
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
    streetViewControl: false,
    mapTypeControl: false,
  };

  return (
    <div className="z-10 w-full h-80 rounded-xl overflow-hidden border border-border mt-5">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={coordinates}
        zoom={zoom}
        onLoad={() => console.log("Map Loaded")}
        onUnmount={() => console.log("Map Unmounted")}
        options={mapOptions}
        onClick={() => setInfoOpen(false)}
      >
        {markerPosition && (
          <MarkerF
            position={markerPosition}
            draggable={true}
            onClick={() => setInfoOpen(!infoOpen)}
          >
            {infoOpen && (
              <InfoWindowF onCloseClick={() => setInfoOpen(false)}>
                <div>{address || "Property Location"}</div>
              </InfoWindowF>
            )}
          </MarkerF>
        )}
      </GoogleMap>
    </div>
  );
}
