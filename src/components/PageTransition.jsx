import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTransition = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Start entrance animation
    setIsVisible(true);
    setIsExiting(false);

    return () => {
      // Start exit animation when component unmounts
      setIsExiting(true);
      setIsVisible(false);
    };
  }, [location.pathname]);

  return (
    <div 
      className={`page-transition ${isVisible ? 'visible' : ''} ${isExiting ? 'exiting' : ''}`}
    >
      {children}
    </div>
  );
};

export default PageTransition; 