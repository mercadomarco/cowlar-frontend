// src/components/WebSocketTest.js

import React, { useEffect, useState } from 'react';

const WebSocketTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      ws = new WebSocket('ws://localhost:8000');

      ws.onopen = () => {
        setConnectionStatus('Connected');
        console.log('WebSocket connection established');
      };

      ws.onmessage = (event) => {
        console.log('Message received:', event.data);
        setMessage(event.data);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('Error');
      };

      ws.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
        setConnectionStatus('Disconnected');
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };
    };

    connectWebSocket();

    // Clean up WebSocket connection on component unmount
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Test</h1>
      <p>Connection Status: <strong>{connectionStatus}</strong></p>
      <p>Last Message: <strong>{message}</strong></p>
      <p>Check the console for WebSocket connection status and messages.</p>
    </div>
  );
};

export default WebSocketTest;
