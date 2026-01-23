import { Link, useNavigate } from 'react-router-dom';
import slugify from '../../utils/slugify';
import React, { useState } from 'react';
import ShareModal from '../ShareModal/ShareModal';
import './JobCard.css';

function JobCard({ job, onClick }) {
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Map database fields to component fields for compatibility
  const mappedJob = {
    ...job,
    title: job.job_title || job.title,
    // Priority: company_name from profile > company field > recruiter_name as fallback
    company: job.company_name || job.company || job.recruiter_name || 'Company',
    jobType: job.job_type || job.jobType,
    workMode: job.work_mode || job.workMode,
    deadline: job.application_deadline || job.deadline,
    postedDate: job.created_at ? formatPostedDate(job.created_at) : job.postedDate,
    shortDescription: job.job_description ? job.job_description.substring(0, 100) + '...' : job.shortDescription,
    salary: formatDatabaseSalary(job)
  };
  
  function formatPostedDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
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
  
  const formatSalary = (salary) => {
    if (!salary) return 'Not disclosed';
    if (salary.includes('-')) {
      return salary; // Already formatted
    }
    if (salary.includes('₹') || salary.includes('$') || salary.includes('€')) {
      return salary; // Already has currency
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
    <div className="job-card" onClick={() => onClick(mappedJob)}>
      <div className="job-card-header">
        <div className="company-logo-section">
          <div className="company-logo">
            {mappedJob.companyLogo ? (
              <img src={mappedJob.companyLogo} alt={`${mappedJob.company} logo`} />
            ) : (
              <div className="default-logo">
                <i className="ri-building-line"></i>
              </div>
            )}
          </div>
        </div>
        <div className="job-title-section">
          <h3 className="job-title">{mappedJob.title || 'Job Title'}</h3>
          <p className="company-name">{mappedJob.company || 'Company'}</p>
        </div>
        <div className="deadline-badge">
          <span className={`deadline ${getDaysLeft(mappedJob.deadline).includes('Expired') ? 'expired' : ''}`}>
            {getDaysLeft(mappedJob.deadline)}
          </span>
        </div>
      </div>

      <div className="job-description">
        <p>{mappedJob.shortDescription || 'No description available'}</p>
      </div>

      <div className="job-details">
        <div className="job-meta">
          <span className="job-type">
            <i className="ri-briefcase-line"></i>
            {mappedJob.jobType || 'Full-time'}
          </span>
          <span className="job-location">
            <i className="ri-map-pin-line"></i>
            {mappedJob.location || 'Location not specified'}
          </span>
          <span className="job-salary">
            <i className="ri-money-dollar-circle-line"></i>
            {formatSalary(mappedJob.salary)}
          </span>
        </div>
      </div>

      <div className="job-card-footer">
        <div className="job-posted">
          <i className="ri-time-line"></i>
          Posted {mappedJob.postedDate || 'Recently'}
        </div>
        <div className="job-actions">
          <button 
            className="share-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowShareModal(true);
            }}
          >
            <i className="ri-share-line"></i>
            Share
          </button>
          <button 
            className="get-link-btn"
            onClick={(e) => {
              e.stopPropagation();
              if (job.applicationLink) {
                window.open(job.applicationLink, '_blank');
              } else {
                navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.id}`);
                if (window.showPopup) {
                  window.showPopup('Link copied!', 'success');
                } else {
                  alert('Job link copied to clipboard!');
                }
              }
            }}
          >
            <i className="ri-external-link-line"></i>
            Get Link
          </button>
          <button 
            className="apply-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/jobs/${job.id}/apply`);
            }}
          >
            <i className="ri-send-plane-line"></i>
            Apply
          </button>
        </div>
      </div>
    </div>
    
    <ShareModal
      isOpen={showShareModal}
      onClose={() => setShowShareModal(false)}
      shareUrl={`${window.location.origin}/job/${job.id}`}
      title={<Link to={`/jobs/${job.id}/${slugify(job.title)}`}>{job.title}</Link>}
      type="Job"
    />
    </>
  );
}

export default JobCard;