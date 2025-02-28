import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';
import './fonts.css';

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'VCR OSD Mono';
    src: url('/fonts/VCR_OSD_MONO.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  @font-face {
    font-family: 'Pixel Emulator';
    src: url('/fonts/PixelEmulator.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html, body {
    overflow-x: hidden;
  }

  body {
    font-family: 'VCR OSD Mono', monospace;
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    min-height: 100vh;
    position: relative;
    
    &::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: linear-gradient(
        to bottom,
        rgba(18, 16, 16, 0) 50%,
        rgba(0, 0, 0, 0.25) 50%
      );
      background-size: 100% 4px;
      z-index: 1000;
    }

    &::after {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      background: radial-gradient(
        circle at center,
        rgba(18, 16, 16, 0) 0%,
        rgba(18, 16, 16, 0.1) 50%,
        rgba(18, 16, 16, 0.3) 100%
      );
      z-index: 1001;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Pixel Emulator', monospace;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    color: ${theme.colors.cyan};
    text-shadow: 0 0 10px ${theme.colors.cyan}80,
                 0 0 20px ${theme.colors.cyan}40,
                 0 0 30px ${theme.colors.cyan}20;
  }

  a {
    color: ${theme.colors.pink};
    text-decoration: none;
    transition: all 0.3s ease;
    
    &:hover {
      color: ${theme.colors.lime};
      text-shadow: 0 0 5px ${theme.colors.lime}80;
    }
  }

  input, textarea, button {
    font-family: 'VCR OSD Mono', monospace;
  }

  input, textarea {
    background: ${theme.colors.darkPurple};
    color: ${theme.colors.text};
    border: 2px solid ${theme.colors.cyan};
    padding: 0.75rem;
    outline: none;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: ${theme.colors.pink};
      box-shadow: 0 0 10px ${theme.colors.pink}80;
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    position: relative;
    z-index: 2;
  }

  /* Pixel-style selection */
  ::selection {
    background: ${theme.colors.pink};
    color: ${theme.colors.black};
    text-shadow: none;
  }

  /* WebKit scrollbar styles */
  ::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.darkPurple};
    border-left: 1px solid ${theme.colors.purple};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.purple};
    border: 1px solid ${theme.colors.cyan};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.pink};
  }

  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }

  /* Glitch animation for text */
  @keyframes glitch {
    0% {
      transform: translate(0);
    }
    20% {
      transform: translate(-2px, 2px);
    }
    40% {
      transform: translate(-2px, -2px);
    }
    60% {
      transform: translate(2px, 2px);
    }
    80% {
      transform: translate(2px, -2px);
    }
    100% {
      transform: translate(0);
    }
  }

  /* Neon flicker animation */
  @keyframes flicker {
    0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
      opacity: 1;
    }
    20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
      opacity: 0.8;
    }
  }

  /* Typing animation */
  @keyframes typing {
    from { width: 0 }
    to { width: 100% }
  }

  /* CRT off animation */
  @keyframes turn-off {
    0% {
      transform: scale(1, 1);
      opacity: 1;
    }
    60% {
      transform: scale(1, 0.01);
      opacity: 0.8;
    }
    100% {
      transform: scale(0, 0);
      opacity: 0;
    }
  }
`;

export default GlobalStyles;
