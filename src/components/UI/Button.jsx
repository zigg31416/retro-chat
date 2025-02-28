import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px ${theme.colors.cyan}80, 0 0 10px ${theme.colors.cyan}40;
  }
  50% {
    box-shadow: 0 0 10px ${theme.colors.cyan}80, 0 0 20px ${theme.colors.cyan}40, 0 0 30px ${theme.colors.cyan}20;
  }
  100% {
    box-shadow: 0 0 5px ${theme.colors.cyan}80, 0 0 10px ${theme.colors.cyan}40;
  }
`;

const pressAnimation = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(2px);
  }
  100% {
    transform: translateY(0);
  }
`;

const variantStyles = {
  primary: {
    backgroundColor: theme.colors.purple,
    color: theme.colors.white,
    borderColor: theme.colors.pink,
    hoverColor: theme.colors.pink,
    glowColor: theme.colors.pink,
  },
  secondary: {
    backgroundColor: theme.colors.darkPurple,
    color: theme.colors.cyan,
    borderColor: theme.colors.cyan,
    hoverColor: theme.colors.cyan,
    glowColor: theme.colors.cyan,
  },
  success: {
    backgroundColor: theme.colors.darkPurple,
    color: theme.colors.lime,
    borderColor: theme.colors.lime,
    hoverColor: theme.colors.lime,
    glowColor: theme.colors.lime,
  },
  danger: {
    backgroundColor: theme.colors.darkPurple,
    color: theme.colors.orange,
    borderColor: theme.colors.orange,
    hoverColor: theme.colors.orange,
    glowColor: theme.colors.orange,
  },
};

const StyledButton = styled.button`
  font-family: ${theme.fonts.main};
  font-size: ${props => props.size === 'large' ? '1.5rem' : props.size === 'small' ? '0.8rem' : '1rem'};
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  padding: ${props => props.size === 'large' ? '1rem 2rem' : props.size === 'small' ? '0.5rem 1rem' : '0.75rem 1.5rem'};
  background-color: ${props => variantStyles[props.variant].backgroundColor};
  color: ${props => variantStyles[props.variant].color};
  border: 2px solid ${props => variantStyles[props.variant].borderColor};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 0 5px ${props => variantStyles[props.variant].glowColor}80, 
              0 0 10px ${props => variantStyles[props.variant].glowColor}40;
  
  ${props => props.pixelated && `
    image-rendering: pixelated;
    clip-path: polygon(
      0 0,
      100% 0,
      100% 100%,
      0 100%
    );
  `}
  
  &:hover, &:focus {
    background-color: ${props => variantStyles[props.variant].hoverColor}40;
    color: ${props => variantStyles[props.variant].hoverColor};
    box-shadow: 0 0 10px ${props => variantStyles[props.variant].hoverColor}80, 
                0 0 20px ${props => variantStyles[props.variant].hoverColor}40, 
                0 0 30px ${props => variantStyles[props.variant].hoverColor}20;
    animation: ${glowAnimation} 1.5s infinite ease-in-out;
    outline: none;
  }
  
  &:active {
    animation: ${pressAnimation} 0.2s ease-in-out;
  }
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent 0%,
      ${props => variantStyles[props.variant].hoverColor}30 50%,
      transparent 100%
    );
    transition: all 0.5s;
    z-index: 1;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  ${props => props.fullWidth && `
    width: 100%;
  `}
  
  ${props => props.disabled && `
    opacity: 0.5;
    cursor: not-allowed;
    &:hover, &:focus {
      animation: none;
      background-color: ${variantStyles[props.variant].backgroundColor};
      color: ${variantStyles[props.variant].color};
      box-shadow: none;
    }
    &::before {
      display: none;
    }
  `}
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  pixelated = true,
  onClick,
  disabled = false,
  ...props
}) => {
  return (
    <StyledButton 
      variant={variant} 
      size={size} 
      fullWidth={fullWidth}
      pixelated={pixelated}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </StyledButton>
  );
};

export default Button;
