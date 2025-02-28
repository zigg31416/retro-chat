import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const neonPulse = keyframes`
  0% {
    box-shadow: 0 0 5px ${theme.colors.cyan}80, 
                0 0 10px ${theme.colors.cyan}40, 
                0 0 15px ${theme.colors.cyan}20;
  }
  50% {
    box-shadow: 0 0 10px ${theme.colors.cyan}80, 
                0 0 20px ${theme.colors.cyan}40, 
                0 0 30px ${theme.colors.cyan}20;
  }
  100% {
    box-shadow: 0 0 5px ${theme.colors.cyan}80, 
                0 0 10px ${theme.colors.cyan}40, 
                0 0 15px ${theme.colors.cyan}20;
  }
`;

const BorderContainer = styled.div`
  position: relative;
  padding: ${props => props.padding || '1rem'};
  border: ${props => props.borderWidth || '2px'} solid ${props => props.color || theme.colors.cyan};
  box-shadow: 0 0 5px ${props => props.color || theme.colors.cyan}80, 
              0 0 10px ${props => props.color || theme.colors.cyan}40, 
              0 0 15px ${props => props.color || theme.colors.cyan}20;
  background-color: ${props => props.backgroundColor || 'transparent'};
  width: ${props => props.width || 'auto'};
  max-width: ${props => props.maxWidth || 'none'};
  height: ${props => props.height || 'auto'};
  
  ${props => props.pulse && `
    animation: ${neonPulse} 2s infinite ease-in-out;
  `}
  
  ${props => props.pixelated && `
    image-rendering: pixelated;
    clip-path: polygon(
      0 0,
      100% 0,
      100% 100%,
      0 100%
    );
  `}
  
  ${props => props.corners && `
    &::before,
    &::after,
    & > span::before,
    & > span::after {
      content: '';
      position: absolute;
      width: 10px;
      height: 10px;
      border-color: ${props.color || theme.colors.cyan};
      border-style: solid;
    }
    
    &::before {
      top: 0;
      left: 0;
      border-width: 2px 0 0 2px;
    }
    
    &::after {
      top: 0;
      right: 0;
      border-width: 2px 2px 0 0;
    }
    
    & > span::before {
      bottom: 0;
      left: 0;
      border-width: 0 0 2px 2px;
    }
    
    & > span::after {
      bottom: 0;
      right: 0;
      border-width: 0 2px 2px 0;
    }
  `}
`;

const NeonBorder = ({
  children,
  color,
  backgroundColor,
  borderWidth,
  padding,
  width,
  maxWidth,
  height,
  pulse = false,
  pixelated = false,
  corners = false,
  ...props
}) => {
  return (
    <BorderContainer
      color={color}
      backgroundColor={backgroundColor}
      borderWidth={borderWidth}
      padding={padding}
      width={width}
      maxWidth={maxWidth}
      height={height}
      pulse={pulse}
      pixelated={pixelated}
      corners={corners}
      {...props}
    >
      {corners && <span />}
      {children}
    </BorderContainer>
  );
};

export default NeonBorder;
