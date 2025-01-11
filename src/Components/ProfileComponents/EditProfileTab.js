import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { IoIosAddCircle } from "react-icons/io";
import useUserProfile from '../../Hooks/ProfileNavbarHooks/useUserProfile';

const EditProfileTab = () => {
  const { profile } = useUserProfile();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch profile details when the profile data is available
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullname || ''); // Adjust to match backend
      setEmail(profile.email || '');
      setImagePreview(profile.profileImageUrl || 'default-profile.jpg');
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append('fullName', fullName); // Adjust if necessary
    formData.append('email', email);
    if (selectedImage) formData.append('profileImage', selectedImage);

    try {
      const sessionId = localStorage.getItem('sessionId');
      await axios.post('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/auth/updateProfile', formData, {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <ProfileEditForm>
      <ImageWrapper>
        <CameraIcon>
          <label htmlFor="imageInput">
            <IoIosAddCircle size={30} />
          </label>
          <ImageInput id="imageInput" type="file" onChange={handleImageChange} />
        </CameraIcon>
        <ProfileImage src={imagePreview} alt="Profile" />
      </ImageWrapper>

      <Label htmlFor="fullNameInput">Full Name</Label>
      <InputField
        id="fullNameInput"
        type="text"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      
      <Label htmlFor="emailInput">Email</Label>
      <InputField
        id="emailInput"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <SaveButton onClick={handleProfileUpdate}>Save Changes</SaveButton>
    </ProfileEditForm>
  );
};

export default EditProfileTab;

const ProfileEditForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  position: relative;
`;

const CameraIcon = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
  label {
    cursor: pointer;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border: 4px solid #121481;
  border-radius: 50%;
  object-fit: cover;
`;

const ImageInput = styled.input`
  display: none; // Hides the default file input
`;

const Label = styled.label`
  width: 90%;
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 5px;
`;

const InputField = styled.input`
  width: 90%;
  padding: 10px;
  font-family: 'Poppins';
  font-size: 0.8rem;
  margin-bottom: 15px;
  border-radius: 5px;
  box-sizing: border-box;
  border: 1px solid #ccc;

  &:focus {
    border-color: #121481;
    outline: none;
  }
`;

const SaveButton = styled.button`
  padding: 10px 20px;
  background-color: #121481;
  font-family: 'Poppins';
  color: white;
  font-size: 0.8rem;
  width: 90%;
  border: none;
  border-radius: 25px;
  margin-top: 10px;
  cursor: pointer;
  &:hover {
    background-color: #121482;
  }
`;
