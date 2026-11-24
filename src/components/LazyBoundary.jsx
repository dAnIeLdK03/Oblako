import { Component, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../LanguageContext.jsx';
import styles from './LazyBoundary.module.css';

function LoadError() {
  const { t } = useLanguage();
  return (
    <div className={styles['load-error']} role="alert">
      <p>{t('loadError')}</p>
      <button type="button" onClick={() => window.location.reload()}>
        {t('reloadPage')}
      </button>
    </div>
  );
}

// Грешка при зареждане на чанк (няма мрежа, или след нова версия старият файл вече го няма)
// не бива да оставя бял екран. resetKey нулира грешката (напр. при смяна на страницата).
class ErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidUpdate(prev) {
    if (this.state.failed && prev.resetKey !== this.props.resetKey)
      this.setState({ failed: false });
  }

  render() {
    return this.state.failed ? <LoadError /> : this.props.children;
  }
}

// Suspense с резервен изглед + прихващане на грешки при зареждане на React.lazy компонент.
export function LazyBoundary({ fallback = null, resetKey, children }) {
  return (
    <ErrorBoundary resetKey={resetKey}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

// Същото за страниците: грешката се чисти при навигация.
export function RouteBoundary({ children }) {
  const { pathname } = useLocation();
  return (
    <LazyBoundary
      resetKey={pathname}
      fallback={<div className={styles['page-fallback']} aria-busy="true" />}
    >
      {children}
    </LazyBoundary>
  );
}

// Резервни изгледи със същия размер като истинските, за да не "скача" страницата
export const MapPlaceholder = () => (
  <div className={`${styles.placeholder} ${styles.map}`} aria-busy="true" />
);
export const ChartPlaceholder = () => (
  <div className={`${styles.placeholder} ${styles.chart}`} aria-busy="true" />
);
