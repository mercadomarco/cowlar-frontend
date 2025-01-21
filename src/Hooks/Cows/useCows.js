import { useState, useEffect, useRef } from "react";

const useCows = () => {
  const [cows, setCows] = useState([]);
  const [unassociatedCows, setUnassociatedCows] = useState([]); // New state for unassociated cows
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // Create a ref to track if cows have been fetched

  const fetchCows = async (farmerId) => {
    // Check if cows have already been fetched
    if (hasFetched.current) return;

    hasFetched.current = true; // Set the ref to true, indicating cows have been fetched
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const jwtToken = localStorage.getItem("jwt_token"); // Get JWT token from localStorage
      // console.log('Fetching cows for farmerId:', farmerId); // Log fetch attempt

      const response = await fetch(
        `http://localhost:8000/api/cow/get/${farmerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Use JWT token for authorization
            "Content-Type": "application/json", // Optional: set content type if needed
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch cows: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      setCows(data.cows || []); // Ensure cows is an array even if empty

      // Log the fetched cows to the console
      console.log("Fetched cows:", data.cows);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching cows:", err); // Log the error message
    } finally {
      setLoading(false);
    }
  };

  // New function to fetch unassociated cows
  const fetchUnassociatedCows = async (farmerId) => {
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const jwtToken = localStorage.getItem("jwt_token"); // Get JWT token from localStorage
      if (!jwtToken) {
        throw new Error("JWT token not found. Please log in again.");
      }

      console.log("Fetching unassociated cows for farmerId:", farmerId); // Log fetch attempt

      const response = await fetch(
        `http://localhost:8000/api/cow/unassociated/${farmerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${jwtToken}`, // Use JWT token for authorization
            "Content-Type": "application/json", // Optional: set content type if needed
          },
        }
      );

      // Handle 404 status explicitly to avoid throwing an error
      if (response.status === 404) {
        console.log("No unassociated cows found.");
        setUnassociatedCows([]); // Set empty array when no cows are found
        return; // Do nothing further
      }

      if (!response.ok) {
        throw new Error(
          `Failed to fetch unassociated cows: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched unassociated cows:", data); // Log the entire response for debugging

      // Now referencing 'unassociatedCows' in the response
      if (data && Array.isArray(data.unassociatedCows)) {
        setUnassociatedCows(data.unassociatedCows); // Set unassociated cows
      } else {
        setUnassociatedCows([]); // Handle the case where unassociatedCows is not present
        console.warn("No unassociated cows found or invalid response format");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching unassociated cows:", err); // Log the error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const farmerId = localStorage.getItem("farmer_id"); // Retrieve farmerId from local storage
    console.log("Current farmerId:", farmerId); // Log the farmerId to check if it is null or valid

    // Only fetch cows if farmerId is valid and has not been fetched yet
    if (farmerId) {
      fetchCows(farmerId); // Fetch cows with the farmerId
      fetchUnassociatedCows(farmerId); // Fetch unassociated cows with the farmerId
    } else {
      console.log("farmerId is null or undefined, skipping fetch"); // Log if farmerId is invalid
      setLoading(false); // Stop loading if farmerId is invalid
    }

    // Cleanup function to reset the fetched state when component unmounts
    return () => {
      hasFetched.current = false; // Reset fetching state on unmount
    };
  }, []); // No dependencies; runs once when the component mounts

  // Function to add a cow to the user's list
  const addCow = async (name, breed, age, birthday) => {
    const farmerId = localStorage.getItem("farmer_id"); // Retrieve farmerId from local storage
    const jwtToken = localStorage.getItem("jwt_token"); // Get JWT token from localStorage

    if (!name || !breed || !age || !farmerId || !birthday) {
      throw new Error("Name, breed, age, birthday and farmerId are required"); // Validate inputs
    }

    try {
      const response = await fetch("http://localhost:8000/api/cow/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Use JWT token for authorization
          "Content-Type": "application/json", // Set content type
        },
        body: JSON.stringify({ name, breed, age, farmerId, birthday }), // Include cow data in the request body
      });

      if (!response.ok) {
        throw new Error(
          `Failed to add cow: ${response.status} ${response.statusText}`
        ); // Handle response error
      }

      const data = await response.json();
      console.log("Add cow response:", data); // Log the response

      // Optionally, refetch the cows to get the updated list
      hasFetched.current = false; // Reset fetching state to allow refetching
      await fetchCows(farmerId); // Re-fetch cows with the farmerId

      return data; // Return the response data
    } catch (error) {
      console.error("Error adding cow:", error.message); // Log error message
      throw error; // Rethrow the error for further handling
    }
  };

  const deleteCows = async (cowIds) => {
    const jwtToken = localStorage.getItem("jwt_token"); // Get JWT token from localStorage
    const farmerId = localStorage.getItem("farmer_id"); // Retrieve farmerId from local storage
  
    if (!cowIds || cowIds.length === 0) {
      throw new Error("cowIds are required"); // Validate inputs
    }
  
    if (!farmerId) {
      throw new Error("farmerId is required"); // Ensure farmerId is present
    }
  
    // Format the payload correctly without nesting cowIds
    const payload = {
      cowIds: cowIds, // Array of cow IDs
      farmerId: farmerId, // Single farmer ID
    };
  
    console.log("Payload being sent:", JSON.stringify(payload)); // Log the request payload
  
    try {
      const response = await fetch("http://localhost:8000/api/cow/delete", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Use JWT token for authorization
          "Content-Type": "application/json", // Set content type
        },
        body: JSON.stringify(payload), // Send payload with cowIds array and farmerId
      });
  
      if (!response.ok) {
        throw new Error(
          `Failed to delete cows: ${response.status} ${response.statusText}`
        ); // Handle response error
      }
  
      const data = await response.json();
      console.log("API Response:", data); // Log the API response
  
      // Optionally, refetch the cows to get the updated list
      hasFetched.current = false; // Reset fetching state to allow refetching
      await fetchCows(farmerId); // Re-fetch cows
  
      return data; // Return the response data
    } catch (error) {
      console.error("Error deleting cows:", error.message); // Log error message
      throw error; // Rethrow the error for further handling
    }
  };
  
  
  return { cows, unassociatedCows, deleteCows, loading, error, addCow }; // Return unassociatedCows along with other states
};

export default useCows;
