import { useState } from 'react';

const useCollars = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to add a collar
  const addCollar = async (cowId, collarId) => {
    setLoading(true);
    setError(null);

    try {
      const jwtToken = localStorage.getItem('jwt_token'); // Get JWT token from localStorage
      const farmerId = localStorage.getItem('farmer_id'); // Retrieve farmerId from localStorage

      // Ensure that all required data is present
      if (!farmerId || !cowId || !collarId) {
        throw new Error('farmerId, cowId, and collarId are required');
      }

      // Create the payload with the required structure
      const requestBody = {
        farmerId: farmerId,  // Use the farmerId from localStorage
        cowId: cowId,        // Cow ID passed to the function
        collarId: collarId   // Collar ID passed to the function
      };

      // Log the body before sending it (optional for debugging)
      console.log('Request Body:', requestBody);

      // Make the API request
      const response = await fetch('http://localhost:8000/api/collar/addToCow', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`, // Use JWT token for authorization
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody), // Use the updated requestBody
      });

      if (!response.ok) {
        throw new Error('Failed to add collar');
      }

      // Log the response data instead of storing it
      const data = await response.json();
      console.log('API Response:', data); // Log the response data

      return data; // Return the response data to the component
    } catch (err) {
      setError(err.message);
      throw err; // Re-throw error for handling in the component
    } finally {
      setLoading(false);
    }
  };

  return {
    addCollar,
    loading,
    error,
  };
};

export default useCollars;
