export const theme = {
  colors: {
    background: '#120030',
    darkPurple: '#1A0040',
    purple: '#3B0080',
    cyan: '#00FFFF',
    pink: '#FF00FF',
    lime: '#00FF00',
    yellow: '#FFFF00',
    orange: '#FF8800',
    black: '#000000',
    white: '#FFFFFF',
    text: '#FFFFFF',
    glitch1: '#0FF',
    glitch2: '#F0F',
    glitch3: '#FF0',
  },
  fonts: {
    main: '"VCR OSD Mono", monospace',
    display: '"Pixel Emulator", monospace',
  },
  sizes: {
    borderWidth: '3px',
    borderRadius: '4px',
    buttonPadding: '0.75rem 1.5rem',
    inputPadding: '0.75rem',
  },
  effects: {
    neonGlow: (color) => `
      0 0 7px ${color}80,
      0 0 10px ${color}40,
      0 0 21px ${color}40,
      0 0 42px ${color}20
    `,
    textShadow: (color) => `
      0 0 5px ${color}80,
      0 0 10px ${color}40,
      0 0 15px ${color}20
    `,
  },
  gridUnit: '8px',
  breakpoints: {
    xs: '0px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  animations: {
    fast: '0.2s',
    medium: '0.4s',
    slow: '0.6s',
  },
  utils: {
    pixelBorder: (color) => `
      border-style: solid;
      border-width: 4px;
      border-color: 
        ${color} 
        ${color} 
        ${color} 
        ${color};
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        top: -4px;
        left: -4px;
        right: -4px;
        bottom: -4px;
        border-style: solid;
        border-width: 4px;
        border-color: 
          ${color}90 
          ${color}60 
          ${color}30 
          ${color}60;
        pointer-events: none;
      }
    `,
  },
};

export default theme;
