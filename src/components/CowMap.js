import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CowMarker from './CowMarker';
import '../styles/CowMap.css';

// Component to set the view of the map based on bounds with reduced padding
const SetViewOnBounds = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      // Adjust padding to zoom in more
      const padding = [100, 100]; // Reduced padding for a closer view
      map.fitBounds(bounds, { padding });
    }
  }, [bounds, map]);

  return null;
};

const CowMap = ({ cowData }) => {
  const [bounds, setBounds] = useState(null);

  useEffect(() => {
    if (cowData.length > 0) {
      const latitudes = cowData.map(cow => cow.latitude);
      const longitudes = cowData.map(cow => cow.longitude);
      const bounds = [
        [Math.min(...latitudes), Math.min(...longitudes)],
        [Math.max(...latitudes), Math.max(...longitudes)]
      ];
      setBounds(bounds);
    }
  }, [cowData]);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} className="cow-map"> {/* Increase the zoom level */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {cowData.map(cow => (
        <CowMarker key={cow.cowId} cow={cow} />
      ))}
      <SetViewOnBounds bounds={bounds} />
    </MapContainer>
  );
};

export default CowMap;
