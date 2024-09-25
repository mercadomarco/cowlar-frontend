import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const useMapViewUpdater = (coords) => {
  const map = useMap();

  useEffect(() => {
    if (coords) {
      map.setView(coords, 10); // Adjust the zoom level as needed
    }
  }, [coords, map]);

  return null;
};

export default useMapViewUpdater;
