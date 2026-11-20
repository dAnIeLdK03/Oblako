import { Link } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import { useSeo } from '../hooks/useSeo.js';
import '../Weather.css';

function NotFound() {
  const { t } = useLanguage();
  useSeo('notFound');

  return (
    <div className="page-header" style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1>404</h1>
      <h2>{t('notFoundTitle')}</h2>
      <p>{t('notFoundText')}</p>
      <p>
        <Link to="/">{t('backHome')}</Link>
      </p>
    </div>
  );
}

export default NotFound;
