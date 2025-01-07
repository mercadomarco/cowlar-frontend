import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const useCowHistory = (filters = {}, limit = 10) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false); // Track if data has been fetched

  useEffect(() => {
    const fetchHistory = async () => {
      if (hasFetched.current) {
        console.log('Data already fetched, skipping fetch'); // Log if data has already been fetched
        return; // Skip fetching if data has already been fetched
      }

      const farmerId = localStorage.getItem('farmer_id');
      if (!farmerId) {
        console.error('Farmer ID not found');
        setError('Farmer ID not found');
        setLoading(false);
        return;
      }

      console.log('Starting fetch for cow history with filters:', filters); // Log filters before fetch

      setLoading(true);
      setError(null);

      try {
        const jwtToken = localStorage.getItem('jwt_token');
        const response = await axios.get(
          `http://localhost:8000/api/history/all/${farmerId}`,
          {
            params: { ...filters, limit },
            headers: { Authorization: `Bearer ${jwtToken}` },
          }
        );

        console.log('Response received:', response.data); // Log full response
        setHistory(response.data.history || []);
        hasFetched.current = true; // Mark data as fetched
        console.log('Cow history fetched successfully:', response.data.history.length); // Log the number of fetched records
      } catch (err) {
        console.error('Error fetching cow history:', err.response?.data || err.message); // Log error message
        setError(err.response?.data?.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
        console.log('Fetch operation completed, loading state set to false');
      }
    };

    fetchHistory();
  }, []); // Only run this effect once, on initial mount

  return { history, loading, error };
};

export default useCowHistory;
