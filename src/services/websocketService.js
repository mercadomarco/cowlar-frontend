// src/services/websocketService.js

const WEBSOCKET_URL =
  process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8000"; // Fallback URL

export const connectWebSocket = (onMessage, onError, onClose) => {
  let ws = null;
  let retryTimeout = 5000;
  let isConnected = false; // New flag to track connection status

  const createWebSocket = () => {
    if (ws) {
      console.log("Closing previous WebSocket connection");
      ws.close();
    }

    try {
      ws = new WebSocket(WEBSOCKET_URL);
      console.log("Attempting to create WebSocket:", WEBSOCKET_URL);
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      return;
    }

    ws.onopen = () => {
      console.log("WebSocket connection established");
      isConnected = true; // Update connection status
      retryTimeout = 5000;
      if (onClose) onClose("Connected");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (err) {
        console.error("Error parsing message:", err);
        if (onError) onError(err);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error.message); // Improved error logging
      if (onError) onError(error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket connection closed:", event);
      isConnected = false; // Update connection status
      if (onClose) onClose("Disconnected");
      if (!isConnected) { // Only attempt to reconnect if not connected
        setTimeout(() => {
          console.log("Attempting to reconnect...");
          createWebSocket();
        }, retryTimeout);
        retryTimeout = Math.min(retryTimeout * 2, 60000);
      }
    };
  };

  createWebSocket();

  return {
    socket: ws,
    close: () => {
      if (ws) {
        console.log("Closing WebSocket connection");
        ws.close();
      }
    },
  };
};
