import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import RetroModal from './UI/RetroModal';
import Button from './UI/Button';
import GlitchText from './UI/GlitchText';
import { supabase } from '../utils/supabaseClient';

const blinkAnimation = keyframes`
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0.7;
  }
`;

const Container = styled.div`
  margin-bottom: 1rem;
`;

const NotificationBadge = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background-color: ${theme.colors.pink};
  color: ${theme.colors.black};
  font-weight: bold;
  padding: 0.5rem 1rem;
  border-radius: 2px;
  z-index: 1000;
  cursor: pointer;
  animation: ${blinkAnimation} 1s infinite;
  
  &:hover {
    animation: none;
    background-color: ${theme.colors.lime};
  }
`;

const RequestItem = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: ${theme.colors.darkPurple}90;
  border-left: 2px solid ${theme.colors.yellow};
`;

const RequestInfo = styled.div`
  margin-bottom: 1rem;
`;

const Username = styled.div`
  font-size: 1.2rem;
  color: ${theme.colors.cyan};
  margin-bottom: 0.5rem;
`;

const Timestamp = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.white}70;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const JoinRequest = ({ roomCode, hostId }) => {
  const [requests, setRequests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasNewRequests, setHasNewRequests] = useState(false);
  
  useEffect(() => {
    // Fetch existing join requests
    const fetchRequests = async () => {
      try {
        const { data, error } = await supabase
          .from('join_requests')
          .select('*')
          .eq('room_code', roomCode)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setRequests(data || []);
        setHasNewRequests(data?.length > 0);
        
      } catch (error) {
        console.error('Error fetching join requests:', error);
      }
    };
    
    fetchRequests();
    
    // Subscribe to new join requests
    const joinRequestsSubscription = supabase
      .channel(`room:${roomCode}:join_requests`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'join_requests', filter: `room_code=eq.${roomCode}` }, 
        payload => {
          setRequests(prev => [payload.new, ...prev]);
          setHasNewRequests(true);
        }
      )
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'join_requests', filter: `room_code=eq.${roomCode}` }, 
        payload => {
          setRequests(prev => 
            prev.filter(req => req.id !== payload.new.id)
          );
        }
      )
      .subscribe();
      
    // Cleanup on unmount
    return () => {
      joinRequestsSubscription.unsubscribe();
    };
    
  }, [roomCode]);
  
  const handleAction = async (requestId, action) => {
    try {
      const { error } = await supabase
        .from('join_requests')
        .update({ status: action })
        .eq('id', requestId);
        
      if (error) throw error;
      
      // Update local state
      setRequests(prev => prev.filter(req => req.id !== requestId));
      
      if (requests.length <= 1) {
        setHasNewRequests(false);
      }
      
    } catch (error) {
      console.error(`Error ${action} join request:`, error);
    }
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Container>
      {hasNewRequests && !isModalOpen && (
        <NotificationBadge onClick={() => setIsModalOpen(true)}>
          {requests.length} Pending Request{requests.length !== 1 ? 's' : ''}
        </NotificationBadge>
      )}
      
      <RetroModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="JOIN REQUESTS"
        width="450px"
        color={theme.colors.yellow}
      >
        {requests.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <GlitchText>No pending requests</GlitchText>
          </div>
        ) : (
          requests.map(request => (
            <RequestItem key={request.id}>
              <RequestInfo>
                <Username>
                  <GlitchText glow>{request.username}</GlitchText>
                </Username>
                <Timestamp>
                  Request time: {formatTime(request.created_at)}
                </Timestamp>
              </RequestInfo>
              
              <ActionButtons>
                <Button
                  variant="danger"
                  onClick={() => handleAction(request.id, 'rejected')}
                >
                  REJECT
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleAction(request.id, 'accepted')}
                >
                  ACCEPT
                </Button>
              </ActionButtons>
            </RequestItem>
          ))
        )}
      </RetroModal>
    </Container>
  );
};

export default JoinRequest;
