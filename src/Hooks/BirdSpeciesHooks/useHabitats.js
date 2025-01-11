import { useState, useEffect } from 'react';
import axios from 'axios';

const useHabitats = () => {
  const [habitats, setHabitats] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabitats = async () => {
      try {
        const response = await axios.get('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/bird/habitats');
        setHabitats(response.data);
      } catch (err) {
        console.error("Error fetching habitats:", err.message);
        setError("Failed to load habitats.");
      }
    };

    fetchHabitats();
  }, []);

  return { habitats, error };
};

export default useHabitats;
