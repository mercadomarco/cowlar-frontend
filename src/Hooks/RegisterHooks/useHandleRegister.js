import axios from 'axios';

const useHandleRegister = (
  firstName,
  lastName,
  email,
  password,
  errors,
  setErrors,
  setIsLoading,
  setIsSuccess,
  setShowSpinner,
  setResetButton,
  setFirstName,
  setLastName,
  setEmail,
  setPassword
) => {
  const handleRegister = async (e) => {
    e.preventDefault();
    if (errors.firstName || errors.lastName || errors.email || errors.password) {
      return; 
    }
    setIsLoading(true);
    setShowSpinner(true);
    setIsSuccess(false);
    setResetButton(false);

    setTimeout(async () => {
      try {
        // Adjust the payload to match the backend
        const response = await axios.post('http://localhost:8000/api/auth/register', {
          email,
          password,
          first_name: firstName, // Send first_name
          last_name: lastName,   // Send last_name
        });

        console.log(response.data.message);
        setIsSuccess(true);

        // Clear form inputs
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setErrors({ firstName: '', lastName: '', email: '', password: '' });

        setTimeout(() => {
          setIsSuccess(false);
          setResetButton(true);
        }, 2000);
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: error.response ? error.response.data.error : 'An error occurred'
        }));
        setTimeout(() => {
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: ''
          }));
        }, 3000);
      } finally {
        setIsLoading(false);
        setShowSpinner(false);
        setTimeout(() => setResetButton(false), 2000);
      }
    }, 3000); 
  };

  return { handleRegister };
};

export default useHandleRegister;
