import { useState, useEffect } from 'react';
import axios from 'axios';

const useBirdCounts = () => {
    const [birdCounts, setBirdCounts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBirdCounts = async () => {
            try {
                const sessionId = localStorage.getItem('sessionId');
                const response = await axios.get('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/count/birdCount', {
                    headers: {
                        Authorization: `Bearer ${sessionId}`,
                    },
                });
                console.log('API Response:', response); // Log the entire response
                
                // Access the correct data path based on your response structure
                if (response.data && Array.isArray(response.data.data)) {
                    setBirdCounts(response.data.data[0]); // Set bird counts from the first array in the response data
                } else {
                    console.error('Unexpected response structure:', response);
                }
            } catch (error) {
                console.error('Error fetching bird counts:', error); // Log the error
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchBirdCounts();
    }, []);

    return { birdCounts, error, loading };
};

export default useBirdCounts;
