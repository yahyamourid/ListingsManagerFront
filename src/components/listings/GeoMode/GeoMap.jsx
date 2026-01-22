import React, { useCallback, useRef, useState, useEffect } from 'react';
import { GoogleMap, InfoWindowF, MarkerF } from '@react-google-maps/api';
import { GeoListingCard } from './GeoListingCard';

const mapContainerStyle = {
    height: "100%",
    width: "100%",
};

const DEFAULT_CENTER = { lat: 12.155256231290371, lng: -68.26788999190961 };

const mapOptions = {
    mapTypeId: 'hybrid',
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    minZoom: 1,
    maxZoom: 18,
    styles: [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
        },
    ],
};

export const GeoMap = ({ listings, onBoundsChanged, hoveredListingId, onMarkerHover, setMapReady }) => {
    const mapRef = useRef(null);

    // Interaction state
    const [activeMarkerId, setActiveMarkerId] = useState(null); 

    const onLoad = useCallback((map) => {
        mapRef.current = map;
        if (setMapReady) setMapReady(true);
    }, [setMapReady]);

    const onUnmount = useCallback(() => {
        mapRef.current = null;
        if (setMapReady) setMapReady(false);
    }, [setMapReady]);

    const handleIdle = () => {
        if (!mapRef.current) return;
        const bounds = mapRef.current.getBounds();
        if (!bounds) return;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const p1 = `${ne.lat()},${ne.lng()}`;
        const p2 = `${sw.lat()},${ne.lng()}`;
        const p3 = `${sw.lat()},${sw.lng()}`;
        const p4 = `${ne.lat()},${sw.lng()}`;

        const polygonString = `${p1};${p2};${p3};${p4}`;

        // Defer slighty if needed, but onIdle is already debounced by GMaps
        onBoundsChanged(polygonString);
    };

    const onMapClick = () => {
        setActiveMarkerId(null);
    };

    return (
        <div className="h-full w-full bg-muted/20 overflow-hidden relative">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={DEFAULT_CENTER}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onIdle={handleIdle}
                onClick={onMapClick}
                options={mapOptions}
            >
                {listings.map((listing) => {
                    if (!listing.latitude || !listing.longitude) return null;

                    const position = {
                        lat: parseFloat(listing.latitude),
                        lng: parseFloat(listing.longitude),
                    };

                    const isHovered = hoveredListingId === listing.id;
                    const isSelected = activeMarkerId === listing.id;

                    const shouldShowCard = isSelected || isHovered;

                    const icon = {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: isSelected || isHovered ? "#F5A30A" : "#ef4444",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#ffffff",
                        scale: (isSelected || isHovered) ? 10 : 7,
                    };

                    return (
                        <MarkerF
                            key={listing.id}
                            position={position}
                            icon={icon}
                            zIndex={(isSelected || isHovered) ? 1000 : 1}
                            onMouseOver={() => {
                                onMarkerHover(listing.id);
                            }}
                            onMouseOut={() => {
                                onMarkerHover(null);
                            }}
                            onClick={(e) => {
                                e.stop(); // Prevent map click
                                setActiveMarkerId(listing.id);
                            }}
                        >
                            {shouldShowCard && (
                                <InfoWindowF
                                    position={position}
                                    onCloseClick={() => {
                                        if (isSelected) setActiveMarkerId(null);
                                        // If hovered, dragging mouse out will clear it via onMouseOut
                                    }}
                                    options={{
                                        disableAutoPan: true, 
                                        pixelOffset: new window.google.maps.Size(0, -10),
                                        maxWidth: 440, 
                                        headerDisabled: true
                                        
                                        
                                    }}
                                >
                                    <div
                                        onMouseEnter={() => onMarkerHover(listing.id)}
                                        onMouseLeave={() => onMarkerHover(null)}
                                    >
                                        <GeoListingCard listing={listing} />
                                    </div>
                                </InfoWindowF>
                            )}
                        </MarkerF>
                    );
                })}
            </GoogleMap>
        </div>
    );
};
