import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { FaUpload } from 'react-icons/fa';

// Styled components for styling
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  font-family: 'Poppins';
  height: 100vh;
  box-sizing: border-box;
  margin: auto;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 20px;
  color: #333;
`;

const UploadButton = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  font-size: 24px;
  color: #4CAF50;
  transition: color 0.3s ease;

  &:hover {
    color: #45a049;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const CountButton = styled.button`
  margin: 10px;
  padding: 12px 24px;
  font-size: 0.8rem;
  cursor: pointer;
  font-family: 'Poppins';
  background-color:  #121481;
  color: white;
  border: none;
  box-sizing: borde-box;
  border-radius: 25px;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ImagePreview = styled.img`
  margin-top: 20px;
  width: 90%;
  height: 400px; /* Adjust height as needed */
  width: auto;
  height: auto;
  border: 2px solid #ddd;
  border-radius: 8px;
  object-fit: cover; /* Ensures the image covers the area while maintaining aspect ratio */
`;

const PlaceholderImage = styled.div`
  margin-top: 20px;
  width: 90%;
  height: 300px; /* Adjust height as needed */
  background-color: #f0f0f0;
  border: 2px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 24px;
  text-align: center;
  line-height: 300px; /* Align text vertically */
  font-family: 'Poppins';
`;

const BirdCount = styled.div`
  margin-top: 20px;
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const Loader = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  margin: 20px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CountBirds = () => {
  const [imageFile, setImageFile] = useState(null);
  const [birdCount, setBirdCount] = useState(null);
  const [base64Image, setBase64Image] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Convert image file to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCountClick = async () => {
    if (imageFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('bird_count', birdCount); // Include bird count in the form data
  
      try {
        // First API call to count birds
        const response = await axios.post('https://ac1d-34-80-224-26.ngrok-free.app/count-birds1/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        // Set bird count and image
        const birdCount = response.data.bird_count;
        setBirdCount(birdCount);
        setBase64Image(`data:image/jpeg;base64,${response.data.image}`);
  
        // Retrieve session ID from localStorage
        const sessionId = localStorage.getItem('sessionId');
  
        // Send bird count and image to your backend
        await axios.post(
          'https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/count/birdCount',
          {
            bird_count: birdCount,
            image: `data:image/jpeg;base64,${response.data.image}`, // Ensure the image format matches backend expectations
          },
          {
            headers: {
              Authorization: `Bearer ${sessionId}`,
              'Content-Type': 'application/json', // Specify JSON content type for this request
            },
          }
        );
      } catch (error) {
        console.error('Error counting or saving birds:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    }
  };
  
  
  return (
    <Container>
      <Title>Bird Count</Title>
      {base64Image ? (
        <ImagePreview src={base64Image} alt="Processed" />
      ) : (
        <PlaceholderImage>
          Upload Image
        </PlaceholderImage>
      )}
      <UploadButton>
        <FaUpload />
        <HiddenFileInput type="file" accept="image/*" onChange={handleImageChange} />
      </UploadButton>
      <CountButton onClick={handleCountClick} disabled={loading}>
        {loading ? 'Counting...' : 'Count Birds'}
      </CountButton>
      {loading && <Loader />}
      {birdCount !== null && <BirdCount>Bird Count: {birdCount}</BirdCount>}
    </Container>
  );
};

export default CountBirds;
