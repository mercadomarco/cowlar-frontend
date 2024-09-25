import React from 'react';
import styled from 'styled-components';
// import BirdWatchingImage from '.././Assests/birdWatching.jpg'; 
import BirdWatchingImage from '../../Assests/birdWatching.jpg';

const About = () => {
  return (
    <AboutSection>
      <AboutContent>
      <AboutImageContainer>
          <AboutImage src={BirdWatchingImage} alt="Bird Watching" />
        </AboutImageContainer>
        <AboutTextContainer>
        <AboutHeading>About iBon</AboutHeading>
          <AboutText>
            Welcome to <AboutHighlight>iBon</AboutHighlight>, your go-to platform dedicated to the precise counting of bird species.
            Our mission is to provide birdwatchers and researchers with the most accurate and user-friendly tools to track bird populations
            in various environments.
          </AboutText>
          <AboutText>
            At <AboutHighlight>iBon</AboutHighlight>, we understand the importance of data in bird conservation efforts. By utilizing
            cutting-edge technology, we make it easier than ever to monitor bird species, contribute to scientific research, and
            engage with a global community of bird enthusiasts.
          </AboutText>
          <AboutText>
            Join us in our mission to protect and preserve the world's avian biodiversity. With <AboutHighlight>iBon</AboutHighlight>,
            every bird counts.
          </AboutText>
        </AboutTextContainer>
      </AboutContent>
    </AboutSection>
  );
};

export default About;

const AboutSection = styled.section`
  background-color: #f4f7f6;
  color: #333;
  padding: 60px 20px;
  text-align: center;
  height: 100vh;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 100%;
  font-family: 'Poppins', sans-serif;
`;

const AboutHeading = styled.h2`
  font-size: 3rem;
  margin-bottom: 50px;
  color: #222222;
  font-weight: 400;
`;

const AboutContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;

`;

const AboutTextContainer = styled.div`
  max-width: 600px;
  text-align: left;

  @media (min-width: 768px) {
    max-width: 50%;
  }
`;

const AboutText = styled.p`
  font-size: 1rem;
  line-height: 26px;
  font-weight: 400;
  margin-bottom: 20px;
  font-family: 'Lora';
`;

const AboutHighlight = styled.span`
  color: #f39c12;
  font-weight: bold;
`;

const AboutImageContainer = styled.div`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);

  @media (min-width: 768px) {
    max-width: 50%;
  }
`;

const AboutImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;
