import React from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import Malarejes from '../../Assests/malarejes.png';
import Salvaleon from '../../Assests/salvaleon.jpg';
import Mission from '../../Assests/mission.png';

const Team = () => {
  return (
    <TeamSection>
      <TeamHeading>Meet Our Team</TeamHeading>
      <TeamList>
        <TeamMember>
          <MemberImageContainer>
            <MemberImage src={Malarejes} alt="Programmer" />
          </MemberImageContainer>
          <MemberName>John Stephen Malarejes</MemberName>
          <MemberRole>Programmer</MemberRole>
          <MemberDescription>
          As an aspiring web developer, I'm a quiet person who enjoys exploring new technologies and diving into gaming. My curiosity and passion for learning drive me to seek out new experiences and challenges.
          </MemberDescription>
          <SocialIcons>
            <a href="https://web.facebook.com/johnstephen.malarejes/"><FaFacebookF /></a>
            <a href="https://www.instagram.com/jtepen.m/"><FaInstagram /></a>
          </SocialIcons>
        </TeamMember>
        <TeamMember>
          <MemberImageContainer>
            <MemberImage src={Salvaleon} alt="Documentator" />
          </MemberImageContainer>
          <MemberName>Vanesa Bea Salvaleon</MemberName>
          <MemberRole>Documentator</MemberRole>
          <MemberDescription>
          An aspiring and ambitious individual driven by a strong desire to turn dreams into reality. I am a simple person, and God-fearing with a deep passion of music residing in the town of Valencia .
          </MemberDescription>
          <SocialIcons>
            <a href="https://web.facebook.com/beavanesa.salvaleon"><FaFacebookF /></a>
            <a href="https://www.instagram.com/vanesaxer/"><FaInstagram /></a>
          </SocialIcons>
        </TeamMember>
        <TeamMember>
          <MemberImageContainer>
            <MemberImage src={Mission} alt="System Analyst" />
          </MemberImageContainer>
          <MemberName>Joseph Mission</MemberName>
          <MemberRole>System Analyst</MemberRole>
          <MemberDescription>
          I take pride in creating visual solutions that effectively communicate ideas, always aiming to blend creativity with practicality to support our team's goals.
          </MemberDescription>
          <SocialIcons>
            <a href="https://web.facebook.com/gatzukeshimei.missionianmission"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
          </SocialIcons>
        </TeamMember>
      </TeamList>
    </TeamSection>
  );
};

export default Team;

const TeamSection = styled.section`
  padding: 60px 20px;
  background-color: #ffffff;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
`;

const TeamHeading = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 40px;
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

const TeamList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 100px;
`;

const TeamMember = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  height: auto;
  text-align: center;

`;

const MemberImageContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid #121481;
  margin-bottom: 15px;
  margin-top: 40px;
`;

const MemberImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MemberName = styled.h3`
  font-size: 1.2rem;
  color: #333;
  font-weight: 400;
  margin-bottom: 20px;
`;

const MemberRole = styled.p`
  font-size: 1rem;
  color:  #f39c12;
  font-weight: 400;
  margin-bottom: 20px;
`;

const MemberDescription = styled.p`
  font-size: 0.9rem;
  color: #777;
  font-weight: 400;
  margin-bottom: 25px;
  line-height: 24px;
  font-family: 'Lora';
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 20px;

  a {
    color: #333;
    font-size: 1.2rem;
    transition: color 0.3s ease;

    &:hover {
      color: #121481;
    }
  }
`;
