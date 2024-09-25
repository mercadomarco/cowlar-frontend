import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Styled components for the layout (as defined earlier)
const Container = styled.div`
  padding: 20px;
  font-family: 'Arial, sans-serif';
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const Title = styled.h1`
  font-size: 2em;
  color: #2a5d67;
`;

const SearchBar = styled.input`
  padding: 10px;
  font-size: 1em;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const FeaturedCarousel = styled.div`
  margin: 20px 0;
  /* Add carousel styling here */
`;

const BirdGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const BirdCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const BirdImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const BirdInfo = styled.div`
  padding: 10px;
`;

const BirdName = styled.h3`
  margin: 0;
  color: #333;
`;

const BirdScientificName = styled.p`
  font-style: italic;
  color: #666;
`;

const BirdDescription = styled.p`
  font-size: 0.9em;
  color: #777;
`;

const InteractiveMap = styled.div`
  margin: 40px 0;
  height: 400px;
`;

// Leaflet map container styled component
const StyledMapContainer = styled(MapContainer)`
  height: 100%;
  width: 100%;
`;

const Footer = styled.footer`
  margin-top: 40px;
  padding: 20px 0;
  background-color: #f8f8f8;
  text-align: center;
`;

const BirdSpecies = () => {
  const [birdSpecies, setBirdSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBirdSpecies = async () => {
      try {
        const response = await axios.get('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/bird/birdSpecies', {
          headers: {
            Authorization: `Bearer your-session-id`, // Replace with actual session ID if needed
          },
        });
        setBirdSpecies(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBirdSpecies();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Container>
      {/* Header Section */}
      <Header>
        <Title>Philippine Bird Species</Title>
        <SearchBar type="text" placeholder="Search birds..." />
        <FilterContainer>
          <select>
            <option>Filter by Habitat</option>
            <option>Forest</option>
            <option>Wetlands</option>
            <option>Coastal</option>
            <option>Urban</option>
          </select>
          <select>
            <option>Filter by Region</option>
            <option>Luzon</option>
            <option>Visayas</option>
            <option>Mindanao</option>
          </select>
        </FilterContainer>
      </Header>

      {/* Featured Species Carousel */}
      <FeaturedCarousel>
        {/* Add carousel items here for species like the Philippine Eagle, Cebu Flowerpecker, etc. */}
      </FeaturedCarousel>

      {/* Bird Species Grid */}
      <BirdGrid>
        {birdSpecies.map((bird) => (
          <BirdCard key={bird.birdId}>
            <BirdImage src={bird.photo || 'placeholder.jpg'} alt={bird.birdName} />
            <BirdInfo>
              <BirdName>{bird.birdName}</BirdName>
              <BirdScientificName>{bird.scientificName}</BirdScientificName>
              <BirdDescription>{bird.description}</BirdDescription>
            </BirdInfo>
          </BirdCard>
        ))}
      </BirdGrid>

      {/* Interactive Map */}
      <InteractiveMap>
        <StyledMapContainer center={[12.8797, 121.7740]} zoom={6} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          {/* Add markers for bird species locations */}
          {/* Example markers - you might want to add dynamic markers based on bird species */}
          <Marker position={[16.4023, 120.5960]}>
            <Popup>
              Philippine Eagle <br /> Found in Luzon.
            </Popup>
          </Marker>
          <Marker position={[10.3157, 123.8854]}>
            <Popup>
              Cebu Flowerpecker <br /> Endemic to Cebu.
            </Popup>
          </Marker>
        </StyledMapContainer>
      </InteractiveMap>

      {/* Footer Section */}
      <Footer>
        <p>Philippine Bird Species © 2024</p>
        <p>Contact us | Privacy Policy</p>
      </Footer>
    </Container>
  );
};

export default BirdSpecies;
