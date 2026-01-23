import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './JobApply.css';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

function JobApply() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/jobs/${jobId}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        setJob(data.job);
        setHasApplied(data.has_applied || false);
      } else {
        if (window.showPopup) {
          window.showPopup('Job not found', 'error');
        }
        navigate('/jobs');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      if (window.showPopup) {
        window.showPopup('Failed to load job details', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      if (window.showPopup) {
        window.showPopup('Please login to apply', 'warning');
      }
      navigate('/login');
      return;
    }

    const userData = JSON.parse(user);
    if (userData.role !== 'candidate') {
      if (window.showPopup) {
        window.showPopup('Only candidates can apply for jobs', 'error');
      }
      return;
    }

    setIsApplying(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/jobs/${jobId}/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            cover_letter: coverLetter,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setHasApplied(true);
        if (window.showPopup) {
          window.showPopup('Application submitted successfully!', 'success');
        }
        // Redirect to my applications after 2 seconds
        setTimeout(() => {
          navigate('/my-applications');
        }, 2000);
      } else {
        if (window.showPopup) {
          window.showPopup(data.message || 'Failed to submit application', 'error');
        }
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      if (window.showPopup) {
        window.showPopup('An error occurred. Please try again.', 'error');
      }
    } finally {
      setIsApplying(false);
    }
  };

  const formatSalary = (job) => {
    if (!job) return 'Not disclosed';
    
    const currency = job.currency === 'INR' ? '₹' : job.currency === 'USD' ? '$' : '€';
    
    if (job.min_salary && job.max_salary) {
      return `${currency}${parseInt(job.min_salary).toLocaleString()} - ${currency}${parseInt(job.max_salary).toLocaleString()}`;
    }
    if (job.min_salary) {
      return `${currency}${parseInt(job.min_salary).toLocaleString()}+`;
    }
    if (job.max_salary) {
      return `Up to ${currency}${parseInt(job.max_salary).toLocaleString()}`;
    }
    
    return 'Not disclosed';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expired';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const parseJSONField = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    try {
      return JSON.parse(field);
    } catch {
      return [];
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading job details..." />;
  }

  if (!job) {
    return (
      <div className="job-apply-error">
        <h2>Job not found</h2>
        <button onClick={() => navigate('/jobs')}>Back to Jobs</button>
      </div>
    );
  }

  const responsibilities = parseJSONField(job.key_responsibilities || job.keyResponsibilities);
  const requirements = parseJSONField(job.requirements);
  const benefits = parseJSONField(job.benefits_and_perks || job.benefitsAndPerks);
  const skills = parseJSONField(job.required_skills || job.requiredSkills);

  return (
    <>
      {isApplying && <LoadingSpinner message="Submitting application..." />}
      <div className="job-apply-page">
        <div className="job-apply-container">
          {/* Header Section */}
          <div className="job-apply-header">
            <div className="job-apply-header-content">
              <div className="job-company-logo">
                <i className="ri-building-line"></i>
              </div>
              <div className="job-header-info">
                <h1>{job.job_title || job.title}</h1>
                <p className="job-company-name">
                  <i className="ri-building-line"></i>
                  {job.company_name || job.company || 'Company'}
                </p>
                <div className="job-meta-tags">
                  <span className="meta-tag">
                    <i className="ri-map-pin-line"></i>
                    {job.location}
                  </span>
                  <span className="meta-tag">
                    <i className="ri-briefcase-line"></i>
                    {job.job_type || job.jobType}
                  </span>
                  <span className="meta-tag">
                    <i className="ri-home-office-line"></i>
                    {job.work_mode || job.workMode}
                  </span>
                  <span className="meta-tag">
                    <i className="ri-money-dollar-circle-line"></i>
                    {formatSalary(job)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Apply Button in Header */}
            <div className="job-apply-actions-header">
              {hasApplied ? (
                <button className="btn-applied" disabled>
                  <i className="ri-check-line"></i>
                  Applied
                </button>
              ) : (
                <button className="btn-apply-now" onClick={() => setShowCoverLetter(true)}>
                  <i className="ri-send-plane-line"></i>
                  Apply Now
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="job-apply-content">
            {/* Job Description */}
            <section className="job-section">
              <h2>
                <i className="ri-file-text-line"></i>
                Job Description
              </h2>
              <p className="job-description">{job.job_description || job.description || 'No description available'}</p>
            </section>

            {/* Key Responsibilities */}
            {responsibilities.length > 0 && (
              <section className="job-section">
                <h2>
                  <i className="ri-task-line"></i>
                  Key Responsibilities
                </h2>
                <ul className="job-list">
                  {responsibilities.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Requirements */}
            {requirements.length > 0 && (
              <section className="job-section">
                <h2>
                  <i className="ri-checkbox-circle-line"></i>
                  Requirements
                </h2>
                <ul className="job-list">
                  {requirements.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section className="job-section">
                <h2>
                  <i className="ri-code-box-line"></i>
                  Required Skills
                </h2>
                <div className="skills-tags">
                  {skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Benefits */}
            {benefits.length > 0 && (
              <section className="job-section">
                <h2>
                  <i className="ri-gift-line"></i>
                  Benefits & Perks
                </h2>
                <div className="benefits-grid">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="benefit-item">
                      <i className="ri-check-line"></i>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Job Details */}
            <section className="job-section job-details-grid">
              <h2>
                <i className="ri-information-line"></i>
                Job Details
              </h2>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Posted On</span>
                  <span className="detail-value">{formatDate(job.created_at)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Application Deadline</span>
                  <span className="detail-value">{formatDate(job.application_deadline)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Experience Level</span>
                  <span className="detail-value">{job.experience_level || job.experience || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Job Type</span>
                  <span className="detail-value">{job.job_type || job.jobType}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Work Mode</span>
                  <span className="detail-value">{job.work_mode || job.workMode}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Salary</span>
                  <span className="detail-value">{formatSalary(job)}</span>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Footer with Apply Button */}
          <div className="job-apply-footer">
            <div className="footer-content">
              {job.application_deadline && (
                <div className="deadline-badge">
                  <i className="ri-time-line"></i>
                  {getDaysLeft(job.application_deadline)}
                </div>
              )}
              <div className="footer-actions">
                <button className="btn-back" onClick={() => navigate('/jobs')}>
                  <i className="ri-arrow-left-line"></i>
                  Back to Jobs
                </button>
                {hasApplied ? (
                  <button className="btn-applied" disabled>
                    <i className="ri-check-line"></i>
                    Applied
                  </button>
                ) : (
                  <button className="btn-apply-primary" onClick={() => setShowCoverLetter(true)}>
                    <i className="ri-send-plane-line"></i>
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cover Letter Modal */}
        {showCoverLetter && !hasApplied && (
          <div className="cover-letter-modal-overlay" onClick={() => setShowCoverLetter(false)}>
            <div className="cover-letter-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Apply for {job.job_title || job.title}</h3>
                <button className="close-btn" onClick={() => setShowCoverLetter(false)}>
                  <i className="ri-close-line"></i>
                </button>
              </div>
              <div className="modal-body">
                <label>Cover Letter (Optional)</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell the employer why you're a great fit for this role..."
                  rows="8"
                />
              </div>
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setShowCoverLetter(false)}>
                  Cancel
                </button>
                <button className="btn-submit" onClick={handleApply} disabled={isApplying}>
                  {isApplying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default JobApply;
