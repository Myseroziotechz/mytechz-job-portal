import React, { useState, useEffect } from 'react';
import JobPostCard from '../components/Recruiter/JobPostCard';
import '../components/Jobs/JobListing.css'; // Using existing jobs listing styles

function PostedJobs() {
  const [jobPosts, setJobPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 12;

  useEffect(() => {
    fetchJobPosts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [jobPosts, searchQuery, statusFilter]);

  const fetchJobPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/jobs/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Map backend data to frontend format
        const mappedJobs = (data.jobs || []).map(job => ({
          id: job.id,
          title: job.job_title,
          company: job.recruiter_name || 'Your Company',
          location: job.location,
          jobType: job.job_type,
          workMode: job.work_mode,
          salary: formatSalary(job),
          postedDate: job.created_at,
          deadline: job.application_deadline,
          status: job.is_published ? 'active' : 'draft',
          applicationsCount: 0, // TODO: Implement applications count
          viewsCount: 0, // TODO: Implement views count
          shortDescription: job.job_description?.substring(0, 100) + '...' || '',
          skills: job.requiredSkills || []
        }));
        setJobPosts(mappedJobs);
      } else {
        console.error('Failed to fetch jobs:', response.status);
        setJobPosts([]);
      }
    } catch (error) {
      console.error('Error fetching job posts:', error);
      setJobPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (job) => {
    if (!job.min_salary && !job.max_salary) return 'Not specified';
    
    const currency = job.currency === 'INR' ? '₹' : job.currency === 'USD' ? '$' : '€';
    const min = job.min_salary ? parseInt(job.min_salary).toLocaleString() : '';
    const max = job.max_salary ? parseInt(job.max_salary).toLocaleString() : '';
    
    if (min && max) {
      return `${currency}${min} - ${currency}${max}`;
    }
    return min ? `${currency}${min}+` : `${currency}${max}`;
  };

  const applyFilters = () => {
    let filtered = jobPosts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    setFilteredJobs(filtered);
    setCurrentPage(1);
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      
      // Map status to is_published boolean
      const isPublished = newStatus === 'active';
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/jobs/${jobId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ is_published: isPublished })
      });

      if (response.ok) {
        setJobPosts(prev => 
          prev.map(job => 
            job.id === jobId ? { ...job, status: newStatus } : job
          )
        );
        if (window.showPopup) {
          window.showPopup(`Job ${newStatus === 'active' ? 'published' : 'saved as draft'}`, 'success');
        }
      } else {
        if (window.showPopup) {
          window.showPopup('Failed to update job status', 'error');
        }
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      if (window.showPopup) {
        window.showPopup('Error updating job status', 'error');
      }
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job post? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // TODO: Implement delete endpoint in backend
      // For now, just show a message
      if (window.showPopup) {
        window.showPopup('Delete functionality coming soon', 'info');
      }
      
      // Uncomment when backend endpoint is ready:
      // const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/jobs/${jobId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     Authorization: `Bearer ${token}`
      //   }
      // });
      //
      // if (response.ok) {
      //   setJobPosts(prev => prev.filter(job => job.id !== jobId));
      //   if (window.showPopup) {
      //     window.showPopup('Job post deleted successfully', 'success');
      //   }
      // }
    } catch (error) {
      console.error('Error deleting job:', error);
      if (window.showPopup) {
        window.showPopup('Error deleting job post', 'error');
      }
    }
  };

  const handleViewApplications = (jobId) => {
    // TODO: Implement applications view
    if (window.showPopup) {
      window.showPopup('Applications view coming soon', 'info');
    }
    // window.location.href = `/recruiter/job/${jobId}/applications`;
  };

  const handleEditJob = (jobId) => {
    // TODO: Implement job edit page
    if (window.showPopup) {
      window.showPopup('Edit functionality coming soon', 'info');
    }
    // window.location.href = `/recruiter/edit-job/${jobId}`;
  };

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Stats
  const stats = {
    total: jobPosts.length,
    active: jobPosts.filter(job => job.status === 'active').length,
    closed: jobPosts.filter(job => job.status === 'closed').length,
    draft: jobPosts.filter(job => job.status === 'draft').length,
    totalApplications: jobPosts.reduce((sum, job) => sum + job.applicationsCount, 0)
  };

  if (loading) {
    return <div className="loading">Loading job posts...</div>;
  }

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        {/* Header */}
        <div className="jobs-header">
          <div className="header-content">
            <h1>Posted Jobs</h1>
            <p>Manage your job postings and track applications</p>
          </div>
          
          <button 
            className="post-job-btn"
            onClick={() => window.location.href = '/recruiter/post-job'}
          >
            <i className="ri-add-line"></i>
            Post New Job
          </button>
        </div>

        {/* Stats Cards */}
        <div className="job-stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.closed}</div>
            <div className="stat-label">Closed</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.draft}</div>
            <div className="stat-label">Drafts</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.totalApplications}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        {/* Filters */}
        <div className="jobs-filters">
          <div className="search-bar">
            <i className="ri-search-line"></i>
            <input
              type="text"
              placeholder="Search job posts by title, location, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="status-filter">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        <div className="jobs-content">
          <div className="jobs-main full-width">
            <div className="jobs-results-header">
              <h2>
                {filteredJobs.length} Job Post{filteredJobs.length !== 1 ? 's' : ''}
              </h2>
              <div className="results-info">
                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length}
              </div>
            </div>

            {currentJobs.length > 0 ? (
              <>
                <div className="jobs-grid">
                  {currentJobs.map(job => (
                    <JobPostCard
                      key={job.id}
                      job={job}
                      onStatusChange={(newStatus) => handleStatusChange(job.id, newStatus)}
                      onDelete={() => handleDeleteJob(job.id)}
                      onViewApplications={() => handleViewApplications(job.id)}
                      onEdit={() => handleEditJob(job.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      <i className="ri-arrow-left-line"></i>
                      Previous
                    </button>
                    
                    <div className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next
                      <i className="ri-arrow-right-line"></i>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-results">
                <i className="ri-briefcase-line"></i>
                <h3>No job posts found</h3>
                <p>
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search criteria or filters'
                    : 'Start by posting your first job'
                  }
                </p>
                {!searchQuery && statusFilter === 'all' && (
                  <button 
                    className="cta-btn"
                    onClick={() => window.location.href = '/recruiter/post-job'}
                  >
                    Post Your First Job
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostedJobs;