const useValidation = () => {
    const validateFullName = (name) => {
      if (name.length < 2) return 'Full Name should be at least 2 characters long';
      return '';
    };
  
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) return 'Invalid email address';
      return '';
    };
  
    const validatePassword = (password) => {
      if (password.length < 6) return 'Password should be at least 6 characters long';
      return '';
    };
  
    return { validateFullName, validateEmail, validatePassword };
  };
  
  export default useValidation;
  