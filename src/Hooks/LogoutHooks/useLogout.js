import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      // Retrieve the JWT token from localStorage
      const jwtToken = localStorage.getItem('jwt_token');

      await axios.post('http://localhost:8000/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${jwtToken}` // Use the JWT token here
        }
      });

      // Remove the JWT token from localStorage
      localStorage.removeItem('jwt_token');
      navigate('/LandingPage'); // Redirect to the landing page after logout
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return logout;
};

export default useLogout;
