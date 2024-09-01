import React from 'react';
import CowMap from '../components/CowMap';
import CowList from '../components/CowList';
import Header from '../components/Header';
import useWebSocket from '../hooks/useWebSocket';
import '../styles/App.css';

const HomePage = () => {
  const { cowData, currentLocation } = useWebSocket(); // Removed error

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
