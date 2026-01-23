import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    jobType: '',
    workMode: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Build query string
      const params = new URLSearchParams();
      if (filters.jobType) params.append('job_type', filters.jobType);
      if (filters.workMode) params.append('work_mode', filters.workMode);
      if (filters.location) params.append('location', filters.location);
      
      const queryString = params.toString();
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/jobs/public${queryString ? '?' + queryString : ''}`;
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        setError('Failed to load jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      jobType: '',
      workMode: '',
      location: ''
    });
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>
          <i className="ri-loader-line spinning" style={{ fontSize: '2rem' }}></i>
          <p>Loading jobs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-dashboard">
        <div className="error-state" style={{ padding: '2rem', textAlign: 'center' }}>
          <i className="ri-error-warning-line" style={{ fontSize: '3rem', color: '#dc3545' }}></i>
          <h2>Error Loading Jobs</h2>
          <p>{error}</p>
          <button onClick={fetchJobs} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header">
        <h1>Available Jobs</h1>
        <p>Browse and apply for jobs that match your skills</p>
      </div>

      {/* Filters */}
      <div className="filters-section" style={{ 
        padding: '1.5rem', 
        backgroundColor: '#fff', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Job Type</label>
            <select 
              value={filters.jobType}
              onChange={(e) => handleFilterChange('jobType', e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Work Mode</label>
            <select 
              value={filters.workMode}
              onChange={(e) => handleFilterChange('workMode', e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            >
              <option value="">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location</label>
            <input 
              type="text"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              placeholder="Search location..."
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <button 
            onClick={clearFilters}
            style={{ 
              padding: '0.5rem 1rem', 
              backgroundColor: '#6c757d', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1.5rem'
            }}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Jobs Count */}
      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: '#666' }}>{jobs.length} jobs found</p>
      </div>

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="empty-state" style={{ 
          padding: '3rem', 
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <i className="ri-briefcase-line" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <h2>No Jobs Available</h2>
          <p>There are currently no published jobs matching your criteria.</p>
          <p>Check back later or adjust your filters.</p>
        </div>
      ) : (
        <div className="jobs-grid" style={{ display: 'grid', gap: '1.5rem' }}>
          {jobs.map((job) => (
            <div 
              key={job.id} 
              className="job-card"
              style={{
                padding: '1.5rem',
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{job.job_title}</h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                    Posted by {job.recruiter_name}
                  </p>
                </div>
                {job.is_featured && (
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: '#ffc107',
                    color: '#000',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    Featured
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#666', fontSize: '0.9rem' }}>
                  <i className="ri-briefcase-line"></i> {job.job_type}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#666', fontSize: '0.9rem' }}>
                  <i className="ri-home-office-line"></i> {job.work_mode}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#666', fontSize: '0.9rem' }}>
                  <i className="ri-map-pin-line"></i> {job.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#666', fontSize: '0.9rem' }}>
                  <i className="ri-time-line"></i> {job.experience_level}
                </span>
              </div>

              {(job.min_salary || job.max_salary) && (
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ color: '#28a745', fontWeight: '600' }}>
                    {job.currency === 'INR' ? '₹' : job.currency === 'USD' ? '$' : '€'}
                    {job.min_salary && job.max_salary 
                      ? `${parseInt(job.min_salary).toLocaleString()} - ${parseInt(job.max_salary).toLocaleString()}`
                      : job.min_salary || job.max_salary
                    } {job.salary_period === 'annually' ? 'per year' : job.salary_period === 'monthly' ? 'per month' : 'per hour'}
                  </span>
                </div>
              )}

              <p style={{ 
                color: '#666', 
                marginBottom: '1rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {job.job_description}
              </p>

              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {job.requiredSkills.slice(0, 5).map((skill, index) => (
                    <span 
                      key={index}
                      style={{
                        padding: '0.25rem 0.75rem',
                        backgroundColor: '#e9ecef',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        color: '#495057'
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 5 && (
                    <span style={{ color: '#666', fontSize: '0.8rem' }}>
                      +{job.requiredSkills.length - 5} more
                    </span>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  onClick={() => window.location.href = `/jobs/${job.id}`}
                >
                  View Details
                </button>
                <button 
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                  onClick={() => window.location.href = `/jobs/${job.id}/apply`}
                >
                  Apply Now
                </button>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#999' }}>
                Posted {new Date(job.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Jobs;
