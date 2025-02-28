import React, { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { theme } from '../../styles/theme';

const cursorBlink = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
`;

const glitch = keyframes`
  0% {
    text-shadow: 0.05em 0 0 ${theme.colors.glitch1}, -0.05em -0.025em 0 ${theme.colors.glitch2};
    transform: translate(0);
  }
  2% {
    text-shadow: 0.05em 0 0 ${theme.colors.glitch1}, -0.05em -0.025em 0 ${theme.colors.glitch2};
    transform: translate(0.01em, -0.025em);
  }
  4% {
    text-shadow: -0.05em -0.025em 0 ${theme.colors.glitch1}, 0.025em 0.025em 0 ${theme.colors.glitch2};
    transform: translate(-0.01em, 0.025em);
  }
  8% {
    text-shadow: 0.05em 0 0 ${theme.colors.glitch1}, -0.05em -0.025em 0 ${theme.colors.glitch2};
    transform: translate(0);
  }
  100% {
    text-shadow: none;
    transform: translate(0);
  }
`;

const InputStyles = css`
  font-family: ${theme.fonts.main};
  font-size: 1rem;
  padding: 0.75rem;
  background-color: ${theme.colors.darkPurple};
  color: ${theme.colors.white};
  border: 2px solid ${theme.colors.cyan};
  width: 100%;
  outline: none;
  transition: all 0.3s ease;
  position: relative;
  
  &:focus {
    border-color: ${theme.colors.pink};
    box-shadow: 0 0 10px ${theme.colors.pink}80, 
                0 0 20px ${theme.colors.pink}40;
  }
  
  &::placeholder {
    color: ${theme.colors.white}60;
    opacity: 0.6;
  }
  
  ${props => props.glitchEffect && `
    &:hover, &:focus {
      animation: ${glitch} 0.5s forwards;
    }
  `}
`;

const InputContainer = styled.div`
  position: relative;
  width: ${props => props.width || '100%'};
  margin: ${props => props.margin || '0'};
`;

const StyledInput = styled.input`
  ${InputStyles}
`;

const StyledTextarea = styled.textarea`
  ${InputStyles}
  resize: ${props => props.resize || 'none'};
  min-height: ${props => props.minHeight || 'auto'};
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-family: ${theme.fonts.main};
  color: ${theme.colors.cyan};
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  
  ${props => props.glow && `
    text-shadow: 0 0 5px ${theme.colors.cyan}80,
                 0 0 10px ${theme.colors.cyan}40;
  `}
`;

const PixelatedInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  width,
  margin,
  resize,
  minHeight,
  multiline = false,
  glitchEffect = true,
  labelGlow = true,
  ...props
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  
  const handleFocus = (e) => {
    setHasFocus(true);
    if (onFocus) onFocus(e);
  };
  
  const handleBlur = (e) => {
    setHasFocus(false);
    if (onBlur) onBlur(e);
  };
  
  return (
    <InputContainer width={width} margin={margin}>
      {label && (
        <InputLabel htmlFor={name} glow={labelGlow}>
          {label}
        </InputLabel>
      )}
      
      {multiline ? (
        <StyledTextarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          resize={resize}
          minHeight={minHeight}
          glitchEffect={glitchEffect}
          {...props}
        />
      ) : (
        <StyledInput
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          glitchEffect={glitchEffect}
          {...props}
        />
      )}
    </InputContainer>
  );
};

export default PixelatedInput;
