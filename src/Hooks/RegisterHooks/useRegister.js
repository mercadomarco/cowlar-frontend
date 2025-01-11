import { useState } from 'react';
import useValidation from '../AuthValidation/useValidation';

const useRegisterForm = () => {
  // State for form inputs
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for form errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  // Loading and success indicators
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [resetButton, setResetButton] = useState(false);

  // Validation functions
  const { validateFirstName, validateLastName, validateEmail, validatePassword } = useValidation();

  // Handle input changes and validate
  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      firstName: validateFirstName(value),
    }));
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      lastName: validateLastName(value),
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      email: validateEmail(value),
    }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      password: validatePassword(value),
    }));
  };

  return {
    firstName,
    lastName,
    email,
    password,
    errors,
    isLoading,
    isSuccess,
    showSpinner,
    resetButton,
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setErrors,
    setIsLoading,
    setIsSuccess,
    setShowSpinner,
    setResetButton,
    handleFirstNameChange,
    handleLastNameChange,
    handleEmailChange,
    handlePasswordChange,
  };
};

export default useRegisterForm;
