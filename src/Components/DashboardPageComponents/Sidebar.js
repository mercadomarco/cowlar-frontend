import React, { useState } from "react";
import styled from "styled-components";
import {
  FaHistory,
  FaLock,
  FaLocationArrow,
  FaHatCowboy,
} from "react-icons/fa";
import Logo from "../../Assests/cowlogo.png";

const Sidebar = ({ onSelect }) => {
  const [selectedItem, setSelectedItem] = useState(""); // Track selected item
  const [showGeofenceOptions, setShowGeofenceOptions] = useState(false); // Toggle for Geofence options

  const handleSelect = (item) => {
    setSelectedItem(item);
    onSelect(item); // Pass the selected item to the parent if necessary
  };

  const toggleGeofenceOptions = () => {
    setShowGeofenceOptions(!showGeofenceOptions); // Toggle visibility of Geofence options
  };

  return (
    <SidebarContainer>
      <LogoContainer>
        <LogoImage src={Logo} alt="logo" />
      </LogoContainer>
      <NavItems>
        <NavItem
          onClick={toggleGeofenceOptions} // Toggle sub-options when Geofence is clicked
        >
          <FaLock className="icon" />
          Geofence
        </NavItem>
        {showGeofenceOptions && (
          <SubNavItems>
            <SubNavItem
              onClick={() => handleSelect("GeofenceMap")}
              $isSelected={selectedItem === "GeofenceMap"}
            >
              Fence
            </SubNavItem>
            <SubNavItem
              onClick={() => handleSelect("Geofence")}
              $isSelected={selectedItem === "Geofence"}
            >
              Modify Geofence
            </SubNavItem>
          </SubNavItems>
        )}
        <NavItem
          onClick={() => handleSelect("Cows")}
          $isSelected={selectedItem === "Cows"}
        >
          <FaHatCowboy className="icon" />
          Cows
        </NavItem>
        <NavItem
          onClick={() => handleSelect("CowsLocation")}
          $isSelected={selectedItem === "CowsLocation"}
        >
          <FaLocationArrow className="icon" />
          Cows Locations
        </NavItem>
        <NavItem
          onClick={() => handleSelect("History")}
          $isSelected={selectedItem === "History"}
        >
          <FaHistory className="icon" />
          History
        </NavItem>
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
  font-family: "Poppins", sans-serif;
  font-size: 0.875rem;
  line-height: 1.57;
  color: ${(props) => (props.$isSelected ? " #121481" : "#333")};
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s, color 0.3s;
  border-left: ${(props) =>
    props.$isSelected ? "6px solid #121481" : "6px solid transparent"};

  &:hover {
    background-color: rgba(70, 128, 255, 0.08);
    color: #121481;
  }

  .icon {
    margin-right: 10px;
    font-size: 1.1rem;
    color: ${(props) => (props.$isSelected ? " #121481" : "#333")};
  }
`;

const SubNavItems = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-left: 20px; /* Indent the sub-items */
  transition: max-height 0.3s ease-out;
`;

const SubNavItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 10px;
  font-family: "Poppins", sans-serif;
  font-size: 0.875rem;
  line-height: 1.57;
  color: ${(props) => (props.$isSelected ? " #121481" : "#333")};
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: rgba(70, 128, 255, 0.08);
    color: #121481;
  }

  .icon {
    margin-right: 10px;
    font-size: 1.1rem;
    color: ${(props) => (props.$isSelected ? " #121481" : "#333")};
  }
`;
