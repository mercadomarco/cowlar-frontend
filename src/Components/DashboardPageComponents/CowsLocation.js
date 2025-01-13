import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import Overlay from 'ol/Overlay';
import { fromLonLat, get as getProjection } from 'ol/proj';
import 'ol/ol.css';
import useLocations from '../../Hooks/Locations/useLocations';
import { Circles } from 'react-loader-spinner';
import { ImLocation } from 'react-icons/im';
import ReactDOMServer from 'react-dom/server';
import { extend as extendExtent, createEmpty as createEmptyExtent } from 'ol/extent'; // For calculating bounds

const CowsLocation = () => {
  const { cowLocations, loading, error } = useLocations();
  const mapRef = useRef(); // Reference to the map container div
  const mapInstanceRef = useRef(null); // To track the map instance
  const overlayRef = useRef([]); // Initialize as an empty array to store overlays

  useEffect(() => {
    if (!mapInstanceRef.current && mapRef.current) {
      // Initialize the map
      const map = new Map({
        target: mapRef.current, // Attach the map to the div element
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: fromLonLat([121.7740, 12.8797]), // Default center
          zoom: 16, // Default zoom
        }),
        controls: [], // Disable default controls
      });

      // Extend extent to dynamically fit all cow markers
      let extent = createEmptyExtent(); // Initialize an empty extent

      cowLocations
        .filter(cow => cow.location && cow.location.latitude && cow.location.longitude)
        .forEach(cow => {
          const lonLat = fromLonLat([cow.location.longitude, cow.location.latitude]);

          // Extend the extent to include this marker's position
          extendExtent(extent, [lonLat[0], lonLat[1], lonLat[0], lonLat[1]]);

          // Create overlay for each cow's location
          const locationElement = document.createElement('div');
          locationElement.innerHTML = `<div style="font-size: 24px; color: green;">${ReactDOMServer.renderToString(<ImLocation />)}</div>`; // Render the icon
          
          const overlay = new Overlay({
            position: lonLat, // Position the overlay
            positioning: 'center-center',
            element: locationElement,
            stopEvent: false,
          });

          // Add the overlay to the map and the array
          map.addOverlay(overlay);
          overlayRef.current.push(overlay); // Store the overlay in the array

          // Add mouseover event to show cow details
          locationElement.addEventListener('mouseover', (event) => {
            const detailsElement = document.createElement('div');
            detailsElement.innerHTML = `
              <div style="background: white; padding: 10px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">
                <h4><strong>Name: </strong>${cow.name}</h4>
                <p><strong>Breed:</strong> ${cow.breed}</p>
                <p><strong>Age:</strong> ${cow.age}</p>
                <p><strong>Status:</strong> ${cow.status}</p>
                <p><strong>Location:</strong> ${cow.location.latitude}, ${cow.location.longitude}</p>
              </div>
            `;
            const detailOverlay = new Overlay({
              element: detailsElement,
              positioning: 'bottom-center', // Position above the cursor
              stopEvent: true,
            });

            // Get cursor position relative to the map
            const mapElement = mapRef.current;
            const mousePosition = mapElement.getBoundingClientRect();
            const cursorX = event.clientX - mousePosition.left;
            const cursorY = event.clientY - mousePosition.top - 10; // Offset above the cursor

            detailOverlay.setPosition(map.getCoordinateFromPixel([cursorX, cursorY])); // Set the position based on the cursor
            map.addOverlay(detailOverlay);
            overlayRef.current.push(detailOverlay); // Store the details overlay in the array

            // Add mouseout event to hide cow details
            locationElement.addEventListener('mouseout', () => {
              detailOverlay.setPosition(undefined); // Hide the details overlay
            });
          });
        });

      // If we have valid cow locations, adjust the map view to fit the extent
      if (!isExtentEmpty(extent)) {
        map.getView().fit(extent, {
          size: map.getSize(), // Size of the map
          maxZoom: 18, // Maximum zoom level
          duration: 1000, // Animation duration (optional)
        });
      }

      // Store the map instance reference
      mapInstanceRef.current = map;
    }

    // Clean up the map when the component unmounts
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null); // Detach map from the DOM
        mapInstanceRef.current = null; // Remove map reference
      }
    };
  }, [cowLocations]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Circles
          height="40"
          width="40"
          color="#121481"
          ariaLabel="circles-loading"
          visible={true}
        />
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <Header>
        <Title>Cows Location</Title>
      </Header>

      <InteractiveMap>
        <StyledMapContainer ref={mapRef} />
      </InteractiveMap>
    </Container>
  );
};

export default CowsLocation;

// Helper function to check if the extent is empty
const isExtentEmpty = (extent) => {
  return extent[0] === Infinity || extent[1] === Infinity || extent[2] === -Infinity || extent[3] === -Infinity;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 20px;
  margin-top: 30px;
  overflow-y: auto;
  font-family: 'Poppins';
`;

const Header = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #333;
`;

const InteractiveMap = styled.div`
  margin-top: 20px;
`;

const StyledMapContainer = styled.div`
  height: 500px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;
