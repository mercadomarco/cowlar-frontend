import { useState } from 'react';
import useValidation from '../AuthValidation/useValidation';

const useRegisterForm = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({fullName: '',email: '',password: ''});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [resetButton, setResetButton] = useState(false);

  const { validateFullName, validateEmail, validatePassword } = useValidation();

  const handleFullNameChange = (e) => {
    const value = e.target.value;
    setFullName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      fullName: validateFullName(value)
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: validateEmail(value)
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: validatePassword(value)
    }));
  };

  return {
    fullName,
    email,
    password,
    errors,
    isLoading,
    isSuccess,
    showSpinner,
    resetButton,
    setFullName,
    setEmail,
    setPassword,
    setErrors,
    setIsLoading,
    setIsSuccess,
    setShowSpinner,
    setResetButton,
    handleFullNameChange,
    handleEmailChange,
    handlePasswordChange,
  };
};

export default useRegisterForm;
