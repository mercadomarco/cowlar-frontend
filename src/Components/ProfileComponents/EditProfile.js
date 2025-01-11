import React, { useState } from 'react';
import styled from 'styled-components';
import EditProfileTab from './EditProfileTab';
import EditPasswordTab from './EditPasswordTab';

const EditProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <EditContainer>
      <TabContainer>
        <TabButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
          Edit Profile
        </TabButton>
        <TabButton active={activeTab === 'password'} onClick={() => setActiveTab('password')}>
          Edit Password
        </TabButton>
      </TabContainer>
      {activeTab === 'profile' && <EditProfileTab />}
      {activeTab === 'password' && <EditPasswordTab />}
    </EditContainer>
  );
};

export default EditProfile;

const EditContainer = styled.div`
  max-width: 400px;
  margin: 100px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #e0e0e0;
`;

const TabButton = styled.button`
  flex: 1;
  padding: 10px;
  font-family: 'Poppins';
  background-color: transparent;
  color: ${({ active }) => (active ? '#121481' : 'black')};
  font-weight: 600;
  border: none;
  font-size: 1.1rem;
  border-bottom: ${({ active }) => (active ? '4px solid #121481' : '4px solid transparent')};
  cursor: pointer;
  transition: border-bottom 0.3s ease, color 0.3s ease;

  &:hover {
    color: #121481;
  }
`;
