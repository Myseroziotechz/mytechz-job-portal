import React, { useState } from 'react';
import './CandidateFilters.css';

function CandidateFilters({ filters, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [skillInput, setSkillInput] = useState('');

  const experienceOptions = [
    { value: '', label: 'Any Experience' },
    { value: '0-1', label: '0-1 years' },
    { value: '1-3', label: '1-3 years' },
    { value: '3-5', label: '3-5 years' },
    { value: '5+', label: '5+ years' }
  ];

  const salaryRanges = [
    { value: '', label: 'Any Salary' },
    { value: '0-3', label: '0-3 LPA' },
    { value: '3-6', label: '3-6 LPA' },
    { value: '6-10', label: '6-10 LPA' },
    { value: '10-15', label: '10-15 LPA' },
    { value: '15-25', label: '15-25 LPA' },
    { value: '25+', label: '25+ LPA' }
  ];

  const educationOptions = [
    { value: '', label: 'Any Education' },
    { value: 'B.Tech', label: 'B.Tech' },
    { value: 'B.E', label: 'B.E' },
    { value: 'MCA', label: 'MCA' },
    { value: 'M.Tech', label: 'M.Tech' },
    { value: 'MBA', label: 'MBA' },
    { value: 'BCA', label: 'BCA' },
    { value: 'BSc', label: 'B.Sc' },
    { value: 'MSc', label: 'M.Sc' }
  ];

  const jobRoles = [
    { value: '', label: 'Any Role' },
    { value: 'Frontend Developer', label: 'Frontend Developer' },
    { value: 'Backend Developer', label: 'Backend Developer' },
    { value: 'Full Stack Developer', label: 'Full Stack Developer' },
    { value: 'Mobile Developer', label: 'Mobile Developer' },
    { value: 'DevOps Engineer', label: 'DevOps Engineer' },
    { value: 'Data Scientist', label: 'Data Scientist' },
    { value: 'UI/UX Designer', label: 'UI/UX Designer' },
    { value: 'Product Manager', label: 'Product Manager' },
    { value: 'QA Engineer', label: 'QA Engineer' }
  ];

  const popularSkills = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'Angular', 
    'Vue.js', 'TypeScript', 'PHP', 'Laravel', 'Django', 'Spring Boot',
    'MongoDB', 'MySQL', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'HTML', 'CSS', 'Sass', 'Redux', 'Express.js'
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const addSkill = (skill) => {
    if (skill && !localFilters.skills.includes(skill)) {
      const newSkills = [...localFilters.skills, skill];
      handleFilterChange('skills', newSkills);
    }
    setSkillInput('');
  };

  const removeSkill = (skillToRemove) => {
    const newSkills = localFilters.skills.filter(skill => skill !== skillToRemove);
    handleFilterChange('skills', newSkills);
  };

  const handleSkillInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(skillInput.trim());
    }
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      skills: [],
      experience: '',
      location: '',
      salaryRange: '',
      education: '',
      jobRole: '',
      keyword: ''
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    setSkillInput('');
  };

  return (
    <div className="candidate-filters">
      <div className="filters-header">
        <h3>Filter Candidates</h3>
        <button className="clear-filters-btn" onClick={clearAllFilters}>
          <i className="ri-refresh-line"></i>
          Clear All
        </button>
      </div>

      {/* Keyword Search */}
      <div className="filter-group">
        <label>Keyword Search</label>
        <input
          type="text"
          placeholder="Search by name, skills, education..."
          value={localFilters.keyword}
          onChange={(e) => handleFilterChange('keyword', e.target.value)}
        />
      </div>

      {/* Skills Filter */}
      <div className="filter-group">
        <label>Skills</label>
        <div className="skills-input-container">
          <input
            type="text"
            placeholder="Add skill and press Enter"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleSkillInputKeyPress}
          />
          <button 
            type="button"
            onClick={() => addSkill(skillInput.trim())}
            className="add-skill-btn"
          >
            <i className="ri-add-line"></i>
          </button>
        </div>
        
        {/* Selected Skills */}
        {localFilters.skills.length > 0 && (
          <div className="selected-skills">
            {localFilters.skills.map((skill, index) => (
              <span key={index} className="skill-chip">
                {skill}
                <button onClick={() => removeSkill(skill)}>
                  <i className="ri-close-line"></i>
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Popular Skills */}
        <div className="popular-skills">
          <p>Popular Skills:</p>
          <div className="skills-grid">
            {popularSkills.map((skill, index) => (
              <button
                key={index}
                className={`skill-suggestion ${localFilters.skills.includes(skill) ? 'selected' : ''}`}
                onClick={() => addSkill(skill)}
                disabled={localFilters.skills.includes(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Experience Filter */}
      <div className="filter-group">
        <label>Experience</label>
        <select
          value={localFilters.experience}
          onChange={(e) => handleFilterChange('experience', e.target.value)}
        >
          {experienceOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Location Filter */}
      <div className="filter-group">
        <label>Location</label>
        <input
          type="text"
          placeholder="Enter city or state"
          value={localFilters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
        />
      </div>

      {/* Salary Range Filter */}
      <div className="filter-group">
        <label>Expected Salary</label>
        <select
          value={localFilters.salaryRange}
          onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
        >
          {salaryRanges.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Education Filter */}
      <div className="filter-group">
        <label>Education</label>
        <select
          value={localFilters.education}
          onChange={(e) => handleFilterChange('education', e.target.value)}
        >
          {educationOptions.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Job Role Filter */}
      <div className="filter-group">
        <label>Job Role</label>
        <select
          value={localFilters.jobRole}
          onChange={(e) => handleFilterChange('jobRole', e.target.value)}
        >
          {jobRoles.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters Count */}
      {Object.values(localFilters).some(value => 
        Array.isArray(value) ? value.length > 0 : value !== ''
      ) && (
        <div className="active-filters-count">
          <i className="ri-filter-line"></i>
          {Object.values(localFilters).reduce((count, value) => {
            if (Array.isArray(value)) return count + (value.length > 0 ? 1 : 0);
            return count + (value !== '' ? 1 : 0);
          }, 0)} filter(s) active
        </div>
      )}
    </div>
  );
}

export default CandidateFilters;