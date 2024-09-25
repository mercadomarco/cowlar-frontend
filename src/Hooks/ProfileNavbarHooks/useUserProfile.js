import { useState, useEffect } from 'react';
import axios from 'axios'; 

const useUserProfile = () => {
  const [profile, setProfile] = useState({ fullname: '', email: '', profileImageUrl: '' });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const sessionId = localStorage.getItem('sessionId');
        const response = await axios.get('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${sessionId}`,
          },
        });

        setProfile({
          fullname: response.data.fullname,
          email: response.data.email,
          profileImageUrl: response.data.profileImageUrl || '', // Ensure profileImageUrl is handled
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError(error);
      }
    };

    fetchUserProfile();
  }, []);

  return { profile, error };
};

export default useUserProfile;
