import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import GlitchText from './UI/GlitchText';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const typing = keyframes`
  from { width: 0 }
  to { width: 100% }
`;

const typingCursor = keyframes`
  from, to { border-right-color: transparent }
  50% { border-right-color: ${theme.colors.white} }
`;

const MessageContainer = styled.div`
  margin: 0.5rem 0;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
  
  ${props => props.isOwn && `
    align-items: flex-end;
  `}
`;

const MessageContent = styled.div`
  max-width: 80%;
  word-break: break-word;
  
  ${props => props.isTyping && `
    overflow: hidden;
    white-space: nowrap;
    border-right: 0.15em solid ${theme.colors.white};
    animation: 
      ${typing} 1.5s steps(40, end),
      ${typingCursor} 0.75s step-end infinite;
  `}
`;

const MessageHeader = styled.div`
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Username = styled.span`
  font-weight: bold;
  ${props => props.isOwn ? `
    color: ${theme.colors.pink};
  ` : `
    color: ${theme.colors.cyan};
  `}
`;

const Timestamp = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.white}70;
`;

const MessageText = styled.div`
  background-color: ${props => props.isOwn ? `${theme.colors.purple}70` : `${theme.colors.darkPurple}90`};
  padding: 0.75rem;
  border-radius: 2px;
  border-left: ${props => props.isOwn ? 'none' : `2px solid ${theme.colors.cyan}`};
  border-right: ${props => props.isOwn ? `2px solid ${theme.colors.pink}` : 'none'};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent, ${theme.colors.background}30);
    pointer-events: none;
  }
`;

// Helper function to format timestamp
const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatMessage = ({
  message,
  username,
  timestamp,
  isOwn = false,
  isSystem = false,
  isTyping = false,
  glitchEffect = true,
}) => {
  const [shouldGlitch, setShouldGlitch] = useState(false);
  
  // Randomly apply glitch effect
  useEffect(() => {
    if (glitchEffect && !isTyping) {
      const glitchTimeout = setTimeout(() => {
        setShouldGlitch(true);
        setTimeout(() => setShouldGlitch(false), 1000);
      }, Math.random() * 10000);
      
      return () => clearTimeout(glitchTimeout);
    }
  }, [glitchEffect, isTyping]);
  
  const formattedTime = timestamp ? formatTime(new Date(timestamp)) : formatTime(new Date());
  
  if (isSystem) {
    return (
      <MessageContainer style={{ alignItems: 'center' }}>
        <MessageContent>
          <GlitchText 
            color={theme.colors.yellow} 
            fontSize="0.9rem"
            glow
            intense={shouldGlitch}
          >
            {message}
          </GlitchText>
        </MessageContent>
      </MessageContainer>
    );
  }
  
  return (
    <MessageContainer isOwn={isOwn}>
      <MessageContent isTyping={isTyping}>
        <MessageHeader>
          <Username isOwn={isOwn}>
            {username}
          </Username>
          <Timestamp>{formattedTime}</Timestamp>
        </MessageHeader>
        <MessageText isOwn={isOwn}>
          {shouldGlitch ? (
            <GlitchText intense glow>{message}</GlitchText>
          ) : (
            message
          )}
        </MessageText>
      </MessageContent>
    </MessageContainer>
  );
};

export default ChatMessage;
