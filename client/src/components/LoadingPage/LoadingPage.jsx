import React from 'react';
import './LoadingPage.css';

function LoadingPage() {
  return (
    <div className="mytechz-loading-page">
      <div className="mytechz-loading-container">
        {/* Logo Section */}
        <div className="mytechz-logo-section">
          <div className="mytechz-logo-icon">
            <i className="ri-briefcase-4-fill"></i>
          </div>
          <h1 className="mytechz-brand-name">MytechZ</h1>
          <p className="mytechz-tagline">Your Career Partner</p>
        </div>

        {/* Animated Dots */}
        <div className="mytechz-loading-dots">
          <span className="mytechz-dot"></span>
          <span className="mytechz-dot"></span>
          <span className="mytechz-dot"></span>
        </div>

        {/* Loading Message */}
        <p className="mytechz-loading-message">Loading opportunities for you...</p>
      </div>
    </div>
  );
}

export default LoadingPage;