import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import JobSearch from './JobSearch';
import JobFilters from './JobFilters';
import JobCard from './JobCard';
import JobModal from './JobModal';
import './JobListing.css';
import '../AdminDeleteButton.css';

const normalizeText = (text = '') =>
  text
    .toLowerCase()
    .replace(/,/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const isAdmin = () => {
  const user = localStorage.getItem('user');
  return user && JSON.parse(user).role === 'admin';
};

function JobListing({ jobType }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    state: [],
    city: [],
    salary: [],
    jobType: [],
    workMode: [],
    sortBy: 'latest'
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [jobType]);

  useEffect(() => {
    if (id && jobs.length > 0) {
      const job = jobs.find(j => (j.id || j._id) == id);
      if (job) {
        setSelectedJob(job);
        setIsModalOpen(true);
      } else {
        // If job not found in local data, try to fetch it from API
        fetchJobById(id);
      }
    }
  }, [id, jobs]);

  const fetchJobById = async (jobId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/applications/jobs/${jobId}`);
      if (response.ok) {
        const job = await response.json();
        setSelectedJob(job);
        setIsModalOpen(true);
      } else {
        // If API fails, show error message
        if (window.showPopup) {
          window.showPopup('Job not found', 'error');
        }
        navigate(jobType === 'government' ? '/gov-exams' : '/jobs/private');
      }
    } catch (error) {
      console.error('Error fetching job by ID:', error);
      if (window.showPopup) {
        window.showPopup('Job not found', 'error');
      }
      navigate(jobType === 'government' ? '/gov-exams' : '/jobs/private');
    }
  };

  useEffect(() => {
    const handleRefresh = (event) => {
      if (event.detail.type === 'job') {
        fetchJobs();
      }
    };
    
    window.addEventListener('refreshContent', handleRefresh);
    return () => window.removeEventListener('refreshContent', handleRefresh);
  }, []);

  const fetchJobs = async () => {
    try {
      // Fetch from public jobs API endpoint
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/jobs/public`);
      
      if (response.ok) {
        const data = await response.json();
        const jobsData = data.jobs || [];
        
        // Filter by job type if needed (government vs private)
        // For now, show all published jobs
        setJobs(jobsData);
        setFilteredJobs(jobsData);
        
        console.log(`Loaded ${jobsData.length} real jobs from database`);
      } else {
        console.error('Failed to fetch jobs:', response.status);
        // Don't use dummy data - show empty state
        setJobs([]);
        setFilteredJobs([]);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      // Don't use dummy data - show empty state
      setJobs([]);
      setFilteredJobs([]);
    }
  };

  useEffect(() => {
    // Apply filters and search
    let filtered = [...jobs];

    // Search filter
    if (searchTerm && searchTerm.trim()) {
      filtered = filtered.filter(job =>
        (job.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.company || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.shortDescription || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // State filter
    if (Array.isArray(filters.state) && filters.state.length > 0) {
      filtered = filtered.filter(job =>
        filters.state.some(state =>
          (job.location || '').toLowerCase().includes(state.toLowerCase())
        )
      );
    }

    // City filter
    if (Array.isArray(filters.city) && filters.city.length > 0) {
      filtered = filtered.filter(job =>
        filters.city.some(city =>
          normalizeText(job.location).includes(normalizeText(city))
        )
      );
    }

    // Salary filter
    if (Array.isArray(filters.salary) && filters.salary.length > 0) {
        filtered = filtered.filter(job => {
          if (!job.salary) return false;

          const jobRange = job.salary
            .split('-')
            .map(s => parseInt(s.replace(/[^\d]/g, ''), 10));

          return filters.salary.some(range => {
            if (range.includes('+')) {
              const min = parseInt(range.replace(/[^\d]/g, ''), 10);
              return jobRange[0] >= min;
            }

            const [min, max] = range
              .split('-')
              .map(s => parseInt(s.replace(/[^\d]/g, ''), 10));

            const jobMin = jobRange[0];
            const jobMax = jobRange[1] || jobRange[0];

            return jobMin >= min && jobMax <= max;
          });
        });
      }

    // Job type filter
    if (Array.isArray(filters.jobType) && filters.jobType.length > 0) {
      filtered = filtered.filter(job =>
        filters.jobType.includes(job.jobType)
      );
    }

    // Work mode filter
    if (Array.isArray(filters.workMode) && filters.workMode.length > 0) {
      filtered = filtered.filter(job =>
        filters.workMode.includes(job.workMode)
      );
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'latest':
          return new Date(b.createdAt || b.datePosted || 0) - new Date(a.createdAt || a.datePosted || 0);
        case 'oldest':
          return new Date(a.createdAt || a.datePosted || 0) - new Date(b.createdAt || b.datePosted || 0);
        case 'salary-high':
          const aSalaryHigh = parseInt((a.salary || '0').split('-')[1] || (a.salary || '0').split('-')[0]);
          const bSalaryHigh = parseInt((b.salary || '0').split('-')[1] || (b.salary || '0').split('-')[0]);
          return bSalaryHigh - aSalaryHigh;
        case 'salary-low':
          const aSalaryLow = parseInt((a.salary || '0').split('-')[0]);
          const bSalaryLow = parseInt((b.salary || '0').split('-')[0]);
          return aSalaryLow - bSalaryLow;
        case 'deadline':
          return new Date(a.deadline || 0) - new Date(b.deadline || 0);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  }, [jobs, searchTerm, filters]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleJobClick = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    if (id) {
      navigate(jobType === 'government' ? '/gov-exams' : '/jobs/private');
    }
  };

  const handleDeleteJob = async (jobId) => {
    window.showConfirm('Are you sure you want to delete this job?', async () => {
    
    // Store deleted ID in localStorage for permanent deletion of sample data
    const deletedIds = JSON.parse(localStorage.getItem('deletedJobIds') || '[]');
    if (!deletedIds.includes(jobId)) {
      deletedIds.push(jobId);
      localStorage.setItem('deletedJobIds', JSON.stringify(deletedIds));
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from current state regardless of API response
      setJobs(jobs.filter(job => job._id !== jobId && job.id !== jobId));
      setFilteredJobs(filteredJobs.filter(job => job._id !== jobId && job.id !== jobId));
      window.showNotification('Job deleted permanently!', 'success');
    } catch (error) {
      // Remove from current state even if API fails
      setJobs(jobs.filter(job => job._id !== jobId && job.id !== jobId));
      setFilteredJobs(filteredJobs.filter(job => job._id !== jobId && job.id !== jobId));
      window.showNotification('Job deleted permanently!', 'success');
    }
    });
  };

  return (
    <div className="job-listing-container">
      <JobSearch onSearch={handleSearch} jobType={jobType} />
      <button
        className="filter-toggle"
        onClick={() => setIsFilterOpen(true)}
      >
        <i className="ri-filter-line"></i> Filters
      </button>

      <div
        className={`filter-overlay ${isFilterOpen ? 'show' : ''}`}
        onClick={() => setIsFilterOpen(false)}
      ></div>

      <div className="job-content">
        <div className={`filters-section ${isFilterOpen ? 'open' : ''}`}>
          <JobFilters
            onFilterChange={handleFilterChange}
            jobType={jobType}
            onClose={() => setIsFilterOpen(false)}
          />
        </div>
        
        <div className="jobs-section">
          <div className="jobs-header">
            <h2>
              {filteredJobs.length} {jobType === 'government' ? 'Government' : 'Private'} Jobs Found
            </h2>
            <p>Showing latest job opportunities</p>
          </div>
          
          
          <div className="jobs-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <div key={job._id || job.id} style={{ animationDelay: `${index * 0.1}s` }} className="job-item">
                  <JobCard job={job} onClick={handleJobClick} />
                  {isAdmin() && (
                    <button 
                      className="admin-delete-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteJob(job._id || job.id);
                      }}
                      title="Delete Job"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="no-jobs">
                <i className="ri-search-line"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <JobModal 
        job={selectedJob} 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}

export default JobListing;