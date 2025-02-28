import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../styles/theme';
import NeonBorder from './NeonBorder';
import Button from './Button';
import GlitchText from './GlitchText';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scanlines = keyframes`
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
`;

const modalIn = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-in-out;

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
      rgba(0, 0, 0, 0.2) 50%
    );
    background-size: 100% 4px;
    animation: ${scanlines} 4s linear infinite;
    pointer-events: none;
    z-index: 1001;
  }
`;

const ModalContainer = styled(NeonBorder)`
  background-color: ${theme.colors.darkPurple};
  max-width: 90%;
  width: ${props => props.width || '400px'};
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 1002;
  animation: ${modalIn} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.darkPurple};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.cyan};
    border-radius: 0;
  }
`;

const ModalHeader = styled.div`
  padding: 1rem;
  border-bottom: 2px solid ${props => props.color || theme.colors.cyan};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalTitle = styled.h3`
  margin: 0;
  color: ${props => props.color || theme.colors.pink};
  text-shadow: 0 0 5px ${props => props.color || theme.colors.pink}80,
               0 0 10px ${props => props.color || theme.colors.pink}40;
  font-family: ${theme.fonts.display};
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.white};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${theme.colors.pink};
    text-shadow: 0 0 5px ${theme.colors.pink}80,
                 0 0 10px ${theme.colors.pink}40;
  }
`;

const ModalContent = styled.div`
  padding: 1rem;
`;

const ModalFooter = styled.div`
  padding: 1rem;
  border-top: 2px solid ${props => props.color || theme.colors.cyan};
  display: flex;
  justify-content: ${props => props.justify || 'flex-end'};
  gap: 1rem;
`;

const RetroModal = ({
  isOpen,
  onClose,
  title,
  children,
  width,
  footerContent,
  footerJustify,
  color = theme.colors.cyan,
  titleColor = theme.colors.pink,
  closeOnOverlayClick = true,
  ...props
}) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  return (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContainer 
        ref={modalRef}
        width={width}
        color={color}
        pulse
        {...props}
      >
        <ModalHeader color={color}>
          <ModalTitle color={titleColor}>
            <GlitchText glow>{title}</GlitchText>
          </ModalTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        
        <ModalContent>
          {children}
        </ModalContent>
        
        {footerContent && (
          <ModalFooter color={color} justify={footerJustify}>
            {footerContent}
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default RetroModal;
