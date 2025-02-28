import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import CRTEffect from '../components/UI/CRTEffect';
import ChatWindow from '../components/ChatWindow';
import JoinRequest from '../components/JoinRequest';
import UserStatus from '../components/UserStatus';
import Button from '../components/UI/Button';
import GlitchText from '../components/UI/GlitchText';
import { supabase } from '../utils/supabaseClient';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 992px) {
    grid-template-columns: 3fr 1fr;
  }
`;

const MainContent = styled.div``;

const Sidebar = styled.div``;

const LoadingScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  h2 {
    margin-bottom: 2rem;
  }
`;

const LoadingText = styled.div`
  color: ${theme.colors.pink};
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const LoadingDots = styled.div`
  display: flex;
  gap: 0.5rem;
  
  span {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background-color: ${theme.colors.cyan};
    opacity: 0.4;
    
    &:nth-child(1) {
      animation: pulse 1s infinite ease-in-out;
    }
    
    &:nth-child(2) {
      animation: pulse 1s infinite ease-in-out 0.2s;
    }
    
    &:nth-child(3) {
      animation: pulse 1s infinite ease-in-out 0.4s;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }
`;

const ErrorScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  h2 {
    margin-bottom: 2rem;
    color: ${theme.colors.orange};
  }
  
  p {
    margin-bottom: 2rem;
    max-width: 600px;
    text-align: center;
  }
`;

const ChatPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomData, setRoomData] = useState(null);
  
  useEffect(() => {
    const checkRoomAccess = async () => {
      try {
        // Get room data from local storage
        const savedRoom = localStorage.getItem('retroChatRoom');
        
        if (!savedRoom) {
          throw new Error('No room data found. Please join or create a room first.');
        }
        
        const parsedRoomData = JSON.parse(savedRoom);
        
        // Validate room data
        if (!parsedRoomData.roomCode || !parsedRoomData.userId || !parsedRoomData.username) {
          throw new Error('Invalid room data. Please join or create a room again.');
        }
        
        // Check if room exists
        const { data: roomExists, error: roomError } = await supabase
          .from('rooms')
          .select('room_name, host_id')
          .eq('room_code', parsedRoomData.roomCode)
          .single();
          
        if (roomError || !roomExists) {
          throw new Error('This room no longer exists. Please create or join a new room.');
        }
        
        // Check if user is still in the room
        const { data: userInRoom, error: userError } = await supabase
          .from('room_users')
          .select('status')
          .eq('room_code', parsedRoomData.roomCode)
          .eq('user_id', parsedRoomData.userId)
          .single();
          
        if (userError && userError.code !== 'PGRST116') { // Not found error
          throw userError;
        }
        
        // If user was never in room or was marked as left, rejoin
        if (!userInRoom || userInRoom.status === 'left') {
          const { error: joinError } = await supabase
            .from('room_users')
            .upsert([
              {
                room_code: parsedRoomData.roomCode,
                user_id: parsedRoomData.userId,
                username: parsedRoomData.username,
                status: 'active'
              }
            ]);
            
          if (joinError) throw joinError;
        }
        
        // Update room data with latest info
        setRoomData({
          ...parsedRoomData,
          roomName: roomExists.room_name,
          isHost: parsedRoomData.userId === roomExists.host_id
        });
        
      } catch (error) {
        console.error('Error accessing room:', error);
        localStorage.removeItem('retroChatRoom');
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkRoomAccess();
    
  }, [navigate]);
  
  const handleLeaveRoom = () => {
    localStorage.removeItem('retroChatRoom');
    navigate('/');
  };
  
  if (loading) {
    return (
      <CRTEffect>
        <LoadingScreen>
          <LoadingText>
            <GlitchText glow>CONNECTING TO CHATROOM</GlitchText>
          </LoadingText>
          <LoadingDots>
            <span></span>
            <span></span>
            <span></span>
          </LoadingDots>
        </LoadingScreen>
      </CRTEffect>
    );
  }
  
  if (error) {
    return (
      <CRTEffect>
        <ErrorScreen>
          <h2>
            <GlitchText static color={theme.colors.orange}>ERROR</GlitchText>
          </h2>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            RETURN TO HOME
          </Button>
        </ErrorScreen>
      </CRTEffect>
    );
  }
  
  return (
    <CRTEffect>
      <Container>
        <Header>
          <Title>
            <GlitchText fontSize="2rem" glow>RETRO CHAT</GlitchText>
          </Title>
          <Button variant="danger" onClick={handleLeaveRoom}>
            EXIT
          </Button>
        </Header>
        
        <Content>
          <MainContent>
            {roomData && (
              <ChatWindow
                roomCode={roomData.roomCode}
                roomName={roomData.roomName}
                username={roomData.username}
                userId={roomData.userId}
                isHost={roomData.isHost}
                onLeave={handleLeaveRoom}
              />
            )}
          </MainContent>
          
          <Sidebar>
            {roomData && roomData.isHost && (
              <JoinRequest
                roomCode={roomData.roomCode}
                hostId={roomData.userId}
              />
            )}
            
            {roomData && (
              <UserStatus
                roomCode={roomData.roomCode}
                hostId={roomData.isHost ? roomData.userId : null}
              />
            )}
          </Sidebar>
        </Content>
      </Container>
    </CRTEffect>
  );
};

export default ChatPage;
