import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from './UI/Button';
import PixelatedInput from './UI/PixelatedInput';
import NeonBorder from './UI/NeonBorder';
import GlitchText from './UI/GlitchText';
import { supabase } from '../utils/supabaseClient';

const CreateRoomContainer = styled(NeonBorder)`
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ResultContainer = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const RoomCode = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 2.5rem;
  color: ${theme.colors.lime};
  letter-spacing: 0.5rem;
  margin: 1.5rem 0;
  text-shadow: 0 0 10px ${theme.colors.lime}80,
               0 0 20px ${theme.colors.lime}40,
               0 0 30px ${theme.colors.lime}20;
`;

const InfoText = styled.p`
  margin: 1rem 0;
  font-size: 0.9rem;
  color: ${theme.colors.white}90;
`;

const CreateRoom = ({ onRoomCreated, onBack }) => {
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState(null);
  const [hostId, setHostId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roomName.trim() || !username.trim()) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Generate a random host ID
      const generatedHostId = crypto.randomUUID();
      
      // Generate a random 5-digit room code
      const generateCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
          result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
      };
      
      const generatedRoomCode = generateCode();
      
      // Create the room in Supabase
      const { error: roomError } = await supabase
        .from('rooms')
        .insert([
          {
            room_code: generatedRoomCode,
            room_name: roomName,
            host_id: generatedHostId,
            host_name: username
          }
        ]);
        
      if (roomError) throw roomError;
      
      // Add host as a user in the room
      const { error: userError } = await supabase
        .from('room_users')
        .insert([
          {
            room_code: generatedRoomCode,
            user_id: generatedHostId,
            username: username
          }
        ]);
        
      if (userError) throw userError;
      
      // Set the room code and host ID
      setRoomCode(generatedRoomCode);
      setHostId(generatedHostId);
      
    } catch (error) {
      console.error('Error creating room:', error);
      setError('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEnterRoom = () => {
    if (onRoomCreated) {
      onRoomCreated({
        roomCode,
        roomName,
        userId: hostId,
        username,
        isHost: true
      });
    }
  };
  
  return (
    <CreateRoomContainer color={theme.colors.pink} pulse>
      <Title>
        <GlitchText fontSize="1.8rem" glow>HOST A CHATROOM</GlitchText>
      </Title>
      
      {!roomCode ? (
        <Form onSubmit={handleSubmit}>
          <PixelatedInput
            label="ROOM NAME"
            name="roomName"
            placeholder="Enter room name..."
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            maxLength={50}
            required
          />
          
          <PixelatedInput
            label="YOUR NAME"
            name="username"
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={50}
            required
          />
          
          {error && (
            <div style={{ color: theme.colors.orange, textAlign: 'center' }}>
              {error}
            </div>
          )}
          
          <ButtonContainer>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onBack}
              fullWidth
            >
              BACK
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? 'CREATING...' : 'CREATE ROOM'}
            </Button>
          </ButtonContainer>
        </Form>
      ) : (
        <ResultContainer>
          <GlitchText glow color={theme.colors.cyan}>
            ROOM CREATED SUCCESSFULLY!
          </GlitchText>
          
          <InfoText>Your room code is:</InfoText>
          
          <RoomCode>
            <GlitchText glow intense>{roomCode}</GlitchText>
          </RoomCode>
          
          <InfoText>
            Share this code with others so they can join your room.
            Keep it safe - you'll need it to reconnect if you get disconnected.
          </InfoText>
          
          <Button 
            onClick={handleEnterRoom}
            variant="success"
            size="large"
            fullWidth
          >
            ENTER ROOM
          </Button>
        </ResultContainer>
      )}
    </CreateRoomContainer>
  );
};

export default CreateRoom;
