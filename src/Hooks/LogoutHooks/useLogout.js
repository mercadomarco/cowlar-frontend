import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');

      await axios.post('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/auth/logout', {}, {
        headers: {
          'Authorization': `Bearer ${sessionId}`
        }
      });
  
  
      localStorage.removeItem('sessionId');
      navigate('/LandingPage');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return logout;
};

export default useLogout;
