import { useState, useEffect } from 'react';

const useLocations = () => {
  const [cowLocations, setCowLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLocations = async (farmerId) => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const jwtToken = localStorage.getItem('jwt_token'); // Get JWT token from localStorage
      console.log('Fetching locations for farmerId:', farmerId); // Log fetch attempt

      const response = await fetch(`http://localhost:8000/api/location/farmer/${farmerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`, // Use JWT token for authorization
          'Content-Type': 'application/json', // Optional: set content type if needed
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      setCowLocations(data.cowLocations); // Update this line to match the API response format

      // Log the fetched cow locations to the console
      console.log('Fetched cow locations:', data.cowLocations);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching locations:', err); // Log the error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const farmerId = localStorage.getItem('farmer_id'); // Retrieve farmerId from local storage
    console.log('Current farmerId:', farmerId); // Log the farmerId to check if it is null or valid

    // Only fetch locations if farmerId is valid
    if (farmerId) {
      fetchLocations(farmerId); // Fetch locations with the farmerId
    } else {
      console.log('farmerId is null or undefined, skipping fetch'); // Log if farmerId is invalid
    }
  }, []); // No dependencies; runs once when the component mounts

  return { cowLocations, loading, error }; // Return cowLocations, loading, and error states
};

export default useLocations;
 