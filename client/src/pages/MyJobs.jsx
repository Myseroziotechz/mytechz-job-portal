import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

function MyJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/jobs/my-jobs`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      } else {
        setError('Failed to load your jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>
          <i className="ri-loader-line spinning" style={{ fontSize: '2rem' }}></i>
          <p>Loading your jobs...</p>
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
          <button onClick={fetchMyJobs} className="btn-primary">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>My Posted Jobs</h1>
          <p>Manage your job postings</p>
        </div>
        <button 
          onClick={() => window.location.href = '/recruiter/post-job'}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <i className="ri-add-line"></i>
          Post New Job
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <p style={{ color: '#666' }}>{jobs.length} jobs posted</p>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state" style={{ 
          padding: '3rem', 
          textAlign: 'center',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <i className="ri-briefcase-line" style={{ fontSize: '4rem', color: '#ccc' }}></i>
          <h2>No Jobs Posted Yet</h2>
          <p>Start by posting your first job to attract candidates.</p>
          <button 
            onClick={() => window.location.href = '/recruiter/post-job'}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Post Your First Job
          </button>
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
                border: job.is_published ? '2px solid #4A90E2' : '2px solid #ffc107'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{job.job_title}</h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                    {job.department || 'No department'}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: job.is_published ? '#4A90E2' : '#ffc107',
                    color: job.is_published ? 'white' : '#000',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {job.is_published ? 'Published' : 'Draft'}
                  </span>
                  {job.is_featured && (
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: '#6f42c1',
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: '600'
                    }}>
                      Featured
                    </span>
                  )}
                </div>
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
              </div>

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

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #eee'
              }}>
                <button 
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                  onClick={() => window.location.href = `/recruiter/jobs/${job.id}`}
                >
                  View Details
                </button>
                <button 
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                  onClick={() => window.location.href = `/recruiter/jobs/${job.id}/edit`}
                >
                  Edit
                </button>
                <button 
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this job?')) {
                      // TODO: Implement delete
                      alert('Delete functionality coming soon');
                    }
                  }}
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>

              <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#999' }}>
                Posted {new Date(job.created_at).toLocaleDateString()} • 
                Updated {new Date(job.updated_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyJobs;
