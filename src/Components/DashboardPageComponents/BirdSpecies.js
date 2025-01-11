import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaLocationCrosshairs } from "react-icons/fa6";
import L from 'leaflet';
import useRegions from '../../Hooks/BirdSpeciesHooks/useRegions';
import useHabitats from '../../Hooks/BirdSpeciesHooks/useHabitats';
import useBirdSpecies from '../../Hooks/BirdSpeciesHooks/useBirdSpecies';
import BirdModal from './SingleViewBird';
import { Circles } from 'react-loader-spinner';

const MapViewUpdater = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 10);
    }
  }, [coords, map]);
  return null;
};

const BirdSpecies = () => {
  const [search, setSearch] = useState('');
  const [habitat, setHabitat] = useState('');
  const [region, setRegion] = useState('');
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [selectedBird, setSelectedBird] = useState(null); 
  const mapRef = useRef(null); 
  const { birdSpecies, loading, error } = useBirdSpecies({ search, habitat, region });
  const { regions } = useRegions();
  const { habitats } = useHabitats();

  const handleSearchChange = (e) => setSearch(e.target.value);
  const handleHabitatChange = (e) => setHabitat(e.target.value);
  const handleRegionChange = (e) => setRegion(e.target.value);

  const handleIconClick = (coords) => {
    setSelectedCoords(coords);
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth' }); 
    }
  };

  const handleCardClick = (bird) => {
    setSelectedBird(bird); 
  };

  const handleModalClose = () => {
    setSelectedBird(null); 
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Circles
          height="40"
          width="40"
          color="#121481"
          ariaLabel="circles-loading"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
        />
      </div>
    );
  }
  
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      <Header>
        <Title>Philippine Bird Species</Title>
      </Header>
      <SearchFilterContainer>
        <SearchBar
          type="text"
          placeholder="Search birds..."
          value={search}
          onChange={handleSearchChange}
        />
        <FilterContainer>
          <select value={habitat} onChange={handleHabitatChange}>
            <option value="">Filter by Habitat</option>
            {habitats.map((habitat, index) => (
              <option key={index} value={habitat}>{habitat}</option>
            ))}
          </select>
          <select value={region} onChange={handleRegionChange}>
            <option value="">Filter by Region</option>
            {regions.map((region, index) => (
              <option key={index} value={region}>{region}</option>
            ))}
          </select>
        </FilterContainer>
      </SearchFilterContainer>

      <BirdGrid>
        {birdSpecies.map((bird) => {
          const imageUrl = `https://ibon-server-0c0c6dfbe0a0.herokuapp.com${bird.photo}`;
          return (
            <BirdCard key={bird.birdId} onClick={() => handleCardClick(bird)}>
              <BirdImage
                src={imageUrl}
                alt={bird.birdName}
                onError={() => console.error(`Failed to load image: ${imageUrl}`)}
              />
              <BirdInfo>
                <BirdName>{bird.birdName}</BirdName>
                <BirdScientificName>{bird.scientificName}</BirdScientificName>
                <IconButton onClick={(e) => {
                    e.stopPropagation(); // Prevent click event from reaching the card
                    handleIconClick([bird.latitude, bird.longitude]);
                  }}>
                 <FaLocationCrosshairs className='icon'/>
                </IconButton>
              </BirdInfo>
            </BirdCard>
          );
        })}
      </BirdGrid>

      {selectedBird && (
        <BirdModal bird={selectedBird} onClose={handleModalClose} />
      )}

      <InteractiveMap ref={mapRef}>
        <StyledMapContainer center={[12.8797, 121.7740]} zoom={5} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {selectedCoords && <MapViewUpdater coords={selectedCoords} />}
          {birdSpecies.map((bird) => {
            const customIcon = L.divIcon({
              html: `<div style="
                background-image: url('http://localhost:8000${bird.photo}');
                background-size: cover;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid white;
                box-shadow: 0 0 5px rgba(0,0,0,0.5);
              "></div>`,
              className: '', 
              iconSize: [20, 20], 
              iconAnchor: [10, 10], 
              popupAnchor: [0, -10], 
            });

            return (
              bird.latitude !== 0 && bird.longitude !== 0 && (
                <Marker
                  key={bird.birdId}
                  position={[bird.latitude, bird.longitude]}
                  icon={customIcon}
                >
                  <Popup>
                    {bird.birdName} <br /> {bird.description}
                  </Popup>
                </Marker>
              )
            );
          })}
        </StyledMapContainer>
      </InteractiveMap>
    </Container>
  );
};

export default BirdSpecies;

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

const SearchFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #333;
`;

const SearchBar = styled.input`
  padding: 15px;
  font-size: 0.8;
  width: 95%;
  font-family: 'Poppins';
  border: 1px solid #ccc;
  border-radius: 25px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;

  select {
    font-family: 'Poppins';
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 25px;
    background-color: #fff;
    font-size: 0.8rem;
    cursor: pointer;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(42, 93, 103, 0.5);
    }
  }
`;

const BirdGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  padding: 20px;
`;

const BirdCard = styled.div`
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  max-width: 300px; /* Ensures a consistent card width */
  width: 100%; /* Allows the card to adapt responsively */
`;

const BirdImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  cursor: pointer;
`;

const BirdInfo = styled.div`
  padding: 15px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  color: #333;
`;

const BirdName = styled.h2`
  font-size: 0.9rem;
  font-weight: 600;
  color: #2a5d67;
`;

const BirdScientificName = styled.p`
  font-size: 0.8rem;
  font-style: italic;
  color: #888;
  margin: 5px 0;
`;


const IconButton = styled.div`
  color: white;
  border: none;
  border-radius: 25px;
  padding: 8px 12px;
  display: flex;;
  background-color: #121481;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
  font-family: 'Poppins';
  cursor: pointer;

  .icon {
    color: #ffffff;
    margin-right: 10px;
    font-size: 1.3rem;
  }

  &:hover {
    background-color: #4a8c8b;
  }
`;

const InteractiveMap = styled.div`
  margin-top: 20px;
`;

const StyledMapContainer = styled(MapContainer)`
  height: 500px;
  width: 100%;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;
