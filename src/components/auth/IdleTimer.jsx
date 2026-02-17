import React, { useEffect, useRef } from 'react';
import { logout } from '../../services/authService';

const IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

const IdleTimer = ({ children }) => {
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      console.log('User idle for 30 minutes. Logging out...');
      logout();
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    // Events to watch for
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Initialize timer
    resetTimer();

    // Add event listeners
    const handleActivity = () => resetTimer();
    
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return <>{children}</>;
};

export default IdleTimer;
