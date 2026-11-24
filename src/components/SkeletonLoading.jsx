import React from 'react';
import styles from './SkeletonLoading.module.css';

const SkeletonLoading = () => {
  return (
    <div className={styles['skeleton-container']}>
      {/* Main weather skeleton */}
      <div className={styles['skeleton-main-weather']}>
        <div className={styles['skeleton-icon']}></div>
        <div className={styles['skeleton-info']}>
          <div className={styles['skeleton-city']}></div>
          <div className={styles['skeleton-temp']}></div>
          <div className={styles['skeleton-desc']}></div>
        </div>
      </div>

      {/* Weather parameters skeleton */}
      <div className={styles['skeleton-parameters']}>
        <div className={styles['skeleton-parameter']}>
          <div className={styles['skeleton-param-icon']}></div>
          <div className={styles['skeleton-param-info']}>
            <div className={styles['skeleton-param-label']}></div>
            <div className={styles['skeleton-param-value']}></div>
          </div>
        </div>
        <div className={styles['skeleton-parameter']}>
          <div className={styles['skeleton-param-icon']}></div>
          <div className={styles['skeleton-param-info']}>
            <div className={styles['skeleton-param-label']}></div>
            <div className={styles['skeleton-param-value']}></div>
          </div>
        </div>
        <div className={styles['skeleton-parameter']}>
          <div className={styles['skeleton-param-icon']}></div>
          <div className={styles['skeleton-param-info']}>
            <div className={styles['skeleton-param-label']}></div>
            <div className={styles['skeleton-param-value']}></div>
          </div>
        </div>
        <div className={styles['skeleton-parameter']}>
          <div className={styles['skeleton-param-icon']}></div>
          <div className={styles['skeleton-param-info']}>
            <div className={styles['skeleton-param-label']}></div>
            <div className={styles['skeleton-param-value']}></div>
          </div>
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className={styles['skeleton-forecast']}>
        <div className={styles['skeleton-forecast-title']}></div>
        <div className={styles['skeleton-forecast-cards']}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={styles['skeleton-forecast-card']}>
              <div className={styles['skeleton-card-day']}></div>
              <div className={styles['skeleton-card-icon']}></div>
              <div className={styles['skeleton-card-temp']}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading;
