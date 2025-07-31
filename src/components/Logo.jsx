import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeContext.jsx';
import '../Weather.css';

const Logo = ({ className = '', showText = true, size = 'medium' }) => {
  const { theme } = useTheme();
  
  const getLogoPath = () => {
    return theme === 'dark' ? '/icons/DarkLogo.PNG' : '/icons/LightLogo.PNG';
  };

  const getSizeClass = () => {
    switch (size) {
      case 'small': return 'logo-small';
      case 'large': return 'logo-large';
      case 'xlarge': return 'logo-xlarge';
      case 'xxlarge': return 'logo-xxlarge';
      default: return 'logo-medium';
    }
  };

  return (
    <Link to="/" className={`logo-link ${className}`}>
      <div className={`logo-container ${getSizeClass()}`}>
        <img 
          src={getLogoPath()} 
          alt="Oblako Logo" 
          className="logo-image"
        />
        {showText && (
          <span className="logo-text">Oblako</span>
        )}
      </div>
    </Link>
  );
};

export default Logo; 