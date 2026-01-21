import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const googleMapsLibraries = ['drawing', 'places'];

const MapsLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin" />
  </div>
);

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={googleMapsLibraries}
      loadingElement={<MapsLoading />}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
