import { useState } from 'react';

const usePasswordToggle = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return { passwordVisible, togglePasswordVisibility };
};

export default usePasswordToggle;
