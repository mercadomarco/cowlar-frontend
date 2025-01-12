import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { Map as OLMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { Feature } from "ol";
import { LineString } from "ol/geom";
import { Stroke, Style } from "ol/style";
import "ol/ol.css";
import { fromLonLat } from "ol/proj";
import { boundingExtent } from "ol/extent";
import useGeofence from "../../Hooks/Geofence/useGeofence";

const GeofenceMap = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const geofenceLayer = useRef(null);
  const { geofences, getGeofence } = useGeofence();

  useEffect(() => {
    if (!mapInstance.current) {
      mapInstance.current = new OLMap({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [13510780.61, 1603044.05], // Example coordinates
          zoom: 5,
        }),
      });
    }

    // Fetch geofences when the component mounts
    getGeofence();
  }, [getGeofence]);

  useEffect(() => {
    if (geofences.length > 0 && mapInstance.current) {
      // Remove the old layer if it exists
      if (geofenceLayer.current) {
        mapInstance.current.removeLayer(geofenceLayer.current);
      }
  
      // Create a new vector source for geofences
      const vectorSource = new VectorSource();
  
      // Array to store all coordinates for extent calculation
      let allCoordinates = [];
  
      geofences.forEach((geofence) => {
        // Get the boundary coordinates and close the loop
        const coordinates = geofence.boundaryCoordinates.map((coord) => [
          coord.longitude,
          coord.latitude,
        ]);
  
        // Close the loop by appending the first coordinate to the end
        if (coordinates.length > 0) {
          coordinates.push(coordinates[0]);
        }
  
        // Accumulate all coordinates for extent calculation
        allCoordinates = [...allCoordinates, ...coordinates];
  
        // Create a LineString geometry and transform it
        const lineString = new LineString(coordinates).transform(
          "EPSG:4326",
          "EPSG:3857" // Transform to web mercator
        );
  
        const feature = new Feature({ geometry: lineString });
        vectorSource.addFeature(feature);
      });
  
      // Add the vector layer to the map
      geofenceLayer.current = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: "rgba(255, 0, 0, 0.8)", // Red color for geofences
            width: 3,
          }),
        }),
      });
  
      mapInstance.current.addLayer(geofenceLayer.current);
  
      // Calculate the extent and fit the map view
      if (allCoordinates.length > 0) {
        const transformedCoordinates = allCoordinates.map((coord) =>
          fromLonLat(coord) // Transform each coordinate to Web Mercator (EPSG:3857)
        );
  
        const extent = boundingExtent(transformedCoordinates);
        mapInstance.current.getView().fit(extent, {
          duration: 1000, // Animation duration in milliseconds
          padding: [50, 50, 50, 50], // Add padding around the boundary
        });
      }
    }
  }, [geofences]);
  

  return (
    <Container>
      <Title>Geofence Map</Title>
      <MapContainer ref={mapRef}></MapContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #333;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  margin-top: 20px;
`;

export default GeofenceMap;
