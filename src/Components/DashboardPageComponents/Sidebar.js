import React, { useState } from 'react';
import styled from 'styled-components';
import { FaConfluence, FaDove, FaFeather, FaLock, FaUsers } from 'react-icons/fa';
import Logo from '../../Assests/cowlogo.png';
import { FaCow, FaLocationPin } from 'react-icons/fa6';

const Sidebar = ({ onSelect }) => {
  const [selectedItem, setSelectedItem] = useState(''); // Track selected item

  const handleSelect = (item) => {
    setSelectedItem(item);
    onSelect(item); // Pass the selected item to the parent if necessary
  };

  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage src={Logo} alt="logo" />
      </LogoContainer>
      <NavItems>
        <NavItem
          onClick={() => handleSelect('Geofence')}
          $isSelected={selectedItem === 'Geofence'}
        >
          <FaLock className="icon" />
          Geofence
        </NavItem>
        <NavItem
          onClick={() => handleSelect('Cows')}
          $isSelected={selectedItem === 'Cows'}
        >
          <FaCow className="icon" />
          Cows
        </NavItem>
        <NavItem
          onClick={() => handleSelect('CowsLocation')}
          $isSelected={selectedItem === 'CowsLocation'}
        >
        <FaLocationPin className="icon" />
          Cows Locations
        </NavItem>
        <NavItem
          onClick={() => handleSelect('Breaches')}
          $isSelected={selectedItem === 'Breaches'}
        >
        <FaConfluence className="icon" />
          Breaches
        </NavItem>
        {/* <NavItem
          onClick={() => handleSelect('CountBirds')}
          $isSelected={selectedItem === 'CountBirds'} // Use $isSelected for styled-components
        >
          <FaDove className="icon" />
          Count Birds
        </NavItem>
        <NavItem
          onClick={() => handleSelect('BirdSpecies')}
          $isSelected={selectedItem === 'BirdSpecies'}
        >
          <FaFeather className="icon" />
          Bird Species
        </NavItem>
        <NavItem
          onClick={() => handleSelect('CommunityChat')}
          $isSelected={selectedItem === 'CommunityChat'}
        >
          <FaUsers className="icon" />
          Community
        </NavItem> */}
      </NavItems>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  height: 100vh;
  width: 240px;
  background-color: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  border-right: 1px solid rgb(190, 200, 208);
`;

const LogoContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  border-bottom: 2px solid #ffffff;
`;

const LogoImage = styled.img`
  width: 180px;
  height: auto;
`;

const NavItems = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  flex-grow: 1;
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: flex-start;
  width: 100%;
  padding: 10px;
  padding-left: 20px;
  margin-bottom: 10px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.875rem;
  line-height: 1.57;
  color: ${(props) => (props.$isSelected ? ' #121481' : '#333')}; 
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
  border-left: ${(props) => (props.$isSelected ? '6px solid #121481' : '6px solid transparent')}; // Using $isSelected

  &:hover {
    background-color: rgba(70, 128, 255, 0.08);
    color:  #121481;
  }

  .icon {
    margin-right: 10px;
    font-size: 1.1rem;
    color: ${(props) => (props.$isSelected ? ' #121481' : '#333')}; // Using $isSelected
  }
`;
