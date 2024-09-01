import React from 'react';
import CowMap from '../components/CowMap';
import CowList from '../components/CowList';
import Header from '../components/Header';
import useWebSocket from '../hooks/useWebSocket';
import '../styles/App.css';

const HomePage = () => {
  const { cowData } = useWebSocket(); // Only getting cowData

  // Determine current location from cowData if available
  const currentLocation = cowData.length > 0 
    ? {
        latitude: cowData[0].latitude,
        longitude: cowData[0].longitude
      } 
    : undefined;

  console.log('Cow Data:', cowData); // Debugging
  console.log('Current Location:', currentLocation); // Debugging

  return (
    <div className="home-page">
      <Header />
      <CowMap cowData={cowData} currentLocation={currentLocation} />
      <CowList cowData={cowData} currentLocation={currentLocation} />
    </div>
  );
};

export default HomePage;
