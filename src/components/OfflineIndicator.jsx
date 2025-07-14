import React from 'react';
import { usePWA } from '../hooks/usePWA.js';
import { useLanguage } from '../LanguageContext.jsx';

function OfflineIndicator() {
  const { isOnline } = usePWA();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="offline-indicator">
      <span className="offline-icon">📡</span>
      <span className="offline-text">{t('offlineMode')}</span>
    </div>
  );
}

export default OfflineIndicator;
