import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { theme } from '../styles/theme';
import CRTEffect from '../components/UI/CRTEffect';
import Button from '../components/UI/Button';
import GlitchText from '../components/UI/GlitchText';

const glitchAnimation = keyframes`
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(-2px, 2px);
  }
  20% {
    clip-path: inset(92% 0 1% 0);
    transform: translate(1px, -3px);
  }
  40% {
    clip-path: inset(43% 0 1% 0);
    transform: translate(-1px, 3px);
  }
  60% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(3px, 1px);
  }
  80% {
    clip-path: inset(54% 0 7% 0);
    transform: translate(-3px, -2px);
  }
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(2px, 3px);
  }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  position: relative;
`;

const ErrorCode = styled.div`
  font-family: ${theme.fonts.display};
  font-size: 8rem;
  color: ${theme.colors.pink};
  margin-bottom: 1rem;
  position: relative;
  
  &::before,
  &::after {
    content: "404";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  &::before {
    left: 3px;
    text-shadow: -2px 0 ${theme.colors.cyan};
    animation: ${glitchAnimation} 2s infinite linear alternate-reverse;
    background: ${theme.colors.background};
    color: ${theme.colors.cyan};
  }
  
  &::after {
    left: -3px;
    text-shadow: 2px 0 ${theme.colors.pink};
    animation: ${glitchAnimation} 3s infinite linear alternate-reverse;
    background: ${theme.colors.background};
    color: ${theme.colors.pink};
  }
  
  @media (max-width: 768px) {
    font-size: 5rem;
  }
`;

const Message = styled.div`
  font-size: 1.5rem;
  color: ${theme.colors.white};
  margin-bottom: 2rem;
  max-width: 600px;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const NotFoundPage = () => {
  const navigate = useNavigate();
  
  return (
    <CRTEffect>
      <Container>
        <ErrorCode>404</ErrorCode>
        <Message>
          <GlitchText intense glow>
            SIGNAL LOST - TRANSMISSION ERROR
          </GlitchText>
          <p style={{ marginTop: '1rem', color: theme.colors.white }}>
            The chatroom you're looking for has been disconnected or never existed.
          </p>
        </Message>
        <Button variant="primary" size="large" onClick={() => navigate('/')}>
          RETURN TO MAIN TERMINAL
        </Button>
      </Container>
    </CRTEffect>
  );
};

export default NotFoundPage;
