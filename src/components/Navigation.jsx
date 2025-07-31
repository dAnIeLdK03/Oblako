import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';

function Navigation() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [buttonPosition, setButtonPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const menuItems = [
    {
      path: '/',
      icon: '🌤️',
      label: language === 'bg' ? 'Начало' : 'Home',
      description: language === 'bg' ? 'Текущо време' : 'Current weather'
    },
    {
      path: '/forecast',
      icon: '📅',
      label: language === 'bg' ? 'Прогноза' : 'Forecast',
      description: language === 'bg' ? 'Детайлна прогноза' : 'Detailed forecast'
    },
    {
      path: '/rain-chance',
      icon: '🌧️',
      label: language === 'bg' ? 'Валежи' : 'Rain Chance',
      description: language === 'bg' ? 'Вероятност за валежи' : 'Precipitation probability'
    },
    {
      path: '/air-quality',
      icon: '🌬️',
      label: language === 'bg' ? 'Качество на въздуха' : 'Air Quality',
      description: language === 'bg' ? 'Индекс на качеството' : 'Air quality index'
    },
    {
      path: '/weather-tips',
      icon: '💡',
      label: language === 'bg' ? 'Съвети' : 'Tips',
      description: language === 'bg' ? 'Полезни съвети' : 'Useful tips'
    },
    {
      path: '/about',
      icon: 'ℹ️',
      label: language === 'bg' ? 'За нас' : 'About',
      description: language === 'bg' ? 'Информация за приложението' : 'App information'
    }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle mouse events for dragging
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep button within viewport bounds
      const maxX = window.innerWidth - 40;
      const maxY = window.innerHeight - 40;
      
      setButtonPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  // Update main content margin based on menu state
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (isMenuOpen) {
        mainContent.style.marginLeft = '280px';
        mainContent.style.transition = 'margin-left 0.3s ease';
      } else {
        mainContent.style.marginLeft = '0';
        mainContent.style.transition = 'margin-left 0.3s ease';
      }
    }
  }, [isMenuOpen]);

  return (
    <>
             {/* Draggable menu button */}
       <div 
         style={{
           position: 'fixed',
           top: `${buttonPosition.y}px`,
           left: `${buttonPosition.x}px`,
           zIndex: 99999,
           width: '40px',
           height: '40px',
           background: 'var(--accent-color)',
           border: '2px solid var(--border-color)',
           borderRadius: '10px',
           cursor: isDragging ? 'grabbing' : 'grab',
           display: 'flex',
           flexDirection: 'column',
           justifyContent: 'center',
           alignItems: 'center',
           padding: '8px',
           boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
           userSelect: 'none',
           transition: 'all 0.2s ease'
         }} 
         onClick={!isDragging ? toggleMenu : undefined}
         onMouseDown={handleMouseDown}
         title={language === 'bg' ? 'Премести бутона' : 'Drag to move button'}
       >
         <span style={{width: '100%', height: '3px', background: 'white', margin: '1px 0', borderRadius: '2px'}}></span>
         <span style={{width: '100%', height: '3px', background: 'white', margin: '1px 0', borderRadius: '2px'}}></span>
         <span style={{width: '100%', height: '3px', background: 'white', margin: '1px 0', borderRadius: '2px'}}></span>
       </div>

      <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
        

      {/* Navigation Menu */}
      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-header">
          <h2>{language === 'bg' ? 'Oblako' : 'Oblako'}</h2>
          <p>{language === 'bg' ? 'Времето в реално време' : 'Real-time weather'}</p>
        </div>

        <ul className="nav-list">
          {menuItems.map((item, index) => (
            <li key={index} className={`nav-item ${isActive(item.path) ? 'active' : ''}`}>
              <Link 
                to={item.path} 
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="nav-icon">{item.icon}</div>
                <div className="nav-content">
                  <div className="nav-label">{item.label}</div>
                  <div className="nav-description">{item.description}</div>
                </div>
                {isActive(item.path) && (
                  <div className="nav-indicator">●</div>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-footer">
          <div className="nav-theme">
            <span>{language === 'bg' ? 'Тема:' : 'Theme:'}</span>
            <span className="theme-indicator">
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </div>
        </div>
      </div>

             {/* Overlay for closing menu */}
       <div 
         className="nav-overlay" 
         onClick={() => setIsMenuOpen(false)}
       ></div>
     </nav>
   </>
   );
 }

export default Navigation; 