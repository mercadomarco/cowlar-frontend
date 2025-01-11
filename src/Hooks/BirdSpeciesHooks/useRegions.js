import { useState, useEffect } from 'react';
import axios from 'axios';

const useRegions = () => {
  const [regions, setRegions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/bird/regions');
        setRegions(response.data);
      } catch (err) {
        console.error("Error fetching regions:", err.message);
        setError("Failed to load regions.");
      }
    };

    fetchRegions();
  }, []);

  return { regions, error };
};

export default useRegions;
