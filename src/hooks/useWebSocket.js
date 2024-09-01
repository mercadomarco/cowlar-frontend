import { useEffect, useState } from 'react';

const useWebSocket = () => {
  const [cowData, setCowData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ws = null;

    const connectWebSocket = () => {
      if (ws) {
        console.log('Closing previous WebSocket connection');
        ws.close();
      }

      try {
        ws = new WebSocket('ws://localhost:8000');
        console.log('Attempting to create WebSocket: ws://localhost:8000');
      } catch (err) {
        console.error('Failed to create WebSocket:', err);
        return;
      }

      ws.onopen = () => {
        console.log('WebSocket connection established');
        ws.send(JSON.stringify({ type: 'get-all-cows' }));
      };

      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data);
        try {
          const { message, data } = JSON.parse(event.data);

          if (message === 'Cows retrieved successfully') {
            console.log('Received cows data:', data);
            setCowData(data);
          }
        } catch (err) {
          console.error('Error parsing message:', err);
          setError(err);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error.message);
        setError(error);
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        // No reconnection logic needed, handled externally
      };
    };

    connectWebSocket();

    return () => {
      if (ws) {
        console.log('Closing WebSocket connection');
        ws.close();
      }
    };
  }, []);

  return { cowData, error };
};

export default useWebSocket;
