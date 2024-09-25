import React, { useState } from 'react';
import styled from 'styled-components';
import useUserProfile from '../../Hooks/ProfileNavbarHooks/useUserProfile';
import { FaSignOutAlt } from 'react-icons/fa';
import { RiAccountCircleFill } from "react-icons/ri";
import useLogout from '../../Hooks/LogoutHooks/useLogout';
import ConfirmationModal from '../ConfirmationModal';

const ProfileNavbar = ({ onSelectContent }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const logout = useLogout();
  const { profile } = useUserProfile();

  const handleLogout = () => {
    setModalOpen(true);
  };

  const confirmLogout = () => {
    setModalOpen(false);
    logout();
  }

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleViewProfile = () => {
    onSelectContent('UserProfile'); 
    setDropdownOpen(false);
  };

  return (
    <NavbarContainer>
      <div>
        <ImageCircle  src={profile?.profileImageUrl || 'default-profile.jpg'} alt="Profile"  onClick={toggleDropdown} />
        <DropdownMenu $isOpen={dropdownOpen}>
          <UserInfo>
            <Fullname>{profile.fullname}</Fullname>
            <Email>{profile.email}</Email>
          </UserInfo>
          <DropdownItem onClick={handleViewProfile}>
            <ItemIcon><RiAccountCircleFill /></ItemIcon> View Profile
          </DropdownItem>
          <DropdownItem onClick={handleLogout}>
            <ItemIcon><FaSignOutAlt /></ItemIcon> Logout
          </DropdownItem>
        </DropdownMenu>
      </div>
      <ConfirmationModal 
        isOpen={isModalOpen} 
        onRequestClose={() => setModalOpen(false)} 
        onConfirm={confirmLogout} 
        message="Are you sure you want to logout?" 
      />
    </NavbarContainer>
  );
};

export default ProfileNavbar;

const NavbarContainer = styled.div`
  position: fixed; 
  top: 0; 
  left: 0; 
  right: 0; 
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #ffffff;
  height: 80px;
  z-index: 999; 
  border-bottom: 1px solid rgb(190, 200, 208);
`;

const ImageCircle = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 15px;
`;

const Fullname = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;
const Email = styled.p`
color: #666;
font-size: 0.8rem;
margin: 0;
font-style: italic;
`
const DropdownMenu = styled.div`
  position: absolute;
  top: 60px;
  right: 10px;
  font-family: 'Poppins', sans-serif;
  background-color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  padding: 15px;
  width: 220px;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};  // Use $ prefix for transient props
  z-index: 1000;
  animation: fadeIn 0.3s ease-in-out; 
`;

const UserInfo = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eaeaea;
  margin-bottom: 10px;
`;

const DropdownItem = styled.div`
  padding: 12px 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.85rem;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #f0f0f0; 
  }
`;

const ItemIcon = styled.span`
  margin-right: 12px;
  font-size: 20px;
  display: flex;
  align-items: center;
`;