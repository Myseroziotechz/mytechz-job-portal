import React from 'react';
import './GovernmentJobs.css';

function GovernmentJobs() {
  return (
    <div className="government-jobs-container">
      <div className="coming-soon-content">
        <div className="coming-soon-icon">
          <i className="ri-government-line"></i>
        </div>
        <h1 className="coming-soon-title">Government Jobs</h1>
        <p className="coming-soon-subtitle">Coming Soon</p>
        <p className="coming-soon-description">
          We're working hard to bring you the best government job opportunities. 
          Stay tuned for updates!
        </p>
        <div className="coming-soon-features">
          <div className="feature-item">
            <i className="ri-checkbox-circle-line"></i>
            <span>Central Government Jobs</span>
          </div>
          <div className="feature-item">
            <i className="ri-checkbox-circle-line"></i>
            <span>State Government Jobs</span>
          </div>
          <div className="feature-item">
            <i className="ri-checkbox-circle-line"></i>
            <span>Public Sector Jobs</span>
          </div>
          <div className="feature-item">
            <i className="ri-checkbox-circle-line"></i>
            <span>Banking & SSC</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovernmentJobs;
