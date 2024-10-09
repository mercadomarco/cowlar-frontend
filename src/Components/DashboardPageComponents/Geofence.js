import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Map as OLMap, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Circles } from 'react-loader-spinner';
import 'ol/ol.css';

const Cows = () => {
  const mapRef = useRef(null);

  // Loading state (for demonstration)
  const loading = false; // Replace with actual loading state
  const error = null; // Replace with actual error handling

  useEffect(() => {
    if (!loading && !error) {
      new OLMap({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        view: new View({
          center: [13510780.61, 1603044.05], // Longitude and Latitude converted to OpenLayers coordinates
          zoom: 5,
        }),
      });
    }
  }, [loading, error]);

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
        <Title>Geofence</Title>
      </Header>

      <InteractiveMap>
        <StyledMapContainer ref={mapRef} />
      </InteractiveMap>
    </Container>
  );
};

export default Cows;

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
