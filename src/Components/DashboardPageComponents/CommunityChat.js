import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styled from 'styled-components';
import { AiOutlineSend } from 'react-icons/ai';
import { FaFileImage } from "react-icons/fa6";
import Logo from '../../Assests/logo2.png'

const socket = io('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/'); 

const CommunityChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null); 
  const [fullName, setFullName] = useState(''); 
  const [imagePreview, setImagePreview] = useState(null);
  const [userId, setUserId] = useState('');
  const [typing, setTyping] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const sessionId = localStorage.getItem('sessionId');

  useEffect(() => {
    const fetchMessagesAndUserInfo = async () => {
      try {
        const messagesResponse = await axios.get('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/chat/messages', {
          headers: {
            'Authorization': `Bearer ${sessionId}`
          }
        });

        const messagesData = messagesResponse.data || [];
        const validMessages = messagesData.map(msg => ({
          ...msg,
          created_at: new Date(msg.created_at),
        }));

        setMessages(validMessages);
        scrollToBottom();

        const profileResponse = await axios.get('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${sessionId}`
          }
        });

        setFullName(profileResponse.data.fullname);
        setUserId(profileResponse.data.user_id);
      } catch (error) {
        console.error('Error fetching messages or user info:', error);
        setError('Failed to fetch messages or user info. Please try again later.');
      }
    };

    fetchMessagesAndUserInfo();

    socket.on('chat message', (newMessage) => {
      newMessage.created_at = new Date(newMessage.created_at);
      setMessages(prevMessages => [...prevMessages, newMessage]);
      scrollToBottom();
    });

    socket.on('typing', (user) => {
      setTyping(`${user} is typing...`);
    });

    return () => {
      socket.off('chat message');
      socket.off('typing');
    };
  }, [sessionId]);

  const sendMessage = () => {
    if (sessionId && (message || image)) {
      const formData = new FormData();
      formData.append('sessionId', sessionId);
      formData.append('content', message);
      formData.append('fullname', fullName);
      formData.append('user_id', userId);
      formData.append('created_at', new Date().toISOString());

      if (image) {
        formData.append('image', image); 
      }

      axios.post('https://ibon-server-0c0c6dfbe0a0.herokuapp.com/api/chat/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => {
        setMessage('');
        setImage(null); 
        setImagePreview(null);
        setError('');
      })
      .catch(error => {
        console.error('Error sending message:', error);
        setError('Failed to send message. Please try again later.');
      });

      socket.emit('chat message', { 
        sessionId, 
        content: message, 
        fullname: fullName, 
        user_id: userId, 
        created_at: new Date().toISOString(),
        image_url: image ? URL.createObjectURL(image) : null
      });
    } else {
      setError('Message content is required.');
    }
  };

  const handleTyping = () => {
    if (message) {
      socket.emit('typing', fullName);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage)); 
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'Invalid date' : d.toLocaleTimeString();
  };

  return (
    <ChatContainer>
      <Header>
       <LogoImage src={Logo} alt="logo" />
      <Text> iBon Community Chat</Text>
      </Header>
      <MessagesContainer>
        {messages.map((msg, index) => (
          <MessageContainer
            key={index}
            isSent={msg.user_id === userId}
          >
            <Container>
            <Name>{msg.fullname || 'Unknown'}</Name> 
            </Container>
            <Message isSent={msg.user_id === userId}>
            <Content>{msg.content}</Content>
              {msg.image_url && <Image src={`https://ibon-server-0c0c6dfbe0a0.herokuapp.com${msg.image_url}`} alt="Uploaded" />}
            </Message>
            <Timestamp>{formatDate(msg.created_at)}</Timestamp>
          </MessageContainer>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      {typing && <TypingIndicator>{typing}</TypingIndicator>}
      <Footer>
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          onKeyUp={handleTyping}
          placeholder="Type a message..."
        />
     <UploadButton onClick={() => document.getElementById('fileInput').click()}>
          <FaFileImage size={24} />
        </UploadButton>
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }} 
        />
        {imagePreview && <ImagePreview src={imagePreview} alt="Preview" />}
        <Button onClick={sendMessage}>
          <AiOutlineSend size={24} />
        </Button>
      </Footer>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 85vh;
  width: 90%;
  margin: 70px auto;
  box-sizing: border-box;
  font-family: 'Poppins';
  border: 1px solid #ccc;
  overflow: hidden;
`;

const LogoImage = styled.img`
  width: 60px;
  height: auto;
`;

const Text = styled.h3 `
color: #333;
font-size: 1rem;
font-weight: 600;

`

const Header = styled.header`
 display: flex;
 flex-direction: row;
 justify-content: flex-start;
 align-items: center;
 padding: 10px;
 border-bottom: 1px solid #ccc;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
`;

const ImagePreview = styled.img`
  max-width: 50px;
  max-height: 50px;
  margin-right: 10px;
  border-radius: 4px;
`;

const Container = styled.div`
display: flex;
flex-direction: row;
align-items: center;
gap: 10px;
`

const Content = styled.p`
  margin: 0;
  font-size: 0.75rem;
  color: #000;
`;
const Name = styled.h3`
font-size: 0.8rem;
font-weight: 400;
`

const MessageContainer = styled.div`
  display: flex;
  align-items: ${props => props.isSent ? 'flex-end' : 'flex-start'};
  flex-direction: column;
`;


const Message = styled.div`
  padding: 8px;
  border-radius: 25px;
  background-color: ${props => props.isSent ? '#e8f1f3' : '#efefef'};
  max-width: 30%;
  font-size: 0.8rem;
  word-wrap: break-word;
  
`;

const UploadButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  font-size: 1rem;
  color: #555;
`;

const Image = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin-top: 8px;
`;

const Timestamp = styled.span`
  display: block;
  font-size: 0.75em;
  color: #888;
`;

const TypingIndicator = styled.div`
  padding: 8px;
  color: #888;
  text-align: center;
`;

const Footer = styled.footer`
  display: flex;
  align-items: center;
  padding: 8px;
  gap: 10px;
  background-color: #fff;
  border-top: 1px solid #ccc;
  height: 60px;
`;

const Input = styled.input`
  flex: 3;
  height: 100%;
  border: 1px solid #ccc;
  padding: 10px;
  font-family: 'Poppins';
  box-sizing: border-box;
  border-radius: 30px;

  &:focus {
    outline: none;
    border-color: #121481;
  }
`;
const Button = styled.button`
  padding: 8px;
  margin-left: 8px;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 10px;
  background-color: #121481;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  padding: 8px;
`;

export default CommunityChat;
