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
import Overlay from "ol/Overlay";
import { fromLonLat } from "ol/proj";
import { boundingExtent } from "ol/extent";
import "ol/ol.css";
import ReactDOMServer from "react-dom/server";
import { ImLocation } from "react-icons/im";
import useGeofence from "../../Hooks/Geofence/useGeofence";
import useLocations from "../../Hooks/Locations/useLocations";

const CowsLocation = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const geofenceLayer = useRef(null);
  const cowLayer = useRef(null);
  const { geofences, getGeofence } = useGeofence();
  const { cowLocations } = useLocations(); // Removed `loading` and `error` since they are not used

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
        const coordinates = geofence.boundaryCoordinates.map((coord) => [
          coord.longitude,
          coord.latitude,
        ]);

        // Close the loop by appending the first coordinate to the end
        if (coordinates.length > 0) {
          coordinates.push(coordinates[0]);
        }

        allCoordinates = [...allCoordinates, ...coordinates];

        const lineString = new LineString(coordinates).transform(
          "EPSG:4326",
          "EPSG:3857"
        );

        const feature = new Feature({ geometry: lineString });
        vectorSource.addFeature(feature);
      });

      // Add the vector layer to the map
      geofenceLayer.current = new VectorLayer({
        source: vectorSource,
        style: new Style({
          stroke: new Stroke({
            color: "rgba(255, 0, 0, 0.8)",
            width: 3,
          }),
        }),
      });

      mapInstance.current.addLayer(geofenceLayer.current);

      // Calculate the extent and fit the map view
      if (allCoordinates.length > 0) {
        const transformedCoordinates = allCoordinates.map((coord) =>
          fromLonLat(coord)
        );

        const extent = boundingExtent(transformedCoordinates);
        mapInstance.current.getView().fit(extent, {
          duration: 1000,
          padding: [50, 50, 50, 50],
        });
      }
    }
  }, [geofences]);

  useEffect(() => {
    if (cowLocations.length > 0 && mapInstance.current) {
      // Remove the old layer if it exists
      if (cowLayer.current) {
        mapInstance.current.removeLayer(cowLayer.current);
      }
  
      const vectorSource = new VectorSource();
  
      cowLocations.forEach((cow) => {
        if (cow.location && cow.location.latitude && cow.location.longitude) {
          const coordinates = [
            cow.location.longitude,
            cow.location.latitude,
          ];
  
          const lonLat = fromLonLat(coordinates);
  
          // Create overlay for each cow's location
          const locationElement = document.createElement("div");
          locationElement.innerHTML = `<div style="font-size: 24px; color: green;">${ReactDOMServer.renderToString(
            <ImLocation />
          )}</div>`; // Render the icon
  
          const overlay = new Overlay({
            position: lonLat,
            positioning: "center-center",
            element: locationElement,
            stopEvent: false,
          });
  
          mapInstance.current.addOverlay(overlay);
  
          let detailOverlay = null;
  
          // Add mouseover event to show cow details
          locationElement.addEventListener("mouseover", (event) => {
            // Show the details when hovering over the marker
            const detailsElement = document.createElement("div");
            detailsElement.innerHTML = ` 
              <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">
                <h4><strong>Name: </strong>${cow.name}</h4>
                <p><strong>Breed:</strong> ${cow.breed}</p>
                <p><strong>Age:</strong> ${cow.age}</p>
                <p><strong>Status:</strong> ${cow.status}</p>
                <p><strong>Location:</strong> ${cow.location.latitude}, ${cow.location.longitude}</p>
              </div>
            `;
  
            detailOverlay = new Overlay({
              element: detailsElement,
              positioning: "bottom-center",
              stopEvent: true,
            });
  
            const mapElement = mapRef.current;
            const mousePosition = mapElement.getBoundingClientRect();
            const cursorX = event.clientX - mousePosition.left;
            const cursorY = event.clientY - mousePosition.top - 10;
  
            detailOverlay.setPosition(
              mapInstance.current.getCoordinateFromPixel([cursorX, cursorY])
            );
            mapInstance.current.addOverlay(detailOverlay);
          });
  
          // Add mouseout event to hide cow details
          locationElement.addEventListener("mouseout", () => {
            if (detailOverlay) {
              mapInstance.current.removeOverlay(detailOverlay); // Remove the details when the mouse leaves
              detailOverlay = null;
            }
          });
        }
      });
  
      cowLayer.current = new VectorLayer({
        source: vectorSource,
      });
  
      mapInstance.current.addLayer(cowLayer.current);
    }
  }, [cowLocations]);
  

  return (
    <Container>
      <Title>Geofence and Cows Map</Title>
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
  margin-top: 50px;
`;

const MapContainer = styled.div`
  width: 100%;
  height: 500px;
  margin-top: 20px;
`;

export default CowsLocation;
