import React, { useState } from 'react';
import { usePWA } from '../hooks/usePWA.js';
import { useLanguage } from '../LanguageContext.jsx';

function InstallPrompt() {
  const { isInstallable, installApp } = usePWA();
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(true);

  if (!isInstallable || !isVisible) return null;

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      console.log('App installed successfully');
      setIsVisible(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="install-prompt">
      <div className="install-content">
        <span className="install-icon">📱</span>
        <div className="install-text">
          <h4>{t('installApp')}</h4>
          <p>{t('installDescription')}</p>
        </div>
        <button 
          className="install-button"
          onClick={handleInstall}
        >
          {t('install')}
        </button>
        <button 
          className="install-close"
          onClick={handleClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default InstallPrompt;
