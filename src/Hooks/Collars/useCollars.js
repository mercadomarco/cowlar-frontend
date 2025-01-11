import { useState } from 'react';

const useCollars = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to add a collar
  const addCollar = async (cowId, latitude, longitude) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/collars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cowId, latitude, longitude }),
      });

      if (!response.ok) {
        throw new Error('Failed to add collar');
      }

      const data = await response.json();
      return data; // Optionally return the created collar data
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
