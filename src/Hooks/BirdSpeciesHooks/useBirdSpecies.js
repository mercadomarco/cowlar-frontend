import { useState, useEffect } from 'react';
import axios from 'axios';

const useBirdSpecies = ({ search, habitat, region }) => {
  const [birdSpecies, setBirdSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCoordinates = async (region) => {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          q: region,
          key: '78c8bafbea4043c09d2d30ab6739d6d5',
          limit: 1
        }
      });
      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        return [lat, lng];
      }
    } catch (err) {
      console.error("Error fetching coordinates:", err.message);
    }
    return [0, 0]; // Default or error coordinates
  };

  useEffect(() => {
    const fetchBirdSpecies = async () => {
      const sessionId = localStorage.getItem('sessionId');
      try {
        const response = await axios.get('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/bird/birdSpecies', {
          headers: {
            'Authorization': `Bearer ${sessionId}`
          },
          params: { search, habitat, region }
        });

        const birdSpeciesWithCoords = await Promise.all(response.data.map(async (bird) => {
          if (!bird.latitude || !bird.longitude) {
            const [lat, lng] = await getCoordinates(bird.region);
            return { ...bird, latitude: lat, longitude: lng };
          }
          return bird;
        }));

        setBirdSpecies(birdSpeciesWithCoords);
      } catch (err) {
        console.error("Error fetching bird species:", err.message);
        setError("Failed to load bird species.");
      } finally {
        setLoading(false);
      }
    };

    fetchBirdSpecies();
  }, [search, habitat, region]);

  return { birdSpecies, loading, error };
};

export default useBirdSpecies;
