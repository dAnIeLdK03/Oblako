import { WifiOff } from 'lucide-react';
import { useLanguage } from '../LanguageContext.jsx';
import { useOnlineStatus } from '../hooks/useOnlineStatus.js';
import styles from './OfflineBanner.module.css';

// Показва се, докато няма връзка: данните идват от кеша на service worker-а и може да са стари.
function OfflineBanner() {
  const { t } = useLanguage();
  const online = useOnlineStatus();
  if (online) return null;
  return (
    <div className={styles.banner} role="status">
      <WifiOff size={16} aria-hidden="true" /> {t('offlineNotice')}
    </div>
  );
}

export default OfflineBanner;
