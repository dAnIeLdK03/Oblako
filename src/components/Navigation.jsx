import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import { useTheme } from '../ThemeContext.jsx';
import Logo from './Logo.jsx';

function Navigation() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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



  // Update main content margin based on menu state
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      const isMobile = window.innerWidth <= 768;
      if (isMenuOpen && !isMobile) {
        mainContent.style.marginLeft = '280px';
        mainContent.style.transition = 'margin-left 0.3s ease';
      } else {
        mainContent.style.marginLeft = '0';
        mainContent.style.transition = 'margin-left 0.3s ease';
      }
    }
  }, [isMenuOpen]);

  // Close menu when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile && isMenuOpen) {
        const nav = document.querySelector('.navigation');
        const button = document.querySelector('[style*="position: fixed"]');
        
        if (nav && !nav.contains(e.target) && button && !button.contains(e.target)) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  return (
    <>
             {/* Draggable menu button */}
       <div 
         style={{
           position: 'fixed',
           top: '20px',
           right: '20px',
           zIndex: 99999,
           width: window.innerWidth <= 768 ? '45px' : '40px',
           height: window.innerWidth <= 768 ? '45px' : '40px',
           background: 'var(--accent-color)',
           border: '2px solid var(--border-color)',
           backdropFilter: 'blur(10px)',
           borderRadius: '12px',
           cursor: 'pointer',
           display: 'flex',
           flexDirection: 'column',
           justifyContent: 'center',
           alignItems: 'center',
           padding: window.innerWidth <= 768 ? '10px' : '8px',
           boxShadow: '0 4px 20px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
           userSelect: 'none',
           transition: 'all 0.2s ease',
           touchAction: 'none'
         }} 
                   onClick={undefined}
         onClick={toggleMenu}
         title={language === 'bg' ? 'Отвори меню' : 'Open menu'}
       >
                   <span style={{
            width: '100%', 
            height: window.innerWidth <= 768 ? '4px' : '3px', 
            background: 'white', 
            margin: '1px 0', 
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}></span>
          <span style={{
            width: '100%', 
            height: window.innerWidth <= 768 ? '4px' : '3px', 
            background: 'white', 
            margin: '1px 0', 
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}></span>
          <span style={{
            width: '100%', 
            height: window.innerWidth <= 768 ? '4px' : '3px', 
            background: 'white', 
            margin: '1px 0', 
            borderRadius: '2px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.3)'
          }}></span>
       </div>

      <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
        

             {/* Navigation Menu */}
       <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
         <div className="nav-header">
           <Logo size="xlarge" showText={false} />
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