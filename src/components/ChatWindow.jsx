import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import Button from './UI/Button';
import PixelatedInput from './UI/PixelatedInput';
import NeonBorder from './UI/NeonBorder';
import CRTEffect from './UI/CRTEffect';
import ChatMessage from './ChatMessage';
import { supabase, sendMessage } from '../utils/supabaseClient';

const ChatContainer = styled(NeonBorder)`
  height: 70vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const MessagesContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding: 1rem;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 10px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.darkPurple};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.purple};
    border: 1px solid ${theme.colors.cyan};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.pink};
  }
`;

const InputArea = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-top: 2px solid ${theme.colors.cyan};
  background-color: ${theme.colors.darkPurple}90;
  position: relative;
`;

const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  border-bottom: 2px solid ${theme.colors.cyan};
  background-color: ${theme.colors.darkPurple}90;
  font-size: 0.85rem;
`;

const StatusInfo = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.online ? theme.colors.lime : theme.colors.orange};
    box-shadow: 0 0 5px ${props => props.online ? theme.colors.lime : theme.colors.orange};
  }
`;

const ChatWindow = ({
  roomCode,
  roomName,
  username,
  userId,
  isHost,
  onLeave,
}) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  
  // Scroll to bottom when new messages come in
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Fetch initial messages and users
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch messages
        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('room_code', roomCode)
          .order('created_at', { ascending: true });
          
        if (messagesError) throw messagesError;
        setMessages(messagesData || []);
        
        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from('room_users')
          .select('*')
          .eq('room_code', roomCode)
          .eq('status', 'active');
          
        if (usersError) throw usersError;
        setUsers(usersData || []);
        
        // Add system message about joining
        const joinMessage = {
          id: Date.now(),
          message: `${username} has joined the chat`,
          isSystem: true,
          created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, joinMessage]);
        
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    
    fetchInitialData();
    
    // Subscribe to new messages
    const messagesSubscription = supabase
      .channel(`room:${roomCode}:messages`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_code=eq.${roomCode}` }, 
        payload => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();
      
    // Subscribe to user status changes
    const usersSubscription = supabase
      .channel(`room:${roomCode}:users`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'room_users', filter: `room_code=eq.${roomCode}` }, 
        payload => {
          if (payload.eventType === 'INSERT' || (payload.eventType === 'UPDATE' && payload.new.status === 'active')) {
            setUsers(prev => {
              const exists = prev.some(user => user.id === payload.new.id);
              if (!exists) {
                // Add system message about joining
                const joinMessage = {
                  id: Date.now(),
                  message: `${payload.new.username} has joined the chat`,
                  isSystem: true,
                  created_at: new Date().toISOString()
                };
                setMessages(prevMsgs => [...prevMsgs, joinMessage]);
                return [...prev, payload.new];
              }
              return prev;
            });
          } else if (payload.eventType === 'UPDATE' && payload.new.status === 'left') {
            setUsers(prev => prev.filter(user => user.id !== payload.new.id));
            
            // Add system message about leaving
            const leaveMessage = {
              id: Date.now(),
              message: `${payload.new.username} has left the chat`,
              isSystem: true,
              created_at: new Date().toISOString()
            };
            setMessages(prevMsgs => [...prevMsgs, leaveMessage]);
          }
        }
      )
      .subscribe();
      
    // Cleanup on unmount
    return () => {
      messagesSubscription.unsubscribe();
      usersSubscription.unsubscribe();
    };
  }, [roomCode, username]);
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    try {
      // Optimistically add message to UI
      const tempMessage = {
        id: `temp-${Date.now()}`,
        room_code: roomCode,
        user_id: userId,
        username,
        message: newMessage,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      // Send to Supabase
      await sendMessage(roomCode, userId, username, newMessage);
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
    }
  };
  
  const handleLeave = async () => {
    try {
      // Update user status to 'left'
      const { error } = await supabase
        .from('room_users')
        .update({ status: 'left' })
        .eq('room_code', roomCode)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Call the onLeave callback
      onLeave();
      
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };
  
  return (
    <CRTEffect>
      <ChatContainer color={theme.colors.cyan} pulse>
        <StatusBar>
          <div>
            ROOM: <span style={{ color: theme.colors.pink }}>{roomName}</span> | 
            CODE: <span style={{ color: theme.colors.lime }}>{roomCode}</span>
          </div>
          <StatusInfo>
            <StatusItem online={true}>
              USERS: {users.length}
            </StatusItem>
            <Button 
              variant="danger" 
              size="small"
              onClick={handleLeave}
            >
              LEAVE
            </Button>
          </StatusInfo>
        </StatusBar>
        
        <MessagesContainer ref={messagesContainerRef}>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg.message}
              username={msg.username}
              timestamp={msg.created_at}
              isOwn={msg.user_id === userId}
              isSystem={msg.isSystem}
            />
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <InputArea onSubmit={handleSendMessage}>
          <PixelatedInput
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onFocus={() => setIsTyping(true)}
            onBlur={() => setIsTyping(false)}
          />
          <Button 
            type="submit" 
            variant="primary"
          >
            SEND
          </Button>
        </InputArea>
      </ChatContainer>
    </CRTEffect>
  );
};

export default ChatWindow;
