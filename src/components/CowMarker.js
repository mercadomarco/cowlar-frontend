import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Define default icon for markers
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const CowMarker = ({ cow }) => {
  return (
    <Marker
      position={[cow.latitude, cow.longitude]}
      icon={defaultIcon}
    >
      <Popup>
        <div>
          <p>ID: {cow.cowId}</p>
          <p>Location: ({cow.latitude}, {cow.longitude})</p>
        </div>
      </Popup>
    </Marker>
  );
};

export default CowMarker;
