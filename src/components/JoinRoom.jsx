import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from './UI/Button';
import PixelatedInput from './UI/PixelatedInput';
import NeonBorder from './UI/NeonBorder';
import GlitchText from './UI/GlitchText';
import { supabase } from '../utils/supabaseClient';

const JoinRoomContainer = styled(NeonBorder)`
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

const StatusMessage = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  text-align: center;
  border: 2px solid ${props => 
    props.status === 'success' ? theme.colors.lime : 
    props.status === 'error' ? theme.colors.orange : 
    theme.colors.cyan};
  color: ${props => 
    props.status === 'success' ? theme.colors.lime : 
    props.status === 'error' ? theme.colors.orange : 
    theme.colors.cyan};
  background-color: ${theme.colors.darkPurple}90;
`;

const JoinRoom = ({ onRoomJoined, onBack }) => {
  const [roomCode, setRoomCode] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusType, setStatusType] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [roomName, setRoomName] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!roomCode.trim() || !username.trim()) {
      setStatusMessage('Please fill in all fields');
      setStatusType('error');
      return;
    }
    
    try {
      setIsLoading(true);
      setStatusMessage(null);
      setStatusType(null);
      
      // Check if room exists
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select('room_name')
        .eq('room_code', roomCode.toUpperCase())
        .single();
        
      if (roomError || !roomData) {
        setStatusMessage('Room not found. Please check the room code.');
        setStatusType('error');
        return;
      }
      
      setRoomName(roomData.room_name);
      
      // Generate user ID
      const generatedUserId = crypto.randomUUID();
      setUserId(generatedUserId);
      
      // Create join request
      const { error: requestError } = await supabase
        .from('join_requests')
        .insert([
          {
            room_code: roomCode.toUpperCase(),
            user_id: generatedUserId,
            username: username
          }
        ]);
        
      if (requestError) throw requestError;
      
      setStatusMessage('Join request sent. Waiting for host approval...');
      setStatusType('pending');
      setIsCheckingStatus(true);
      
      // Start checking for approval
      checkJoinStatus(roomCode.toUpperCase(), generatedUserId);
      
    } catch (error) {
      console.error('Error joining room:', error);
      setStatusMessage('Failed to send join request. Please try again.');
      setStatusType('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkJoinStatus = async (roomCode, userId) => {
    try {
      // Subscribe to changes in join request status
      const joinRequestSubscription = supabase
        .channel(`join-request-${userId}`)
        .on('postgres_changes', 
          { event: 'UPDATE', schema: 'public', table: 'join_requests', filter: `user_id=eq.${userId}` }, 
          async (payload) => {
            if (payload.new.status === 'accepted') {
              // Add user to room
              const { error: joinError } = await supabase
                .from('room_users')
                .insert([
                  {
                    room_code: roomCode,
                    user_id: userId,
                    username: username
                  }
                ]);
                
              if (joinError) throw joinError;
              
              setStatusMessage('Join request accepted! Entering room...');
              setStatusType('success');
              
              // Wait a moment for visual feedback
              setTimeout(() => {
                if (onRoomJoined) {
                  onRoomJoined({
                    roomCode,
                    roomName,
                    userId,
                    username,
                    isHost: false
                  });
                }
              }, 1500);
              
            } else if (payload.new.status === 'rejected') {
              setStatusMessage('Join request rejected by host.');
              setStatusType('error');
              setIsCheckingStatus(false);
            }
          }
        )
        .subscribe();
      
      // Cleanup function to unsubscribe when component unmounts
      return () => {
        joinRequestSubscription.unsubscribe();
      };
      
    } catch (error) {
      console.error('Error checking join status:', error);
      setStatusMessage('Error checking join status. Please try again.');
      setStatusType('error');
      setIsCheckingStatus(false);
    }
  };
  
  const handleCancel = async () => {
    if (userId && isCheckingStatus) {
      try {
        // Delete join request
        const { error } = await supabase
          .from('join_requests')
          .delete()
          .eq('user_id', userId);
          
        if (error) throw error;
        
      } catch (error) {
        console.error('Error cancelling join request:', error);
      }
    }
    
    setIsCheckingStatus(false);
    setStatusMessage(null);
    setStatusType(null);
  };
  
  return (
    <JoinRoomContainer color={theme.colors.cyan} pulse>
      <Title>
        <GlitchText fontSize="1.8rem" glow>JOIN A CHATROOM</GlitchText>
      </Title>
      
      <Form onSubmit={handleSubmit}>
        <PixelatedInput
          label="ROOM CODE"
          name="roomCode"
          placeholder="Enter 5-digit room code..."
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          maxLength={5}
          required
          disabled={isCheckingStatus}
        />
        
        <PixelatedInput
          label="YOUR NAME"
          name="username"
          placeholder="Enter your username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          maxLength={50}
          required
          disabled={isCheckingStatus}
        />
        
        {statusMessage && (
          <StatusMessage status={statusType}>
            <GlitchText glow={statusType === 'success'} static={statusType === 'error'}>
              {statusMessage}
            </GlitchText>
          </StatusMessage>
        )}
        
        <ButtonContainer>
          {isCheckingStatus ? (
            <>
              <Button 
                type="button" 
                variant="danger" 
                onClick={handleCancel}
                fullWidth
              >
                CANCEL
              </Button>
            </>
          ) : (
            <>
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
                {isLoading ? 'CONNECTING...' : 'JOIN ROOM'}
              </Button>
            </>
          )}
        </ButtonContainer>
      </Form>
    </JoinRoomContainer>
  );
};

export default JoinRoom;
