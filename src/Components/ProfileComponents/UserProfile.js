import React from 'react';
import styled from 'styled-components';
import useUserProfile from '../../Hooks/ProfileNavbarHooks/useUserProfile';
import useBirdCounts from '../../Hooks/BirdCounts/useGetBirdCount';

const UserProfile = ({ onSelectContent }) => {
  const { profile, error: profileError } = useUserProfile();
  const { birdCounts, error: birdCountsError, loading } = useBirdCounts();

  if (profileError) {
    return <ErrorContainer>Error loading profile: {profileError.message}</ErrorContainer>;
  }

  if (birdCountsError) {
    return <ErrorContainer>Error loading bird counts: {birdCountsError.message}</ErrorContainer>;
  }

  if (loading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

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
              <Fullname>{profile?.fullname || 'Full Name'}</Fullname>
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

      <HistoryContainer>
        <HistoryTitle>Bird Count History</HistoryTitle>
        <HistoryTable>
          <thead>
            <tr>
              <th>Image</th>
              <th>Count</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {birdCounts.length > 0 ? (
              birdCounts.map((record) => (
                <tr key={record.id}>
                  <td>
                    <ProductImage src={`https://ibon-server-0c0c6dfbe0a0.herokuapp.com/${record.image_path}`} alt="Bird Count" />
                  </td>
                  <td>{record.bird_count}</td>
                  <td>{new Date(record.created_at).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No bird count records found.</td>
              </tr>
            )}
          </tbody>
        </HistoryTable>
      </HistoryContainer>
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
`

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

const HistoryContainer = styled.div`
  margin-top: 40px;
`;

const HistoryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
`;

const HistoryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #ccc;
  overflow: hidden;

  th, td {
    padding: 15px;
    text-align: left;
  }

  th {
    background-color: #f1f1f1;
    font-weight: 600;
    border-bottom: 1px solid #ccc;
    color: #333;
  }

  tbody tr {
    border-bottom: 1px solid #ccc;
  }

  tbody tr:hover {
    background-color: #f9f9f9;
  }
`;
const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  background-color: #f8d7da;
  color: #842029;
  border-radius: 8px;
`;

const LoadingContainer = styled.div`
  padding: 20px;
  background-color: #e9ecef;
  color: #495057;
  border-radius: 8px;
`;
