import React, {useRef}from 'react';
import Hero from '../Components/LandingPageComponents/Hero';
import Features from '../Components/LandingPageComponents/Features';
import HowItWorks from '../Components/LandingPageComponents/HowItWorks';
import Navbar from '../Components/LandingPageComponents/Navbar';
import Team from '../Components/LandingPageComponents/TeamMembers';
import About from '../Components/LandingPageComponents/About';
import styled from 'styled-components';

const LandingPage = () => {
    const heroRef = useRef(null);
    const featuresRef = useRef(null);
    const howItWorksRef = useRef(null);
    const teamsRef = useRef(null);
    const aboutRef = useRef(null);
  
    const scrollToSection = (sectionRef) => {
      if (sectionRef.current) {
        sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    };

  return (
    <HomePageContainer>
      <Navbar 
        scrollToSection={scrollToSection} 
        refs={{ heroRef, featuresRef, howItWorksRef, teamsRef, aboutRef, }} 
      />
     <Section ref={heroRef}>
        <Hero />
      </Section>
      {/* <Section ref={featuresRef}>
        <Features />
      </Section>
      <Section ref={howItWorksRef}>
        <HowItWorks />
      </Section>
      <Section ref={teamsRef}>
        <Team />
      </Section>
      <Section ref={aboutRef}>
        <About />
      </Section> */}
    </HomePageContainer>
  );
}

export default LandingPage;

const HomePageContainer = styled.div`
overflow-x: hidden;
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Section = styled.div`
  width: 100%;
  box-sizing: border-box;
`;
