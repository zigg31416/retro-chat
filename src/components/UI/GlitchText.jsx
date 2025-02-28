import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const glitch = keyframes`
  0% {
    transform: translate(0);
    text-shadow: 0 0 0 ${theme.colors.glitch1}, 0 0 0 ${theme.colors.glitch2};
  }
  2% {
    transform: translate(-2px, 1px);
    text-shadow: -2px 0 0 ${theme.colors.glitch1}, 2px 1px 0 ${theme.colors.glitch2};
  }
  4% {
    transform: translate(-1px, -1px);
    text-shadow: 3px 0 0 ${theme.colors.glitch1}, -3px -2px 0 ${theme.colors.glitch2};
  }
  6% {
    transform: translate(1px, 2px);
    text-shadow: -3px 0 0 ${theme.colors.glitch1}, 3px 0 0 ${theme.colors.glitch2};
  }
  8% {
    transform: translate(1px, -2px);
    text-shadow: -3px 0 0 ${theme.colors.glitch1}, 3px 2px 0 ${theme.colors.glitch2};
  }
  10% {
    transform: translate(-2px, 1px);
    text-shadow: 3px 0 0 ${theme.colors.glitch1}, -3px 0 0 ${theme.colors.glitch2};
  }
  12% {
    transform: translate(0);
    text-shadow: 0 0 0 ${theme.colors.glitch1}, 0 0 0 ${theme.colors.glitch2};
  }
  100% {
    transform: translate(0);
    text-shadow: 0 0 0 ${theme.colors.glitch1}, 0 0 0 ${theme.colors.glitch2};
  }
`;

const staticAnimation = keyframes`
  0% {
    opacity: 0.9;
  }
  5% {
    opacity: 0.5;
  }
  10% {
    opacity: 0.9;
  }
  15% {
    opacity: 0.7;
  }
  20% {
    opacity: 0.9;
  }
  25% {
    opacity: 0.8;
  }
  30% {
    opacity: 0.9;
  }
  35% {
    opacity: 0.6;
  }
  40% {
    opacity: 0.9;
  }
  100% {
    opacity: 0.9;
  }
`;

const GlitchContainer = styled.div`
  position: relative;
  display: inline-block;
  color: ${props => props.color || theme.colors.white};
  font-size: ${props => props.fontSize || 'inherit'};
  font-family: ${props => props.fontFamily || theme.fonts.main};
  letter-spacing: ${props => props.letterSpacing || '1px'};
  text-transform: ${props => props.uppercase ? 'uppercase' : 'none'};
  
  ${props => props.glow && `
    text-shadow: 0 0 5px ${props.color || theme.colors.white}70,
                 0 0 10px ${props.color || theme.colors.white}50,
                 0 0 15px ${props.color || theme.colors.white}30;
  `}
  
  ${props => props.intense && `
    animation: ${glitch} 2s infinite alternate-reverse;
  `}
  
  ${props => props.static && `
    animation: ${staticAnimation} 0.5s infinite alternate-reverse;
  `}
`;

const GlitchText = ({
  children,
  color,
  fontSize,
  fontFamily,
  letterSpacing,
  uppercase = false,
  glow = false,
  intense = false,
  static: isStatic = false,
  glitchTiming = 5000,
  glitchDuration = 2000,
  ...props
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  useEffect(() => {
    if (!intense && !isStatic) {
      const glitchInterval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), glitchDuration);
      }, glitchTiming);
      
      return () => clearInterval(glitchInterval);
    }
  }, [intense, isStatic, glitchTiming, glitchDuration]);
  
  return (
    <GlitchContainer
      color={color}
      fontSize={fontSize}
      fontFamily={fontFamily}
      letterSpacing={letterSpacing}
      uppercase={uppercase}
      glow={glow}
      intense={intense}
      static={isStatic}
      style={isGlitching ? { animation: `${glitch} 2s infinite alternate-reverse` } : {}}
      {...props}
    >
      {children}
    </GlitchContainer>
  );
};

export default GlitchText;
