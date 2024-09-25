import axios from 'axios';

const useHandleRegister = (
  fullName,
  email,
  password,
  errors,
  setErrors,
  setIsLoading,
  setIsSuccess,
  setShowSpinner,
  setResetButton,
  setFullName,
  setEmail,
  setPassword
) => {
  const handleRegister = async (e) => {
    e.preventDefault();
    if (errors.fullName || errors.email || errors.password) {
      return; 
    }
    setIsLoading(true);
    setShowSpinner(true);
    setIsSuccess(false);
    setResetButton(false);

    setTimeout(async () => {
      try {
        const response = await axios.post('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/auth/register', {
          fullName,
          email,
          password
        });
        console.log(response.data.message);
        setIsSuccess(true);
        setFullName('');
        setEmail('');
        setPassword('');
        setErrors({ fullName: '', email: '', password: '' });

        setTimeout(() => {
          setIsSuccess(false);
          setResetButton(true);
        }, 2000);
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: error.response ? error.response.data.message : 'An error occurred'
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
