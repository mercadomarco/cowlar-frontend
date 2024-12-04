import { useState } from 'react';
import axios from 'axios';

const useGeofence = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const farmerId = localStorage.getItem('farmer_id'); // Retrieve farmerId from local storage

  const addGeofence = async (boundaryCoordinates) => {
    setLoading(true);
    setError(null);

    try {
      if (farmerId) {
        const jwtToken = localStorage.getItem('jwt_token'); // Get JWT token from localStorage
        console.log('Adding geofence for farmerId:', farmerId); // Log add attempt

        await axios.post('http://localhost:8000/api/geofence/add', 
          { farmerId, boundaryCoordinates }, 
          {
            headers: {
              'Authorization': `Bearer ${jwtToken}`, // Use JWT token for authorization
              'Content-Type': 'application/json', // Optional: set content type if needed
            },
          }
        );
      } else {
        throw new Error('Farmer ID is not available.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error adding geofence:', err); // Log the error message
    } finally {
      setLoading(false);
    }
  };

  const updateGeofence = async (geofenceId, boundaryCoordinates) => {
    setLoading(true);
    setError(null);

    try {
      const jwtToken = localStorage.getItem('jwt_token'); // Get JWT token from localStorage
      console.log('Updating geofenceId:', geofenceId); // Log update attempt

      await axios.post('http://localhost:8000/api/geofence/update', 
        { geofenceId, boundaryCoordinates }, 
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`, // Use JWT token for authorization
            'Content-Type': 'application/json', // Optional: set content type if needed
          },
        }
      );
    } catch (err) {
      setError(err.message);
      console.error('Error updating geofence:', err); // Log the error message
    } finally {
      setLoading(false);
    }
  };

  const deleteGeofence = async (geofenceId) => {
    setLoading(true);
    setError(null);

    try {
      const jwtToken = localStorage.getItem('jwt_token'); // Get JWT token from localStorage
      console.log('Deleting geofenceId:', geofenceId); // Log delete attempt

      await axios.delete(`http://localhost:8000/api/geofence/delete/${geofenceId}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`, // Use JWT token for authorization
        },
      });
    } catch (err) {
      setError(err.message);
      console.error('Error deleting geofence:', err); // Log the error message
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, addGeofence, updateGeofence, deleteGeofence };
};

export default useGeofence;
