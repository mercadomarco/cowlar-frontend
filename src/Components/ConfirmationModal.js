import React from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import { IoIosWarning } from "react-icons/io";

// Main component for the confirmation modal
const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      style={modalStyles}
      ariaHideApp={false} // This is to prevent accessibility warnings in some cases
    >
      <ModalContent>
        <IconContainer>
          <WarningIcon />
        </IconContainer>
        <Message>{message}</Message>
        <ButtonContainer>
          <Button className='cancel' onClick={onRequestClose}>Cancel</Button>
          <Button className='confirm' onClick={onConfirm}>Confirm</Button>
        </ButtonContainer>
      </ModalContent>
    </Modal>
  );
};

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    width: '250px',
    padding: '10px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    zIndex: 2000, 
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)', 
    backdropFilter: 'blur(5px)', 
    zIndex: 1099, 
  },
};

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const WarningIcon = styled(IoIosWarning)`
  font-size: 60px; 
  color: #EA3435; 
`;

const Message = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  .cancel {
    background-color: #EA3435;

  }

  .confirm {
    border: 1px solid #EA3435;
    background-color: #ffffff;
    color: #EA3435;
    outline: none;
  }
`;

const Button = styled.button`
  font-family: 'Poppins', sans-serif;
  padding: 10px 15px;
  border: none;
  width: 100px;
  cursor: pointer;
  color: white;
  font-size: 12px;
`;

export default ConfirmationModal;
