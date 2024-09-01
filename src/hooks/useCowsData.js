//hooks/useCowData.js

import { useEffect, useState } from 'react';
import { fetchCows } from '../services/apiService';

const useCowsData = () => {
  const [cows, setCows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const cowData = await fetchCows();
      setCows(cowData);
    };

    fetchData();
  }, []);

  return cows;
};

export default useCowsData;
