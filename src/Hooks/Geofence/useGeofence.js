import { useState, useRef, useCallback } from "react";
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
  const farmerId = localStorage.getItem("farmer_id"); 
  const hasFetchedGeofences = useRef(false); 

  const validateToken = () => {
    const jwtToken = localStorage.getItem("jwt_token");
    if (!jwtToken || !farmerId) {
      throw new Error("Authentication or Farmer ID is missing.");
    }
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${jwtToken}`;
    return jwtToken;
  };

  const handleApiRequest = async (apiCall, params) => {
    setLoading(true);
    setError(null);

    try {
      validateToken();
      const response = await apiCall(params);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "An unexpected error occurred.");
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addGeofence = async (coordinates) => {
    if (!Array.isArray(coordinates) || coordinates.length < 10) {
      setError("Geofence requires at least 3 coordinates.");
      return;
    }

    const boundaryCoordinates = coordinates.map((coord) => ({
      latitude: coord.latitude,
      longitude: coord.longitude,
    }));
    // console.log("Received boundaryCoordinates:", boundaryCoordinates);

    const payload = { farmerId: farmerId, boundaryCoordinates: boundaryCoordinates };
    console.log("Payload: ", payload);

    try {
      const data = await handleApiRequest(
        (params) => axiosInstance.post("geofence/add", params),
        payload
      );
      if (data) {
        console.log(data.message);
      }
    } catch (err) {
      console.error("Error adding geofence:", err);
    }
  };

  const deleteGeofence = async (geofenceId) => {
    const data = await handleApiRequest(
      (params) => axiosInstance.delete(`geofence/delete/${params}`),
      geofenceId
    );
    if (data) console.log(data.message);
  };

  const fetchGeofences = useCallback(async () => {
    if (hasFetchedGeofences.current) {
      console.log("Geofences already fetched. Skipping request.");
      return;
    }

    const data = await handleApiRequest(
      () => axiosInstance.get(`geofence/get/${farmerId}`),
      null
    );
    
    if (data) {
      setGeofences(data.geofences);
      console.log("Geofences retrieved:", data.geofences);
      hasFetchedGeofences.current = true;
    }
  }, [farmerId]);

  return { loading, error, geofences, addGeofence, deleteGeofence, fetchGeofences };
};

export default useGeofence;
