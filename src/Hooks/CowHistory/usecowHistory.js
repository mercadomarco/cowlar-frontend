import { useState, useEffect } from 'react';
import axios from 'axios';

const useCowHistory = (filters = {}) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const farmerId = localStorage.getItem('farmer_id'); // Get Farmer ID from localStorage

      if (!farmerId) {
        console.error('Farmer ID not found');
        setError('Farmer ID not found');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const jwtToken = localStorage.getItem('jwt_token');
        const response = await axios.get(`http://localhost:8000/api/history/all/${farmerId}`, {
          params: filters,
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        setHistory(response.data.history || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [filters]);

  return { history, loading, error };
};

export default useCowHistory;
