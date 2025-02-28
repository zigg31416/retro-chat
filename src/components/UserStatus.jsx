import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import GlitchText from './UI/GlitchText';
import { supabase } from '../utils/supabaseClient';

const blink = keyframes`
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0.5;
  }
`;

const Container = styled.div`
  background-color: ${theme.colors.darkPurple}80;
  border-left: 2px solid ${theme.colors.cyan};
  padding: 1rem;
  margin-top: 1rem;
`;

const Title = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.75rem;
  color: ${theme.colors.cyan};
  text-transform: uppercase;
`;

const UsersList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const UserItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.isHost ? theme.colors.pink : theme.colors.lime};
    box-shadow: 0 0 5px ${props => props.isHost ? theme.colors.pink : theme.colors.lime};
    margin-right: 0.5rem;
    animation: ${blink} 2s infinite;
  }
`;

const Username = styled.span`
  color: ${props => props.isHost ? theme.colors.pink : theme.colors.white};
  ${props => props.isHost && `
    font-weight: bold;
  `}
`;

const HostBadge = styled.span`
  background-color: ${theme.colors.pink}30;
  color: ${theme.colors.pink};
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  margin-left: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const UserStatus = ({ roomCode, hostId }) => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Fetch users in the room
    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('room_users')
          .select('*')
          .eq('room_code', roomCode)
          .eq('status', 'active')
          .order('joined_at', { ascending: true });
          
        if (error) throw error;
        
        setUsers(data || []);
        
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
    
    // Subscribe to user changes
    const userChangesSubscription = supabase
      .channel(`room:${roomCode}:users`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'room_users', filter: `room_code=eq.${roomCode}` }, 
        payload => {
          if (payload.eventType === 'INSERT' || (payload.eventType === 'UPDATE' && payload.new.status === 'active')) {
            // Add user if not already in the list
            setUsers(prev => {
              const exists = prev.some(user => user.id === payload.new.id);
              return exists ? prev : [...prev, payload.new];
            });
          } else if (payload.eventType === 'UPDATE' && payload.new.status === 'left') {
            // Remove user
            setUsers(prev => prev.filter(user => user.id !== payload.new.id));
          }
        }
      )
      .subscribe();
      
    // Cleanup on unmount
    return () => {
      userChangesSubscription.unsubscribe();
    };
    
  }, [roomCode]);
  
  return (
    <Container>
      <Title>
        <GlitchText glow>Users Online ({users.length})</GlitchText>
      </Title>
      <UsersList>
        {users.map(user => (
          <UserItem key={user.id} isHost={user.user_id === hostId}>
            <Username isHost={user.user_id === hostId}>
              {user.username}
            </Username>
            {user.user_id === hostId && (
              <HostBadge>Host</HostBadge>
            )}
          </UserItem>
        ))}
      </UsersList>
    </Container>
  );
};

export default UserStatus;
