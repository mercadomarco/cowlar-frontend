import { useState } from 'react';
import axios from 'axios';

const useGeofence = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geofences, setGeofences] = useState([]);
  const farmerId = localStorage.getItem('farmer_id'); // Retrieve farmerId from local storage

  const addGeofence = async (boundaryCoordinates) => {
    setLoading(true);
    setError(null);

    try {
      if (farmerId) {
        const jwtToken = localStorage.getItem('jwt_token'); // Get JWT token from localStorage
        console.log('Adding geofence for farmerId:', farmerId); // Log add attempt

        const response = await axios.post(
          'http://localhost:8000/api/geofence/add',
          { farmerId, boundaryCoordinates },
          {
            headers: {
              'Authorization': `Bearer ${jwtToken}`, // Use JWT token for authorization
              'Content-Type': 'application/json',
            },
          }
        );

        console.log(response.data.message); // Log the success message
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

      const response = await axios.post(
        'http://localhost:8000/api/geofence/update',
        { geofenceId, boundaryCoordinates },
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`, // Use JWT token for authorization
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response.data.message); // Log the success message
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

      const response = await axios.delete(
        `http://localhost:8000/api/geofence/delete/${geofenceId}`,
        {
          headers: {
            'Authorization': `Bearer ${jwtToken}`, // Use JWT token for authorization
          },
        }
      );

      console.log(response.data.message); // Log the success message
    } catch (err) {
      setError(err.message);
      console.error('Error deleting geofence:', err); // Log the error message
    } finally {
      setLoading(false);
    }
  };

  // Fetch all geofences for the current farmer
  const fetchGeofences = async () => {
    setLoading(true);
    setError(null);

    try {
      if (farmerId) {
        const jwtToken = localStorage.getItem('jwt_token'); // Get JWT token from localStorage
        console.log('Fetching geofences for farmerId:', farmerId); // Log fetch attempt

        const response = await axios.get(`http://localhost:8000/api/geofence/get/${farmerId}`, {
          headers: {
            'Authorization': `Bearer ${jwtToken}`, // Use JWT token for authorization
          },
        });

        setGeofences(response.data.geofences);
        console.log('Geofences retrieved:', response.data.geofences); // Log the retrieved geofences
      } else {
        throw new Error('Farmer ID is not available.');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching geofences:', err); // Log the error message
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, geofences, addGeofence, updateGeofence, deleteGeofence, fetchGeofences };
};

export default useGeofence;
