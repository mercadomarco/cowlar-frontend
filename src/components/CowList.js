import React from 'react';
import '../styles/CowList.css';

const CowList = ({ cowData }) => {
  console.log('Cow List Data:', cowData);

  if (!cowData.length) {
    return <p>No cows available</p>;
  }

  return (
    <div className="cow-list">
      <h2>List of Cows</h2>
      <ul>
        {cowData.map(cow => (
          <li key={cow.cowId}>
            ID: {cow.cowId} - Location: ({cow.latitude}, {cow.longitude}) - Last Seen: {cow.timestamp}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CowList;
