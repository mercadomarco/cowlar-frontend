import React from 'react';
import styled from 'styled-components';
import Lottie from 'lottie-react';
import Signup from '../../Assests/signup.jpg';
import Upload from '../../Assests/upload.jpg';
import Result from '../../Assests/result.jpg';
import ArrowAnimation from '../../Animations/Arrow.json'; 

const HowItWorks = () => {
  return (
    <HowItWorksSection>
      <HowItWorksHeading>How It Works</HowItWorksHeading>
      <Steps>
        <Step>
          <img src={Signup} alt="Sign Up" />
          <Title>Sign Up</Title>
          <StepDescription>Create an account to start using the platform and track bird sightings.</StepDescription>
        </Step>
        <Arrow>
          <Lottie animationData={ArrowAnimation} />
        </Arrow>
        <Step>
          <img src={Upload} alt="Upload Image" />
          <Title>Upload Image</Title>
          <StepDescription>Upload your bird images to identify and count different species.</StepDescription>
        </Step>
        <Arrow>
          <Lottie animationData={ArrowAnimation} />
        </Arrow>
        <Step>
          <img src={Result} alt="View Results" />
          <Title>View Results</Title>
          <StepDescription>See detailed results including bird species, count, and more.</StepDescription>
        </Step>
      </Steps>
    </HowItWorksSection>
  );
};

export default HowItWorks;

const HowItWorksSection = styled.section`
  text-align: center;
  padding: 60px 20px;
  background-color: #f4f7f6; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
`;

const HowItWorksHeading = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: #222222; 
  font-weight: 400;
  font-family: 'Poppins', sans-serif;

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
`;

const Steps = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  position: relative; 
`;

const Step = styled.div`
  text-align: center;
  font-size: 1.2rem;
  background-color: #fff;
  padding: 20px;
  width: 250px;
  height: 400px; 
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between; 
  gap: 5px; 
  border-radius: 8px; 
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px; 
  }
`;

const Title = styled.p`
font-weight: 400;
font-size: 1.4rem;
color: #121481;
`

const StepDescription = styled.p`
  font-size: 0.9rem;
  line-height: 24px;
  font-family: 'Lora';
  color: #333;
`;

const Arrow = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
`;

