import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import LoginModal from '../LoginModal';
import RegisterModal from '../RegisterModal';
import useAuthForm from '../../Hooks/AuthenticationHooks/useAuthForm';

const Navbar = ({ scrollToSection, refs }) => {
  const {
    isLoginOpen,
    isRegisterOpen,
    openLoginModal,
    openRegisterModal,
    handleCloseModal,
  } = useAuthForm();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <NavbarContainer scrolled={scrolled}>
        <Logo scrolled={scrolled}>CowLar</Logo>
        <NavLinks >
          <NavLink scrolled={scrolled} onClick={() => scrollToSection(refs.heroRef)}>Home</NavLink>
          <NavLink scrolled={scrolled} onClick={() => scrollToSection(refs.featuresRef)}>Features</NavLink>
          <NavLink scrolled={scrolled} onClick={() => scrollToSection(refs.howItWorksRef)}>How it Works</NavLink>
          <NavLink scrolled={scrolled} onClick={() => scrollToSection(refs.teamsRef)}>Teams</NavLink>
          <NavLink scrolled={scrolled} onClick={() => scrollToSection(refs.aboutRef)}>About</NavLink>
        </NavLinks>
        <ButtonContainer>
          <LoginButton scrolled={scrolled} onClick={openLoginModal}>LOGIN</LoginButton>
        </ButtonContainer>
      </NavbarContainer>

      <LoginModal isOpen={isLoginOpen} onClose={handleCloseModal} openRegisterModal={openRegisterModal} />
      <RegisterModal isOpen={isRegisterOpen} onClose={handleCloseModal} openLoginModal={openLoginModal} />
    </>
  );
};

export default Navbar;

const NavbarContainer = styled.nav`
  display: flex;
  position: fixed;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 70px;
  padding: 15px 30px;
  -webkit-box-shadow: 0 1px 3px rgba(0, 0, 0, 0.09);
  background-color: ${({ scrolled }) => (scrolled ? '#ffffff' : 'transparent')};
  box-shadow: ${({ scrolled }) => (scrolled ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none')};
  font-family: 'Poppins', sans-serif;
  z-index: 1000;
 
  @media (max-width: 768px) {
    padding: 10px 20px;
  }
`;

const Logo = styled.div`
  font-size: 26px;
  font-weight: 400;
  margin-left: 3.6rem;
  color: ${({ scrolled }) => (scrolled ? '#333' : '#ffffff')};
  cursor: pointer;
`;

const NavLinks = styled.div`
display: flex;
gap: 4rem; /* Reduced gap */
flex: 1; /* Allows NavLinks to take available space */
justify-content: flex-end; /* Center align links if needed */
margin-right: 80px;

`;

const NavLink = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 400;
  color: ${({ scrolled }) => (scrolled ? '#333' : '#ffffff')};
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: #f39c12;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4.6rem;
`;

const LoginButton = styled.button`
  padding: 10px 20px;
  background-color: transparent;
  border-radius: 25px;
  width: 100px;
  font-family: 'Poppins', sans-serif;
  // border: 2px solid #ffffff;
  color: ${({ scrolled }) => (scrolled ? '#333' : '#ffffff')};
  border: ${({ scrolled }) => (scrolled ? '2px solid #333' : '2px solid #ffffff')};
  font-weight: 400;
  cursor: pointer;

  &:hover {
    border: 2px solid #f39c12;
    color: #f39c12;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
  }
`;
