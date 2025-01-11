import { useState, useEffect } from 'react';

const useAuthForm = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openLoginModal = () => {
    setLoginOpen(true);
    setRegisterOpen(false);
  };

  const openRegisterModal = () => {
    setRegisterOpen(true);
    setLoginOpen(false);
  };

  const handleCloseModal = () => {
    setLoginOpen(false);
    setRegisterOpen(false);
  };

  return {
    scrolled,
    isLoginOpen,
    isRegisterOpen,
    openLoginModal,
    openRegisterModal,
    handleCloseModal,
  };
};

export default useAuthForm;
