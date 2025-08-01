import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext.jsx';

const PullToRefresh = ({ onRefresh, children }) => {
  const { language } = useLanguage();
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = (e) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (containerRef.current && containerRef.current.scrollTop === 0) {
      currentY.current = e.touches[0].clientY;
      const distance = currentY.current - startY.current;
      
      if (distance > 0) {
        e.preventDefault();
        setIsPulling(true);
        setPullDistance(Math.min(distance * 0.5, 100));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling && pullDistance > 50) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setIsPulling(false);
    setPullDistance(0);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });

      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [pullDistance, isPulling]);

  return (
    <div className="pull-to-refresh-container">
      {(isPulling || isRefreshing) && (
        <div 
          className="pull-to-refresh-indicator"
          style={{
            transform: `translateY(${pullDistance}px)`,
            opacity: Math.min(pullDistance / 50, 1)
          }}
        >
          <div className="refresh-spinner">
            {isRefreshing ? (
              <div className="spinner"></div>
            ) : (
              <div className="pull-arrow" style={{ transform: `rotate(${Math.min(pullDistance * 2, 180)}deg)` }}>
                ↓
              </div>
            )}
          </div>
          <div className="refresh-text">
            {isRefreshing 
              ? (language === 'bg' ? 'Обновяване...' : 'Refreshing...')
              : (language === 'bg' ? 'Плъзнете за обновяване' : 'Pull to refresh')
            }
          </div>
        </div>
      )}
      
      <div ref={containerRef} className="pull-to-refresh-content">
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh; 