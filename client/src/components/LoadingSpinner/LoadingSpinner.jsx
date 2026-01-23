import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner({ message = 'Loading opportunities for you...' }) {
  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner-content">
        {/* Logo/Brand Section */}
        <div className="loading-brand">
          <div className="loading-icon">
            <i className="ri-briefcase-4-fill"></i>
          </div>
          <h2 className="loading-brand-name">MytechZ</h2>
          <p className="loading-tagline">Your Career Partner</p>
        </div>

        {/* Animated Dots */}
        <div className="loading-dots">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        {/* Loading Message */}
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;