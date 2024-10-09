import React from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring'; 
import Background from '../../Assests/cow2.jpg';
import useAuthForm from '../../Hooks/AuthenticationHooks/useAuthForm';
import LoginModal from '../LoginModal';
import RegisterModal from '../RegisterModal';

const Hero = () => {
  const { 
    isLoginOpen,
    isRegisterOpen,
    openLoginModal,
    openRegisterModal,
    handleCloseModal,
  } = useAuthForm();

  // Define spring animations
  const contentAnimation = useSpring({
    opacity: 1,
    marginTop: 0,
    from: { opacity: 0, marginTop: -100 },
    config: { duration: 1000 },
  });

  return (
    <>
      <HeroSection style={{ backgroundImage: `url(${Background})` }}>
        <ContentContainer style={contentAnimation}>
          <HeroHeading>CowLar Virtual Geofence</HeroHeading>
          <HeroSubheading>Track and manage your cows realtime.</HeroSubheading>
          <CTAButton onClick={openLoginModal}>Get Started</CTAButton>
        </ContentContainer>
      </HeroSection>
      <LoginModal isOpen={isLoginOpen} onClose={handleCloseModal} openRegisterModal={openRegisterModal} />
      <RegisterModal isOpen={isRegisterOpen} onClose={handleCloseModal} openLoginModal={openLoginModal} />
    </>
  );
}

export default Hero;

const HeroSection = styled.section`
  position: relative;
  padding: 80px 20px;
  height: 100vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Poppins';
  color: #333;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }
`;

const ContentContainer = styled(animated.div)`
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin-left: 50px;
  text-align: left;
`;

const HeroHeading = styled.h1`
  font-size: 4.5rem;
  font-weight: 400;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

const HeroSubheading = styled.p`
  font-size: 1.3rem;
  margin-bottom: 40px;
  color: #ddd;
  font-family: 'Lora';
  max-width: 700px;
  font-weight: 400;
  line-height: 28px;
`;

const CTAButton = styled.button`
  padding: 15px 40px;
  font-size: 0.9rem;
  font-family: 'Poppins';
  color: #fff;
  font-weight: 500;
  text-transform: uppercase;
  background-color:  #f39c12;
  border: none;
  cursor: pointer;
`;

