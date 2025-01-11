import React, { useRef, useEffect, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { Point, LineString } from 'ol/geom';
import { Feature } from 'ol';
import { Style, Icon, Stroke } from 'ol/style';
import { fromLonLat } from 'ol/proj';
import cowIcon from '../../Assests/cow_icon.png';
import useCowHistory from '../../Hooks/CowHistory/usecowHistory';

// Color mapping cache to ensure each collarId gets a unique color
const collarIdToColorMap = {};

const generateColor = (collarId) => {
  // If this collarId has already been assigned a color, return it
  if (collarIdToColorMap[collarId]) {
    return collarIdToColorMap[collarId];
  }

  // Otherwise, assign a new color and store it in the map
  const colors = [
    '#ff6600', '#00ff00', '#0000ff', '#ff0000', '#ff00ff', '#00ffff', '#ffff00', '#800080', '#008000'
  ];
  const index = Math.abs(collarId.charCodeAt(0) % colors.length);
  const color = colors[index];
  collarIdToColorMap[collarId] = color;
  return color;
};

const History = ({ filters }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const vectorLayerRef = useRef(null);
  const [featuresAdded, setFeaturesAdded] = useState(false);

  const { history: cowHistory, loading, error } = useCowHistory(filters);

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

    // Initialize vector layer if not already added
    if (!vectorLayerRef.current) {
      const vectorLayer = new VectorLayer({
        source: new VectorSource(),
      });
      mapInstance.current.addLayer(vectorLayer);
      vectorLayerRef.current = vectorLayer;
    }

    const vectorSource = vectorLayerRef.current.getSource();
    vectorSource.clear(); // Clear old features

    // Group cows by collarId
    const groupedByCollar = cowHistory.reduce((acc, entry) => {
      if (!acc[entry.collarId]) acc[entry.collarId] = [];
      acc[entry.collarId].push(entry);
      return acc;
    }, {});

    // Add features for each collar group
    Object.keys(groupedByCollar).forEach((collarId) => {
      const group = groupedByCollar[collarId];

      // Create a line between each cow in the same group
      const coordinates = group.map((entry) => fromLonLat([entry.longitude, entry.latitude]));
      if (coordinates.length > 1) {
        const lineFeature = new Feature({
          geometry: new LineString(coordinates),
        });

        const lineColor = generateColor(collarId); // Generate color based on collarId
        lineFeature.setStyle(
          new Style({
            stroke: new Stroke({
              color: lineColor,
              width: 3,
            }),
          })
        );
        vectorSource.addFeature(lineFeature);
      }

      // Add cow markers and add hover interaction for each cow
      group.forEach((entry) => {
        const { longitude, latitude, timestamp } = entry;
        const feature = new Feature({
          geometry: new Point(fromLonLat([longitude, latitude])),
          collarId,
          timestamp,
        });

        feature.setStyle(
          new Style({
            image: new Icon({
              src: cowIcon,
              scale: 0.05,
            }),
          })
        );

        // Add hover effect for displaying collar ID and timestamp
        feature.on('pointermove', (event) => {
          const element = event.originalEvent.target;
          element.style.cursor = 'pointer';
          const tooltip = document.createElement('div');
          tooltip.className = 'tooltip';
          tooltip.innerHTML = `Collar ID: ${collarId}<br/>Timestamp: ${timestamp}`;
          document.body.appendChild(tooltip);
          tooltip.style.left = `${event.pixel[0] + 10}px`;
          tooltip.style.top = `${event.pixel[1] + 10}px`;
        });

        feature.on('mouseout', () => {
          const tooltips = document.querySelectorAll('.tooltip');
          tooltips.forEach((tooltip) => tooltip.remove());
        });

        vectorSource.addFeature(feature);
      });
    });

    // Fit the map view to the features' extent
    const extent = vectorSource.getExtent();
    if (extent && !isNaN(extent[0])) {
      mapInstance.current.getView().fit(extent, { padding: [50, 50, 50, 50] });
    }
  }, [cowHistory, loading, error]);

  return (
    <div>
      {loading && <p>Loading cow history...</p>}
      {error && <p>Error: {error}</p>}
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default History;
