import React from 'react';
import styled from 'styled-components';
import useUserProfile from '../../Hooks/ProfileNavbarHooks/useUserProfile';

const UserProfile = ({ onSelectContent }) => {
  const { profile, error: profileError } = useUserProfile();

  const handleEditProfile = () => {
    onSelectContent('EditProfile');
  };

  return (
    <MainContainer>
      <TopSection>
        <ProfileContainer>
          <ProfileImage src={profile?.profileImageUrl || 'default-profile.jpg'} alt="Profile" />
          <ProfileDetails>
            <ProfileField>
              <Fullname>
                {profile?.firstName || 'First Name'} {profile?.lastName || 'Last Name'}
              </Fullname>
            </ProfileField>
            <ProfileField>
              <Email>{profile?.email || 'Email Address'}</Email>
            </ProfileField>
          </ProfileDetails>
        </ProfileContainer>
        <ButtonContainer>
          <EditButton onClick={handleEditProfile}>Edit Profile</EditButton>
        </ButtonContainer>
      </TopSection>

      {profileError && (
        <ErrorContainer>
          <p>Error fetching profile: {profileError.message}</p>
        </ErrorContainer>
      )}
    </MainContainer>    
  );
};

export default UserProfile;

const MainContainer = styled.div`
  padding: 30px;
  margin: 100px auto;
  width: 100%;
  box-sizing: border-box;
  background: #ffffff;
  font-family: 'Poppins', sans-serif;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProfileField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Fullname = styled.h2 `
  font-size: 1.4rem;
  color: #333;
  font-weight: 600;
  margin: 0;
`;

const Email = styled.h3`
  font-size: 1rem;
  color: #333;
  font-weight: 200;
  font-style: italic;
  margin: 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const EditButton = styled.button`
  padding: 10px 20px;
  background-color: #121481;
  color: white;
  border: none;
  font-size: 0.9rem;
  width: 150px;
  height: 50px;
  font-family: 'Poppins';
  border-radius: 25px;
  cursor: pointer;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background-color: #f8d7da;
  color: #842029;
  border-radius: 8px;
`;
