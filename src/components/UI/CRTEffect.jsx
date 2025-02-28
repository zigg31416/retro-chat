import React from 'react';
import styled, { keyframes } from 'styled-components';

// Scanline animation
const scanline = keyframes`
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
`;

// Flicker animation
const flicker = keyframes`
  0% {
    opacity: 1;
  }
  5% {
    opacity: 0.8;
  }
  10% {
    opacity: 1;
  }
  15% {
    opacity: 0.9;
  }
  20% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  55% {
    opacity: 1;
  }
  60% {
    opacity: 0.9;
  }
  65% {
    opacity: 1;
  }
  75% {
    opacity: 0.8;
  }
  80% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
`;

// CRT off animation
const turnOff = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  60% {
    transform: scale(1, 0.01);
    opacity: 0.8;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
`;

const CRTWrapper = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.25) 50%
    );
    background-size: 100% 4px;
    z-index: 10;
    pointer-events: none;
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at center,
      rgba(18, 16, 16, 0) 0%,
      rgba(18, 16, 16, 0.1) 50%,
      rgba(18, 16, 16, 0.3) 100%
    );
    z-index: 11;
    pointer-events: none;
  }
  
  ${props => props.isOn && `
    animation: ${flicker} 0.15s infinite;
  `}
  
  ${props => props.turnOff && `
    animation: ${turnOff} 0.4s forwards;
  `}
`;

const Scanline = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  z-index: 12;
  opacity: 0.3;
  animation: ${scanline} 6s linear infinite;
  pointer-events: none;
`;

const NoiseOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/images/noise.png');
  background-size: cover;
  mix-blend-mode: overlay;
  opacity: 0.05;
  z-index: 13;
  pointer-events: none;
`;

const CRTEffect = ({ 
  children, 
  isOn = true, 
  turnOff = false,
  ...props 
}) => {
  return (
    <CRTWrapper isOn={isOn} turnOff={turnOff} {...props}>
      {children}
      <Scanline />
      <NoiseOverlay />
    </CRTWrapper>
  );
};

export default CRTEffect;
