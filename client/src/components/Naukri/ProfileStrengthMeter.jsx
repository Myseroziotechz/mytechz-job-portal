import React from 'react';
import './ProfileStrengthMeter.css';

const ProfileStrengthMeter = ({ profile, onImprove }) => {
  const calculateStrength = () => {
    let score = 0;
    const checks = {
      resume: { value: 20, label: 'Upload Resume' },
      skills: { value: 20, label: 'Add Skills' },
      experience: { value: 20, label: 'Add Experience' },
      education: { value: 20, label: 'Add Education' },
      profilePhoto: { value: 10, label: 'Upload Photo' },
      bio: { value: 10, label: 'Add Bio' }
    };

    const missing = [];

    if (profile?.resume) score += checks.resume.value;
    else missing.push(checks.resume.label);

    if (profile?.skills?.length > 0) score += checks.skills.value;
    else missing.push(checks.skills.label);

    if (profile?.experience) score += checks.experience.value;
    else missing.push(checks.experience.label);

    if (profile?.education) score += checks.education.value;
    else missing.push(checks.education.label);

    if (profile?.profilePhoto) score += checks.profilePhoto.value;
    else missing.push(checks.profilePhoto.label);

    if (profile?.bio) score += checks.bio.value;
    else missing.push(checks.bio.label);

    return { score, missing };
  };

  const { score, missing } = calculateStrength();

  const getStrengthLevel = () => {
    if (score >= 80) return { label: 'Excellent', color: '#4CAF50' };
    if (score >= 60) return { label: 'Good', color: '#4A90E2' };
    if (score >= 40) return { label: 'Average', color: '#FF9800' };
    return { label: 'Weak', color: '#F44336' };
  };

  const strength = getStrengthLevel();

  return (
    <div className="profile-strength-meter">
      <div className="profile-strength-header">
        <h3>Profile Strength</h3>
        <span className="profile-strength-label" style={{ color: strength.color }}>
          {strength.label}
        </span>
      </div>

      <div className="profile-strength-circle">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#F2F2F2"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={strength.color}
            strokeWidth="8"
            strokeDasharray={`${(score / 100) * 339.292} 339.292`}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dasharray 0.5s ease' }}
          />
        </svg>
        <div className="profile-strength-percentage">
          <span className="profile-strength-number">{score}%</span>
          <span className="profile-strength-text">Complete</span>
        </div>
      </div>

      {missing.length > 0 && (
        <div className="profile-strength-missing">
          <h4>Complete your profile:</h4>
          <ul>
            {missing.map((item, index) => (
              <li key={index}>
                <i className="ri-checkbox-blank-circle-line"></i>
                {item}
              </li>
            ))}
          </ul>
          {onImprove && (
            <button className="profile-strength-btn" onClick={onImprove}>
              <i className="ri-edit-line"></i>
              Improve Profile
            </button>
          )}
        </div>
      )}

      {score === 100 && (
        <div className="profile-strength-complete">
          <i className="ri-checkbox-circle-fill"></i>
          <p>Your profile is complete!</p>
        </div>
      )}
    </div>
  );
};

export default ProfileStrengthMeter;
