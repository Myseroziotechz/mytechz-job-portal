import React, { useState } from 'react';
import './CandidateCard.css';

function CandidateCard({ candidate, onSave, onView }) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave(candidate.id);
  };

  const getExperienceColor = (experience) => {
    const years = parseInt(experience);
    if (years <= 1) return '#22c55e'; // Green for fresher
    if (years <= 3) return '#3b82f6'; // Blue for junior
    if (years <= 5) return '#f59e0b'; // Orange for mid-level
    return '#ef4444'; // Red for senior
  };

  const getProfileCompletionColor = (completion) => {
    if (completion >= 90) return '#22c55e';
    if (completion >= 70) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="candidate-card" onClick={() => onView(candidate)}>
      <div className="candidate-card-header">
        <div className="candidate-avatar">
          {candidate.profilePhoto ? (
            <img src={candidate.profilePhoto} alt={candidate.name} />
          ) : (
            <div className="default-avatar">
              <i className="ri-user-line"></i>
            </div>
          )}
        </div>
        
        <div className="candidate-info">
          <h3 className="candidate-name">{candidate.name}</h3>
          <p className="candidate-role">{candidate.jobRole}</p>
          <div className="candidate-experience">
            <span 
              className="experience-badge"
              style={{ backgroundColor: getExperienceColor(candidate.experience) }}
            >
              {candidate.experience} exp
            </span>
          </div>
        </div>

        <div className="candidate-actions">
          <button
            className={`save-btn ${isSaved ? 'saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSave();
            }}
            title={isSaved ? 'Remove from saved' : 'Save profile'}
          >
            <i className={isSaved ? 'ri-bookmark-fill' : 'ri-bookmark-line'}></i>
          </button>
        </div>
      </div>

      <div className="candidate-skills">
        <div className="skills-container">
          {candidate.skills.slice(0, 4).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {candidate.skills.length > 4 && (
            <span className="skill-tag more">
              +{candidate.skills.length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="candidate-details">
        <div className="detail-item">
          <i className="ri-map-pin-line"></i>
          <span>{candidate.location}</span>
        </div>
        <div className="detail-item">
          <i className="ri-money-dollar-circle-line"></i>
          <span>{candidate.expectedSalary}</span>
        </div>
        <div className="detail-item">
          <i className="ri-graduation-cap-line"></i>
          <span>{candidate.education}</span>
        </div>
      </div>

      <div className="candidate-footer">
        <div className="profile-completion">
          <div className="completion-bar">
            <div 
              className="completion-fill"
              style={{ 
                width: `${candidate.profileCompletion}%`,
                backgroundColor: getProfileCompletionColor(candidate.profileCompletion)
              }}
            ></div>
          </div>
          <span className="completion-text">
            {candidate.profileCompletion}% complete
          </span>
        </div>
        
        <div className="last-active">
          <i className="ri-time-line"></i>
          <span>Active {candidate.lastActive}</span>
        </div>
      </div>

      <div className="candidate-card-actions">
        <button 
          className="view-profile-btn"
          onClick={(e) => {
            e.stopPropagation();
            onView(candidate);
          }}
        >
          <i className="ri-eye-line"></i>
          View Profile
        </button>
        <button 
          className="contact-btn"
          onClick={(e) => {
            e.stopPropagation();
            // Handle contact functionality
            window.location.href = `/recruiter/contact/${candidate.id}`;
          }}
        >
          <i className="ri-message-line"></i>
          Contact
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;