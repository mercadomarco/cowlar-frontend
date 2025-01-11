const useValidation = () => {
  const validateFirstName = (firstName) => {
    if (firstName.length < 2)
      return "First Name should be at least 2 characters long";
    return "";
  };

  const validateLastName = (lastName) => {
    if (lastName.length < 2)
      return "Last Name should be at least 2 characters long";
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address";
    return "";
  };

  const validatePassword = (password) => {
    if (password.length < 6)
      return "Password should be at least 6 characters long";
    return "";
  };

  return {validateEmail, validatePassword, validateFirstName, validateLastName};
};

export default useValidation;
