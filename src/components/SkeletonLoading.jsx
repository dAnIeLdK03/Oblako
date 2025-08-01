import React from 'react';
import '../Weather.css';

const SkeletonLoading = () => {
  return (
    <div className="skeleton-container">
      {/* Main weather skeleton */}
      <div className="skeleton-main-weather">
        <div className="skeleton-icon"></div>
        <div className="skeleton-info">
          <div className="skeleton-city"></div>
          <div className="skeleton-temp"></div>
          <div className="skeleton-desc"></div>
        </div>
      </div>

      {/* Weather parameters skeleton */}
      <div className="skeleton-parameters">
        <div className="skeleton-parameter">
          <div className="skeleton-param-icon"></div>
          <div className="skeleton-param-info">
            <div className="skeleton-param-label"></div>
            <div className="skeleton-param-value"></div>
          </div>
        </div>
        <div className="skeleton-parameter">
          <div className="skeleton-param-icon"></div>
          <div className="skeleton-param-info">
            <div className="skeleton-param-label"></div>
            <div className="skeleton-param-value"></div>
          </div>
        </div>
        <div className="skeleton-parameter">
          <div className="skeleton-param-icon"></div>
          <div className="skeleton-param-info">
            <div className="skeleton-param-label"></div>
            <div className="skeleton-param-value"></div>
          </div>
        </div>
        <div className="skeleton-parameter">
          <div className="skeleton-param-icon"></div>
          <div className="skeleton-param-info">
            <div className="skeleton-param-label"></div>
            <div className="skeleton-param-value"></div>
          </div>
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className="skeleton-forecast">
        <div className="skeleton-forecast-title"></div>
        <div className="skeleton-forecast-cards">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="skeleton-forecast-card">
              <div className="skeleton-card-day"></div>
              <div className="skeleton-card-icon"></div>
              <div className="skeleton-card-temp"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonLoading; 