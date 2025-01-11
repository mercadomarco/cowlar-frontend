import axios from 'axios';

const getCoordinates = async (region) => {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: region,
        key: '78c8bafbea4043c09d2d30ab6739d6d5',
        limit: 1
      }
    });

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return [lat, lng];
    }
  } catch (err) {
    console.error("Error fetching coordinates:", err.message);
  }
  
  return [0, 0]; // Default or error coordinates
};

export default getCoordinates;
