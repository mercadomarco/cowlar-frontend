import React from 'react';
import styled from 'styled-components';
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Circles } from 'react-loader-spinner';
import usePasswordToggle from '../Hooks/PasswordToggle/usePassWordToggle';
import useValidation from '../Hooks/AuthValidation/useValidation';
import useLogin from '../Hooks/LoginHooks/useLogin';

const LoginModal = ({ isOpen, onClose, openRegisterModal }) => {
  const { passwordVisible, togglePasswordVisibility } = usePasswordToggle();
  const { validateEmail, validatePassword } = useValidation();
  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    setEmailError,
    passwordError,
    setPasswordError,
    error,
    loading, 
    handleLogin,
  } = useLogin();

  const handeClose = () => {
    setEmail('');
    setPassword('');
    setEmailError(false);
    setPasswordError(false);
    onClose();
  }

  if (!isOpen) return null;

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={handeClose}>×</CloseButton>
        <ModalTitle>Login</ModalTitle>
        <LoginForm onSubmit={handleLogin}>
        {error && <ErrorText>{error}</ErrorText>}
          <Label htmlFor="email">Email</Label>
          <InputField
            type="email"
            id="email"
            placeholder="Email"
            required
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}

          <Label htmlFor="password">Password</Label>
          <PasswordContainer>
            <InputField
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <TogglePasswordButton onClick={togglePasswordVisibility} type="button">
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </TogglePasswordButton>
          </PasswordContainer>
          {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

          <LoginButton type="submit" disabled={loading}>
            {loading ?   <Circles
                height="20"
                width="20"
                color="#ffffff"
                ariaLabel="circles-loading"
                wrapperStyle={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              /> : 'Login'}
          </LoginButton>
        </LoginForm>
        <OrDivider>or</OrDivider>
        <SocialLoginContainer>
          <SocialIconButton bgColor="#db4437">
            <FaGoogle size={20} />
          </SocialIconButton>
          <SocialIconButton bgColor="#4267B2">
            <FaFacebookF size={20} />
          </SocialIconButton>
        </SocialLoginContainer>
        <RegisterLink>Don't have an account?{' '}<span onClick={() => { handeClose();openRegisterModal();}}>Register</span>
        </RegisterLink>
      </ModalContent>
    </ModalOverlay>
  );
};

export default LoginModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 40px 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 300px;
  text-align: center;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #555;

  &:hover {
    color: #000;
  }
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;

const Label = styled.label`
  width: 100%;
  text-align: left;
  margin-bottom: 5px;
  font-size: 0.8rem;
  font-weight: 400;
  color: #333;
`;

const InputField = styled.input`
  width: 100%;
  font-family: 'Poppins';
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.75rem;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    border-color: #121481;
    outline: none;
  }
`;

const PasswordContainer = styled.div`
  position: relative;
  width: 100%;
`;

const TogglePasswordButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-70%);
  background: transparent;
  border: none;
  cursor: pointer;
  color: #555;
  font-size: 18px;

  &:hover {
    color: #000;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 10px;
  font-family: 'Poppins';
  background-color: #121481;
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 15px;
  box-sizing: border-box;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const OrDivider = styled.div`
  width: 100%;
  text-align: center;
  margin: 20px 0;
  font-size: 14px;
  color: #999;
  position: relative;

  &:before,
  &:after {
    content: '';
    width: 40%;
    height: 1px;
    background: #ddd;
    position: absolute;
    top: 50%;
  }

  &:before {
    left: 0;
  }

  &:after {
    right: 0;
  }
`;

const SocialLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
`;

const SocialIconButton = styled.button`
  width: 40px;
  height: 40px;
  background-color: ${(props) => props.bgColor};
  color: #fff;
  border: none;
  border-radius: 50%;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const RegisterLink = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #666;

  span {
    color: #007bff;
    cursor: pointer;
    font-weight: 500;
    transition: color 0.3s;

    &:hover {
      text-decoration: underline;
      color: #0056b3;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #e74c3c;
  font-size: 0.7rem;
  margin: 0 auto;
  text-align: left;
  width: 100%;
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 0.75rem;
  margin: 0 auto;
  text-align: center;
  width: 100%;
`;

