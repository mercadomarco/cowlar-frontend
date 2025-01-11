import React from 'react';
import styled from 'styled-components';
import { FaFeather, FaUsers, FaListAlt } from 'react-icons/fa';

const Features = () => {
  return (
    <FeaturesSection>
      <FeaturesHeading>Key Features</FeaturesHeading>
      <FeaturesList>
        <FeatureItem>
          <IconContainer>
            <FaFeather />
          </IconContainer>
          <Title>Accurate Bird Counting</Title>
          <FeatureDescription>
            Support advanced algorithms to precisely count birds in various habitats.
          </FeatureDescription>
        </FeatureItem>
        <FeatureItem>
          <IconContainer>
            <FaUsers />
          </IconContainer>
          <Title>Community Contributions</Title>
          <FeatureDescription>
            Collaborate with other bird enthusiasts to share and verify sightings.
          </FeatureDescription>
        </FeatureItem>
        <FeatureItem>
          <IconContainer>
            <FaListAlt />
          </IconContainer>
          <Title>Bird List</Title>
          <FeatureDescription>
            Maintain and explore a comprehensive list of bird species.
          </FeatureDescription>
        </FeatureItem>
      </FeaturesList>
    </FeaturesSection>
  );
}

export default Features;

const FeaturesSection = styled.section`
  padding: 60px 20px;
  background-color: #fffffff;
  height: 100vh;
`;

const FeaturesHeading = styled.h2`
  position: relative;
  text-align: center;
  font-size: 2.8rem;
  margin-bottom: 50px;
  color: #2c3e50;
  font-family: 'Poppins', sans-serif;
  font-weight: 400;

  &::before,
  &::after {
    content: "";
    width: 60px;
    height: 4px;
    background-color:  #f39c12;
    display: inline-block;
    box-sizing: border-box;
  }

  &::before {
    margin: 0 15px 10px 0;
  }

  &::after {
    margin: 0 0 10px 15px;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 60px;

`;

const FeatureItem = styled.li`
  background-color: #fff;
  padding: 30px;
  border-radius: 15px;
  width: 300px;
  height: 380px;
  // box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  // transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

`;

const IconContainer = styled.div`
  width: 100px;
  height: 100px;
  background-color: #121481;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 20px auto;

  svg {
    font-size: 2.5rem;
    color: #fff;
  }
`;

const Title = styled.p`

font-weight: 600;
color: #121481;
font-size: 1.4rem;
margin-bottom: 10px;

`
const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: #333;
  line-height: 24px;
  font-family: 'Lora';
`;
