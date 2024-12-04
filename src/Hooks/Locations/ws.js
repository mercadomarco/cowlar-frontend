import { useState, useEffect } from 'react';

const useLocations = () => {
  const [cowLocations, setCowLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const farmerId = localStorage.getItem('farmer_id'); // Retrieve farmerId from local storage
    console.log('Current farmerId:', farmerId); // Log the farmerId to check if it is null or valid

    if (!farmerId) {
      console.log('farmerId is null or undefined, skipping WebSocket connection');
      setLoading(false);
      return;
    }

    const wsUrl = `ws://localhost:8000`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connection opened');
      
      // Send a message to request cow locations for the farmer
      const message = JSON.stringify({
        action: 'getCowLocations',
        payload: {
          farmerId: farmerId
        }
      });
      
      socket.send(message);
      console.log('Sent message:', message);
    };

    socket.onmessage = (event) => {
      console.log('Received message:', event.data);
      try {
        const data = JSON.parse(event.data);

        // Check if the response contains cow locations
        if (data.cowLocations) {
          setCowLocations(data.cowLocations);
          console.log('Updated cow locations:', data.cowLocations);
        } else if (data.message === "Connection established") {
          console.log('Connection established message received');
        } else {
          console.log('No cow locations found in response');
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        setError('Failed to parse WebSocket message');
      }
      setLoading(false);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('WebSocket connection error');
      setLoading(false);
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Clean up WebSocket connection when component unmounts
    return () => {
      socket.close();
    };
  }, []); // No dependencies; runs once when the component mounts

  return { cowLocations, loading, error }; // Return cowLocations, loading, and error states
};

export default useLocations;
