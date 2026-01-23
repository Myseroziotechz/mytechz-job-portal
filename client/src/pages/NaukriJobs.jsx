import React, { useState, useEffect } from 'react';
import NaukriSearchBar from '../components/Naukri/NaukriSearchBar';
import JobFilterSidebar from '../components/Naukri/JobFilterSidebar';
import NaukriJobCard from '../components/Naukri/NaukriJobCard';
import '../styles/NaukriCommon.css';
import './NaukriJobs.css';

function NaukriJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState({
    keyword: '',
    location: [],
    minExperience: 0,
    minSalary: 0,
    jobType: [],
    workMode: [],
    postedDate: null
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, jobs, sortBy]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/jobs/public`;
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

  const applyFilters = () => {
    let filtered = [...jobs];

    // Keyword filter
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(job =>
        job.job_title?.toLowerCase().includes(keyword) ||
        job.company_name?.toLowerCase().includes(keyword) ||
        job.recruiter_name?.toLowerCase().includes(keyword) ||
        job.job_description?.toLowerCase().includes(keyword) ||
        job.requiredSkills?.some(skill => skill.toLowerCase().includes(keyword))
      );
    }

    // Location filter
    if (filters.location.length > 0) {
      filtered = filtered.filter(job =>
        filters.location.some(loc => 
          job.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // Experience filter
    if (filters.minExperience > 0) {
      filtered = filtered.filter(job => {
        const exp = job.experience_level?.toLowerCase();
        if (exp?.includes('entry')) return filters.minExperience <= 2;
        if (exp?.includes('mid')) return filters.minExperience <= 5;
        if (exp?.includes('senior')) return filters.minExperience <= 10;
        return true;
      });
    }

    // Salary filter
    if (filters.minSalary > 0) {
      filtered = filtered.filter(job => {
        const salary = job.min_salary || job.max_salary || 0;
        return (salary / 100000) >= filters.minSalary;
      });
    }

    // Job Type filter
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job =>
        filters.jobType.includes(job.job_type)
      );
    }

    // Work Mode filter
    if (filters.workMode.length > 0) {
      filtered = filtered.filter(job =>
        filters.workMode.includes(job.work_mode)
      );
    }

    // Posted Date filter
    if (filters.postedDate) {
      const daysAgo = parseInt(filters.postedDate);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      
      filtered = filtered.filter(job => {
        const postedDate = new Date(job.created_at);
        return postedDate >= cutoffDate;
      });
    }

    // Sorting
    if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'salary') {
      filtered.sort((a, b) => {
        const salaryA = a.max_salary || a.min_salary || 0;
        const salaryB = b.max_salary || b.min_salary || 0;
        return salaryB - salaryA;
      });
    }

    setFilteredJobs(filtered);
  };

  const handleSearch = (keyword, location) => {
    setFilters(prev => ({
      ...prev,
      keyword,
      location: location ? [location] : []
    }));
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({
        keyword: '',
        location: [],
        minExperience: 0,
        minSalary: 0,
        jobType: [],
        workMode: [],
        postedDate: null
      });
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value
      }));
    }
  };

  const handleSaveJob = (jobId, saved) => {
    // TODO: Implement save job API call
    console.log(`Job ${jobId} ${saved ? 'saved' : 'unsaved'}`);
  };

  const handleApplyJob = (jobId) => {
    window.location.href = `/jobs/${jobId}`;
  };

  if (loading) {
    return (
      <div className="naukri-page">
        <div className="naukri-container">
          <div className="naukri-loading">
            <div className="naukri-spinner"></div>
            <p>Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="naukri-page">
        <div className="naukri-container">
          <div className="naukri-error">
            <i className="ri-error-warning-line"></i>
            <h2>Error Loading Jobs</h2>
            <p>{error}</p>
            <button className="naukri-btn naukri-btn-primary" onClick={fetchJobs}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="naukri-page">
      <div className="naukri-jobs-search-header">
        <div className="naukri-container">
          <NaukriSearchBar 
            onSearch={handleSearch}
            showPopularSearches={false}
          />
        </div>
      </div>

      <div className="naukri-container">
        <div className="naukri-jobs-layout">
          {/* Mobile Filter Toggle */}
          <button 
            className="naukri-filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <i className="ri-filter-3-line"></i>
            Filters
          </button>

          {/* Filter Sidebar */}
          <aside className={`naukri-jobs-sidebar ${showFilters ? 'open' : ''}`}>
            <JobFilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              jobCount={filteredJobs.length}
            />
          </aside>

          {/* Jobs List */}
          <main className="naukri-jobs-main">
            <div className="naukri-jobs-header">
              <div className="naukri-jobs-count">
                <h2>Showing {filteredJobs.length.toLocaleString()} jobs</h2>
                {filters.keyword && (
                  <p>for "{filters.keyword}"</p>
                )}
              </div>
              <div className="naukri-jobs-sort">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="naukri-select"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date Posted</option>
                  <option value="salary">Salary</option>
                </select>
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="naukri-empty-state">
                <i className="ri-briefcase-line"></i>
                <h3>No jobs found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <button 
                  className="naukri-btn naukri-btn-primary"
                  onClick={() => handleFilterChange('clear', null)}
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="naukri-jobs-grid">
                {filteredJobs.map((job) => (
                  <NaukriJobCard
                    key={job.id}
                    job={job}
                    onSave={handleSaveJob}
                    onApply={handleApplyJob}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div 
          className="naukri-filter-overlay"
          onClick={() => setShowFilters(false)}
        ></div>
      )}
    </div>
  );
}

export default NaukriJobs;
