import React, { useRef, useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Icon } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import cowIcon from '../../Assests/cow_icon.png';
import useCowHistory from '../../Hooks/CowHistory/usecowHistory';

const History = ({ filters }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorLayerRef = useRef(null);

  const { history: cowHistory, loading, error } = useCowHistory(filters);

  // State to track whether features have been added to the map
  const [featuresAdded, setFeaturesAdded] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map only once
    if (!mapInstance.current) {
      const map = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([0, 0]), // Default center
          zoom: 2, // Default zoom level
        }),
      });

      mapInstance.current = map;
    }
  }, []);

  useEffect(() => {
    if (!mapInstance.current || loading || error || cowHistory.length === 0) return;

    // Initialize the vector layer if not already created
    if (!vectorLayerRef.current) {
      const vectorLayer = new VectorLayer({
        source: new VectorSource(),
      });
      mapInstance.current.addLayer(vectorLayer);
      vectorLayerRef.current = vectorLayer;
    }

    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource.clear(); // Clear old features

    // Add new features to the vector layer
    cowHistory.forEach((entry) => {
      const { longitude, latitude, timestamp } = entry;

      if (longitude && latitude) {
        const feature = new Feature({
          geometry: new Point(fromLonLat([longitude, latitude])),
          timestamp,
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              src: cowIcon, // Use the imported local icon
              scale: 0.05,
            }),
          })
        );

        vectorSource.addFeature(feature);
      }
    });

    // Only fit the map view if new features are added
    if (!featuresAdded) {
      const extent = vectorSource.getExtent();
      if (extent && !isNaN(extent[0])) {
        mapInstance.current.getView().fit(extent, { padding: [50, 50, 50, 50] });
      }
      setFeaturesAdded(true); // Mark that features have been added
    }
  }, [cowHistory, loading, error, featuresAdded]);

  return (
    <div>
      {loading && <p>Loading cow history...</p>}
      {error && <p>Error: {error}</p>}
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default History;
