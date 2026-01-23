import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareModal from '../ShareModal/ShareModal';
import './JobModal.css';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

function JobModal({ job, isOpen, onClose }) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  // Check if already applied on component mount
  React.useEffect(() => {
    if (job) {
      const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
      setHasApplied(appliedJobs.includes(job.id || job._id));
    }
  }, [job]);
  
  if (!isOpen || !job) return null;
  
  // Map database fields to display fields
  const displayJob = {
    ...job,
    title: job.job_title || job.title,
    company: job.company_name || job.company || job.recruiter_name || 'Company',
    overview: job.job_description || job.overview || 'No description available',
    requirements: job.requirements || (job.key_responsibilities ? JSON.parse(job.key_responsibilities) : []),
    highlights: job.benefits_and_perks ? JSON.parse(job.benefits_and_perks) : (job.highlights || []),
    skills: job.requiredSkills || (job.required_skills ? JSON.parse(job.required_skills) : (job.skills || [])),
    salary: formatDatabaseSalary(job),
    deadline: job.application_deadline || job.deadline,
    datePosted: job.created_at ? formatDate(job.created_at) : job.datePosted,
    closingDate: job.application_deadline ? formatDate(job.application_deadline) : job.closingDate,
    location: job.location,
    careerLevel: job.experience_level || job.careerLevel || 'Not specified',
    qualification: job.qualification || 'Not specified',
    experience: job.experience_level || job.experience || 'Not specified',
    quantity: job.quantity || '1 Person',
    jobType: job.job_type || job.jobType,
    workMode: job.work_mode || job.workMode
  };
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  
  function formatDatabaseSalary(job) {
    if (job.min_salary || job.max_salary) {
      const currency = job.currency === 'INR' ? '₹' : job.currency === 'USD' ? '$' : '€';
      if (job.min_salary && job.max_salary) {
        return `${currency}${parseInt(job.min_salary).toLocaleString()} - ${currency}${parseInt(job.max_salary).toLocaleString()}`;
      }
      return job.min_salary ? `${currency}${parseInt(job.min_salary).toLocaleString()}+` : `${currency}${parseInt(job.max_salary).toLocaleString()}`;
    }
    return job.salary || 'Not disclosed';
  }
  
  const handleApply = async (e) => {
    e.stopPropagation();
    
    if (hasApplied) {
      if (window.showPopup) {
        window.showPopup('You have already applied to this job', 'info');
      }
      return;
    }
    
    setIsLoading(true);
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      setIsLoading(false);
      if (window.showPopup) {
        window.showPopup('Please login to apply', 'warning');
      } else {
        alert('Please login to apply for this job');
      }
      navigate('/login');
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/applications/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          jobId: job.id,
          jobTitle: displayJob.title,
          company: displayJob.company,
          location: displayJob.location,
          salary: displayJob.salary
        })
      });
      
      if (response.ok) {
        // Mark as applied
        const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        appliedJobs.push(job.id || job._id);
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
        setHasApplied(true);
        
        if (window.showPopup) {
          window.showPopup('Applied successfully!', 'success');
        } else {
          alert('Application submitted successfully!');
        }
        setIsLoading(false);
      } else {
        console.error('Application failed:', response.status);
        // Still mark as applied locally
        const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        appliedJobs.push(job.id || job._id);
        localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
        setHasApplied(true);
        
        if (window.showPopup) {
          window.showPopup('Applied! We will contact you.', 'success');
        } else {
          alert('Application submitted! We will contact you soon.');
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      setIsLoading(false);
      if (window.showPopup) {
        window.showPopup('An error occurred. Please try again.', 'error');
      } else {
        alert('An error occurred. Please try again.');
      }
    }
  };
  
  const handleGetLink = (e) => {
    e.stopPropagation();
    if (job.applicationLink) {
      window.open(job.applicationLink, '_blank');
    } else {
      const jobUrl = `${window.location.origin}/jobs/private/${job.id || job._id}`;
      navigator.clipboard.writeText(jobUrl);
      if (window.showPopup) {
        window.showPopup('Link copied!', 'success');
      } else {
        alert('Job link copied to clipboard!');
      }
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    if (salary.includes('₹') || salary.includes('$') || salary.includes('€')) {
      return salary; // Already formatted
    }
    if (salary.includes('-')) {
      return `₹${salary.replace('-', ' - ₹')}`;
    }
    return `₹${salary}`;
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return 'No deadline';
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  return (
    <>
      {isLoading && <LoadingSpinner message="Submitting application..." />}
      <div className="job-modal-overlay" onClick={onClose}>
      <div className="job-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>
          <i className="ri-close-line"></i>
        </button>
        
        <div className="modal-header">
          <div className="modal-header-content">
            <div className="modal-logo-section">
              <div className="modal-company-logo">
                {displayJob.companyLogo ? (
                  <img src={displayJob.companyLogo} alt={`${displayJob.company} logo`} />
                ) : (
                  <div className="modal-default-logo">
                    <i className="ri-building-line"></i>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-title-section">
              <h2>{displayJob.title}</h2>
              <p className="modal-company">
                <i className="ri-building-line"></i>
                {displayJob.company}
              </p>
              <div className="modal-meta">
                <span className="modal-meta-item">
                  <i className="ri-briefcase-line"></i>
                  {displayJob.jobType}
                </span>
                <span className="modal-meta-item">
                  <i className="ri-home-office-line"></i>
                  {displayJob.workMode}
                </span>
                <span className="modal-meta-item">
                  <i className="ri-map-pin-line"></i>
                  {displayJob.location}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-content">
          <div className="job-overview">
            <h3>Overview</h3>
            <p>{displayJob.overview}</p>
          </div>

          {displayJob.requirements && displayJob.requirements.length > 0 && (
            <div className="job-requirements">
              <h3>Requirements</h3>
              <ul>
                {displayJob.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {displayJob.highlights && displayJob.highlights.length > 0 && (
            <div className="job-highlights">
              <h3>Job Highlights</h3>
              <div className="highlights-grid">
                {displayJob.highlights.map((highlight, index) => (
                  <div key={index} className="highlight-item">
                    <i className="ri-check-line"></i>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {displayJob.skills && displayJob.skills.length > 0 && (
            <div className="job-skills-tags">
              <h3>Skills</h3>
              <div className="skills-container">
                {displayJob.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {displayJob.photos && displayJob.photos.length > 0 && (
            <div className="job-photos">
              <h3>Photos</h3>
              <div className="photos-grid">
                {displayJob.photos.map((photo, index) => (
                  <img key={index} src={photo} alt={`Job photo ${index + 1}`} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="job-insights">
          <h3>Job Role Insights</h3>
          <div className="insights-grid">
            <div className="insight-item">
              <span className="insight-label">Date Posted</span>
              <span className="insight-value">{displayJob.datePosted}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Closing Date</span>
              <span className="insight-value">{displayJob.closingDate}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Hiring Location</span>
              <span className="insight-value">{displayJob.location}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Offered Salary</span>
              <span className="insight-value">{formatSalary(displayJob.salary)}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Job Type</span>
              <span className="insight-value">{displayJob.jobType}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Work Mode</span>
              <span className="insight-value">{displayJob.workMode}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Experience</span>
              <span className="insight-value">{displayJob.experience}</span>
            </div>
            <div className="insight-item">
              <span className="insight-label">Positions</span>
              <span className="insight-value">{displayJob.quantity}</span>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <div className="deadline-info">
            <span className={`deadline-status ${getDaysLeft(displayJob.deadline).includes('Expired') ? 'expired' : ''}`}>
              {getDaysLeft(displayJob.deadline)}
            </span>
          </div>
          <div className="action-buttons">
            <button 
              className="share-btn-modal" 
              onClick={(e) => {
                e.stopPropagation();
                setShowShareModal(true);
              }}
            >
              <i className="ri-share-line"></i>
              Share
            </button>
            <button className="get-link-btn-modal" onClick={handleGetLink}>
              <i className="ri-external-link-line"></i>
              Get Link
            </button>
            <button 
              className={`apply-btn-modal ${hasApplied ? 'applied' : ''}`}
              onClick={handleApply}
              disabled={hasApplied}
            >
              <i className={hasApplied ? "ri-check-line" : "ri-send-plane-line"}></i>
              {hasApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <ShareModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
      shareUrl={`${window.location.origin}/jobs/${job.id || job._id}`}
      title={displayJob.title}
      type="Job"
    />
    </>
  );
}

export default JobModal;