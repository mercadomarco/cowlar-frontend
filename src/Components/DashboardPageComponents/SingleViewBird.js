import React from 'react';
import styled from 'styled-components';
import { IoCloseCircleOutline } from "react-icons/io5";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 800px;
  width: 90%;
  display: flex;
  flex-direction: row;
  gap: 20px;
  position: relative; /* Added for positioning the close button */
`;

const BirdImage = styled.img`
  width: 250px;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

const BirdDetails = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BirdName = styled.h2`
  margin: 0 0 10px;
  font-size: 1.5em;
`;

const BirdScientificName = styled.p`
  margin: 0 0 10px;
  font-style: italic;
  color: gray;
`;

const CommonName = styled.p`
  margin: 0 0 10px;
`;

const Family = styled.p`
  margin: 0 0 10px;
`;

const Habitat = styled.p`
  margin: 0 0 10px;
`;

const Region = styled.p`
  margin: 0 0 10px;
`;

const BirdDescription = styled.p`
  margin-top: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  color: #f44336;
  font-size: 1.5rem;
  cursor: pointer;
  &:hover {
    color: #d32f2f;
  }
`;

const BirdModal = ({ bird, onClose }) => {
  if (!bird) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <CloseButton onClick={onClose}>
          <IoCloseCircleOutline />
        </CloseButton>
        <BirdImage src={`http://localhost:8000${bird.photo}`} alt={bird.birdName} />
        <BirdDetails>
          <BirdName>{bird.birdName}</BirdName>
          <BirdScientificName>{bird.scientificName}</BirdScientificName>
          <CommonName><strong>Common Name:</strong> {bird.commonName}</CommonName>
          <Family><strong>Family:</strong> {bird.family}</Family>
          <Habitat><strong>Habitat:</strong> {bird.habitat}</Habitat>
          <Region><strong>Region:</strong> {bird.region}</Region>
          <BirdDescription>{bird.description}</BirdDescription>
        </BirdDetails>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BirdModal;
