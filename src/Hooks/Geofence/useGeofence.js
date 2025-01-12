import { useState, useRef } from "react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

const useGeofence = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [geofences, setGeofences] = useState([]);
  const farmerId = localStorage.getItem("farmer_id"); // Retrieve farmerId from localStorage
  const hasFetchedGeofences = useRef(false); // Flag to prevent multiple fetches

  const validateToken = () => {
    const jwtToken = localStorage.getItem("jwt_token");
    if (!jwtToken || !farmerId) {
      throw new Error("Authentication or Farmer ID is missing.");
    }
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${jwtToken}`;
    return jwtToken;
  };

  const addGeofence = async (boundaryCoordinates) => {
    setLoading(true);
    setError(null);

    try {
      validateToken();

      const response = await axiosInstance.post("geofence/add", {
        farmerId,
        boundaryCoordinates,
      });

      console.log(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Error adding geofence:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateGeofence = async (geofenceId, boundaryCoordinates) => {
    setLoading(true);
    setError(null);

    try {
      validateToken();

      const response = await axiosInstance.post("geofence/update", {
        geofenceId,
        boundaryCoordinates,
      });

      console.log(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Error updating geofence:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteGeofence = async (geofenceId) => {
    setLoading(true);
    setError(null);

    try {
      validateToken();

      const response = await axiosInstance.delete(`geofence/delete/${geofenceId}`);

      console.log(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Error deleting geofence:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGeofences = async () => {
    if (hasFetchedGeofences.current) {
      console.log("Geofences already fetched. Skipping request.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      validateToken();

      const response = await axiosInstance.get(`geofence/get/${farmerId}`);

      setGeofences(response.data.geofences);
      console.log("Geofences retrieved:", response.data.geofences);

      // Set the flag to true after the first fetch
      hasFetchedGeofences.current = true;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error("Error fetching geofences:", err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, geofences, addGeofence, updateGeofence, deleteGeofence, fetchGeofences };
};

export default useGeofence;
