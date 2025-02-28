import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { theme } from '../styles/theme';
import Button from '../components/UI/Button';
import GlitchText from '../components/UI/GlitchText';
import CRTEffect from '../components/UI/CRTEffect';
import NeonBorder from '../components/UI/NeonBorder';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';

const glowAnimation = keyframes`
  0% {
    text-shadow: 0 0 10px ${theme.colors.pink}80, 
                 0 0 20px ${theme.colors.pink}40, 
                 0 0 30px ${theme.colors.pink}20,
                 0 0 40px ${theme.colors.pink}10;
  }
  50% {
    text-shadow: 0 0 15px ${theme.colors.pink}80, 
                 0 0 30px ${theme.colors.pink}40, 
                 0 0 45px ${theme.colors.pink}20,
                 0 0 60px ${theme.colors.pink}10;
  }
  100% {
    text-shadow: 0 0 10px ${theme.colors.pink}80, 
                 0 0 20px ${theme.colors.pink}40, 
                 0 0 30px ${theme.colors.pink}20,
                 0 0 40px ${theme.colors.pink}10;
  }
`;

const scanAnimation = keyframes`
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(100%);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
`;

const Logo = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 4rem;
  color: ${theme.colors.pink};
  margin-bottom: 2rem;
  text-align: center;
  animation: ${glowAnimation} 3s infinite;
  text-transform: uppercase;
  letter-spacing: 4px;
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const Subtitle = styled.div`
  font-size: 1.2rem;
  color: ${theme.colors.cyan};
  margin-bottom: 3rem;
  text-align: center;
  letter-spacing: 2px;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const ScanLine = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: linear-gradient(
    to bottom,
    transparent,
    ${theme.colors.cyan}40,
    transparent
  );
  animation: ${scanAnimation} 6s linear infinite;
  pointer-events: none;
  z-index: 10;
`;

const Footer = styled.footer`
  position: absolute;
  bottom: 1rem;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 0.8rem;
  color: ${theme.colors.white}70;
  letter-spacing: 1px;
`;

const HomePage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('main'); // main, create, join
  
  const handleRoomCreated = (roomData) => {
    localStorage.setItem('retroChatRoom', JSON.stringify(roomData));
    navigate('/chat');
  };
  
  const handleRoomJoined = (roomData) => {
    localStorage.setItem('retroChatRoom', JSON.stringify(roomData));
    navigate('/chat');
  };
  
  useEffect(() => {
    // Check if already in a room
    const savedRoom = localStorage.getItem('retroChatRoom');
    if (savedRoom) {
      try {
        const roomData = JSON.parse(savedRoom);
        if (roomData.roomCode && roomData.userId) {
          // Offer to return to room
          const returnToRoom = window.confirm(
            `You were in room ${roomData.roomName} (${roomData.roomCode}). Return to this room?`
          );
          
          if (returnToRoom) {
            navigate('/chat');
          } else {
            localStorage.removeItem('retroChatRoom');
          }
        }
      } catch (error) {
        console.error('Error parsing saved room data:', error);
        localStorage.removeItem('retroChatRoom');
      }
    }
  }, [navigate]);
  
  return (
    <CRTEffect>
      <Container>
        <ScanLine />
        
        {view === 'main' && (
          <>
            <Logo>
              <GlitchText intense fontSize="4rem" letterSpacing="4px">
                RETRO CHAT
              </GlitchText>
            </Logo>
            
            <Subtitle>
              <GlitchText glow letterSpacing="2px">
                TEMPORARY CHATROOMS WITH 80s/90s VIBES
              </GlitchText>
            </Subtitle>
            
            <ActionButtons>
              <Button 
                variant="primary" 
                size="large"
                onClick={() => setView('create')}
              >
                HOST A CHATROOM
              </Button>
              
              <Button 
                variant="secondary" 
                size="large"
                onClick={() => setView('join')}
              >
                JOIN A CHATROOM
              </Button>
            </ActionButtons>
            
            <NeonBorder color={theme.colors.purple} padding="1rem" corners>
              <div style={{ maxWidth: '500px', textAlign: 'center' }}>
                <GlitchText color={theme.colors.white}90>
                  Create temporary chatrooms for quick discussions.
                  No registration required. All messages disappear when everyone leaves.
                </GlitchText>
              </div>
            </NeonBorder>
          </>
        )}
        
        {view === 'create' && (
          <CreateRoom 
            onRoomCreated={handleRoomCreated}
            onBack={() => setView('main')}
          />
        )}
        
        {view === 'join' && (
          <JoinRoom 
            onRoomJoined={handleRoomJoined}
            onBack={() => setView('main')}
          />
        )}
        
        <Footer>
          RETRO CHAT &copy; {new Date().getFullYear()} | ALL MESSAGES ARE TEMPORARY
        </Footer>
      </Container>
    </CRTEffect>
  );
};

export default HomePage;
