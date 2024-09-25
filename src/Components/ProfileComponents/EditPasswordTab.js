import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const EditPasswordTab = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordUpdate = async () => {
    try {
      const sessionId = localStorage.getItem('sessionId');
      await axios.post('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/auth/updatePassword', {
        oldPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${sessionId}`,
        },
      });
      alert('Password updated successfully');
    } catch (error) {
      alert('Error updating password');
    }
  };

  return (
    <PasswordEditForm>
      <Label htmlFor="oldPassword">Old Password</Label>
      <InputField
        id="oldPassword"
        type="password"
        placeholder="Enter Old Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      
      <Label htmlFor="newPassword">New Password</Label>
      <InputField
        id="newPassword"
        type="password"
        placeholder="Enter New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      
      <SaveButton onClick={handlePasswordUpdate}>Save Password</SaveButton>
    </PasswordEditForm>
  );
};

export default EditPasswordTab;

const PasswordEditForm = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Label = styled.label`
  width: 90%;
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 5px;
  text-align: left;
`;

const InputField = styled.input`
  width: 90%;
  padding: 10px;
  margin-bottom: 15px;
  font-family: 'Poppins';
  font-size: 0.8rem;
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
  margin-top: 10px;
  border-radius: 25px;
  cursor: pointer;
  &:hover {
    background-color: #121482;
  }
`;
