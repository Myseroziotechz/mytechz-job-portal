import React, { useState } from 'react';
import './JobFilterSidebar.css';

const JobFilterSidebar = ({ filters, onFilterChange, jobCount = 0 }) => {
  const [expandedSections, setExpandedSections] = useState({
    location: true,
    experience: true,
    salary: true,
    jobType: true,
    workMode: true,
    postedDate: true
  });

  const locations = [
    'Bangalore',
    'Mumbai',
    'Delhi',
    'Hyderabad',
    'Pune',
    'Chennai',
    'Kolkata',
    'Ahmedabad'
  ];

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship'
  ];

  const workModes = [
    'Remote',
    'On-site',
    'Hybrid'
  ];

  const postedDates = [
    { label: 'Last 24 hours', value: '1' },
    { label: 'Last 7 days', value: '7' },
    { label: 'Last 30 days', value: '30' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCheckboxChange = (filterType, value) => {
    const currentValues = filters[filterType] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFilterChange(filterType, newValues);
  };

  const handleRangeChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const clearAllFilters = () => {
    onFilterChange('clear', null);
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some(key => {
      const value = filters[key];
      return Array.isArray(value) ? value.length > 0 : value !== '' && value !== null;
    });
  };

  return (
    <div className="job-filter-sidebar">
      <div className="filter-header">
        <h3 className="filter-title">
          <i className="ri-filter-3-line"></i>
          Filters
        </h3>
        {hasActiveFilters() && (
          <button className="filter-clear-all" onClick={clearAllFilters}>
            Clear All
          </button>
        )}
      </div>

      <div className="filter-job-count">
        <span>{jobCount.toLocaleString()} jobs found</span>
      </div>

      {/* Location Filter */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('location')}
        >
          <h4>Location</h4>
          <i className={`ri-arrow-${expandedSections.location ? 'up' : 'down'}-s-line`}></i>
        </div>
        {expandedSections.location && (
          <div className="filter-section-content">
            <div className="filter-search">
              <i className="ri-search-line"></i>
              <input 
                type="text" 
                placeholder="Search location..."
                className="filter-search-input"
              />
            </div>
            {locations.map(location => (
              <label key={location} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={(filters.location || []).includes(location)}
                  onChange={() => handleCheckboxChange('location', location)}
                />
                <span>{location}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Experience Filter */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('experience')}
        >
          <h4>Experience</h4>
          <i className={`ri-arrow-${expandedSections.experience ? 'up' : 'down'}-s-line`}></i>
        </div>
        {expandedSections.experience && (
          <div className="filter-section-content">
            <div className="filter-range">
              <input
                type="range"
                min="0"
                max="20"
                value={filters.minExperience || 0}
                onChange={(e) => handleRangeChange('minExperience', e.target.value)}
                className="filter-range-input"
              />
              <div className="filter-range-labels">
                <span>{filters.minExperience || 0} years</span>
                <span>20+ years</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Salary Filter */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('salary')}
        >
          <h4>Salary</h4>
          <i className={`ri-arrow-${expandedSections.salary ? 'up' : 'down'}-s-line`}></i>
        </div>
        {expandedSections.salary && (
          <div className="filter-section-content">
            <div className="filter-range">
              <input
                type="range"
                min="0"
                max="50"
                value={filters.minSalary || 0}
                onChange={(e) => handleRangeChange('minSalary', e.target.value)}
                className="filter-range-input"
              />
              <div className="filter-range-labels">
                <span>₹{filters.minSalary || 0} LPA</span>
                <span>₹50+ LPA</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Job Type Filter */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('jobType')}
        >
          <h4>Job Type</h4>
          <i className={`ri-arrow-${expandedSections.jobType ? 'up' : 'down'}-s-line`}></i>
        </div>
        {expandedSections.jobType && (
          <div className="filter-section-content">
            {jobTypes.map(type => (
              <label key={type} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={(filters.jobType || []).includes(type)}
                  onChange={() => handleCheckboxChange('jobType', type)}
                />
                <span>{type}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Work Mode Filter */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('workMode')}
        >
          <h4>Work Mode</h4>
          <i className={`ri-arrow-${expandedSections.workMode ? 'up' : 'down'}-s-line`}></i>
        </div>
        {expandedSections.workMode && (
          <div className="filter-section-content">
            {workModes.map(mode => (
              <label key={mode} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={(filters.workMode || []).includes(mode)}
                  onChange={() => handleCheckboxChange('workMode', mode)}
                />
                <span>{mode}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Posted Date Filter */}
      <div className="filter-section">
        <div 
          className="filter-section-header"
          onClick={() => toggleSection('postedDate')}
        >
          <h4>Posted Date</h4>
          <i className={`ri-arrow-${expandedSections.postedDate ? 'up' : 'down'}-s-line`}></i>
        </div>
        {expandedSections.postedDate && (
          <div className="filter-section-content">
            {postedDates.map(date => (
              <label key={date.value} className="filter-radio">
                <input
                  type="radio"
                  name="postedDate"
                  checked={filters.postedDate === date.value}
                  onChange={() => handleRangeChange('postedDate', date.value)}
                />
                <span>{date.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFilterSidebar;
