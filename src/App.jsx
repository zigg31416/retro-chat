import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import NotFoundPage from './pages/NotFoundPage';
import GlobalStyles from './styles/GlobalStyles';
import { Howl } from 'howler';

// Import audio files
const powerOnSound = new Howl({
  src: ['/sounds/power-on.mp3'],
  volume: 0.5
});

const buttonClickSound = new Howl({
  src: ['/sounds/button-click.mp3'],
  volume: 0.3
});

const notificationSound = new Howl({
  src: ['/sounds/notification.mp3'],
  volume: 0.4
});

const App = () => {
  // Play power-on sound when app loads
  useEffect(() => {
    powerOnSound.play();
    
    // Add click sound to buttons
    const addButtonSounds = () => {
      document.addEventListener('click', e => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
          buttonClickSound.play();
        }
      });
    };
    
    addButtonSounds();
    
    // Clean up function
    return () => {
      powerOnSound.unload();
      buttonClickSound.unload();
      notificationSound.unload();
    };
  }, []);
  
  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
