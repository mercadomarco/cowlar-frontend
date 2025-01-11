import { useState, useEffect } from "react";
import axios from "axios";

const useUserProfile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profileImageUrl: "",
    farmerId: "", // Added farmerId to the state
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const jwtToken = localStorage.getItem("jwt_token"); // Get JWT token from localStorage
        const response = await axios.get(
          "http://localhost:8000/api/auth/current-farmer",
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`, // Use JWT token for authorization
            },
          }
        );

        // Log the fetched data for debugging
        console.log("Fetched user profile data:", response.data);

        // Extract farmerId from the response
        const { farmerId, email, first_name, last_name } = response.data.farmer;

        // Save farmerId to localStorage
        localStorage.setItem('farmer_id', farmerId); // Save farmerId to localStorage
        console.log("Saved farmerId to localStorage:", farmerId); // Log the saved farmerId

        // Update the profile state with values from the response
        setProfile({
          firstName: first_name,
          lastName: last_name,
          email: email,
          profileImageUrl: response.data.farmer.profileImageUrl || "", // Ensure profileImageUrl is handled
          farmerId: farmerId, // Add farmerId to profile
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError(error);
      }
    };

    fetchUserProfile();
  }, []);

  return { profile, error };
};

export default useUserProfile;
