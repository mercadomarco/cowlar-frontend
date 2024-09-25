import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (emailError || passwordError) {
      setError('Please fix the errors before submitting');
      return;
    }
    setLoading(true);
  
    try {
      const response = await axios.post('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/auth/login', { email, password });
      console.log('Login successful:', response);
  
      localStorage.setItem('sessionId', response.data.sessionId);
  
      setTimeout(() => {
        setLoading(false);
        navigate('/Dashboard');
      }, 4000);
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Login failed');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);

      return () => clearTimeout(timer); 
    }
  }, [error]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    error,
    loading,
    handleLogin,
  };
};

export default useLogin;
