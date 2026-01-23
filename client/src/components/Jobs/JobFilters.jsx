import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './JobFilters.css';

function JobFilters({ onFilterChange, jobType, onClose }) {
  const [filters, setFilters] = useState({
    state: [],
    city: [],
    salary: [],
    jobType: [],
    workMode: [],
    sortBy: 'latest'
  });

  /* ===== TOGGLE CHECKBOX (single source of truth) ===== */
  const toggleCheckbox = (key, value) => {
    const exists = filters[key].includes(value);

    const updatedValues = exists
      ? filters[key].filter(v => v !== value)
      : [...filters[key], value];

    const newFilters = { ...filters, [key]: updatedValues };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const cleared = {
      state: [],
      city: [],
      salary: [],
      jobType: [],
      workMode: [],
      sortBy: 'latest'
    };
    setFilters(cleared);
    onFilterChange(cleared);
  };

  /* ===== DATA ===== */
  const states = [
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
    'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
    'Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan',
    'Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal'
  ];

  const cities = [
    'Bengaluru','Hyderabad','Chennai','Mumbai','Pune','Delhi',
    'Noida','Gurgaon','Kolkata','Ahmedabad','Jaipur','Indore'
  ];

  const salaryRanges = [
    '0-25000',
    '25000-50000',
    '50000-100000',
    '100000-200000',
    '200000+'
  ];

  const jobTypes = jobType === 'government'
    ? ['Full Time','Contract','Temporary']
    : ['Full Time','Part Time','Internship','Contract','Freelance'];

  const workModes = ['Remote','On-site','Hybrid'];

  /* ===== SHOW MORE STATE ===== */
  const VISIBLE_COUNT = 4;
  const [activeModal, setActiveModal] = useState(null);
  const appliedCount = Object.entries(filters)
  .filter(([key]) => key !== 'sortBy')
  .reduce((count, [, values]) => count + values.length, 0);


  return (
    <div className="job-filters">
      {/* ===== HEADER ===== */}
      <div className="filters-header">
        <h3>All Filters</h3>
        {appliedCount > 0 && (
          <button
            className="applied-btn"
            onClick={() => setActiveModal('applied')}
          >
            Applied ({appliedCount})
          </button>
        )}
      </div>

      {/* ===== STATE ===== */}
      <div className="filter-group">
        <label>State</label>
        {states.slice(0, VISIBLE_COUNT).map(state => (
          <label key={state} className="checkbox-item">
            <input
              type="checkbox"
              checked={filters.state.includes(state)}
              onChange={() => toggleCheckbox('state', state)}
            />
            <span>{state}</span>
          </label>
        ))}
        {states.length > VISIBLE_COUNT && (
          <button
            className="show-more-btn"
            onClick={() => setActiveModal('state')}
          >
            View More
          </button>
        )}
      </div>

      {/* ===== CITY ===== */}
      <div className="filter-group">
        <label>City</label>
        {cities.slice(0, VISIBLE_COUNT).map(city => (
          <label key={city} className="checkbox-item">
            <input
              type="checkbox"
              checked={filters.city.includes(city)}
              onChange={() => toggleCheckbox('city', city)}
            />
            <span>{city}</span>
          </label>
        ))}
        {cities.length > VISIBLE_COUNT && (
          <button
            className="show-more-btn"
            onClick={() => setActiveModal('city')}
          >
            View More
          </button>
        )}
      </div>

      {/* ===== SALARY ===== */}
      <div className="filter-group">
        <label>Salary</label>
        {salaryRanges.slice(0, VISIBLE_COUNT).map(range => (
          <label key={range} className="checkbox-item">
            <input
              type="checkbox"
              checked={filters.salary.includes(range)}
              onChange={() => toggleCheckbox('salary', range)}
            />
            <span>{range.replace('-', ' - ')}</span>
          </label>
        ))}
        {salaryRanges.length > VISIBLE_COUNT && (
          <button
            className="show-more-btn"
            onClick={() => setActiveModal('salary')}
          >
            View More
          </button>
        )}
      </div>

      {/* ===== JOB TYPE ===== */}
      <div className="filter-group">
        <label>Job Type</label>
        {jobTypes.slice(0, VISIBLE_COUNT).map(type => (
          <label key={type} className="checkbox-item">
            <input
              type="checkbox"
              checked={filters.jobType.includes(type)}
              onChange={() => toggleCheckbox('jobType', type)}
            />
            <span>{type}</span>
          </label>
        ))}
        {jobTypes.length > VISIBLE_COUNT && (
          <button
            className="show-more-btn"
            onClick={() => setActiveModal('jobType')}
          >
            View More
          </button>
        )}
      </div>

      {/* ===== WORK MODE ===== */}
      <div className="filter-group">
        <label>Work Mode</label>
        {workModes.slice(0, VISIBLE_COUNT).map(mode => (
          <label key={mode} className="checkbox-item">
            <input
              type="checkbox"
              checked={filters.workMode.includes(mode)}
              onChange={() => toggleCheckbox('workMode', mode)}
            />
            <span>{mode}</span>
          </label>
        ))}
        {workModes.length > VISIBLE_COUNT && (
          <button
            className="show-more-btn"
            onClick={() => setActiveModal('workMode')}
          >
            View More
          </button>
        )}
      </div>

      {/* ===== SORT ===== */}
      <div className="filter-group">
        <label>Sort By</label>
        <select
          value={filters.sortBy}
          onChange={e =>
            setFilters(prev => {
              const updated = { ...prev, sortBy: e.target.value };
              onFilterChange(updated);
              return updated;
            })
          }
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="salary-high">Salary: High to Low</option>
          <option value="salary-low">Salary: Low to High</option>
          <option value="deadline">Deadline</option>
        </select>
      </div>
      {/* ===== MODALS ===== */}
    {activeModal !== null &&
      activeModal !== 'applied' &&
        createPortal(
          <>
            <div
              className="filter-modal-overlay"
              onClick={() => setActiveModal(null)}
            />

            <div className="filter-modal">
              <div className="filter-modal-header">
                <h4>
                  {activeModal === 'state' && 'Select State'}
                  {activeModal === 'city' && 'Select City'}
                  {activeModal === 'salary' && 'Select Salary'}
                  {activeModal === 'jobType' && 'Select Job Type'}
                  {activeModal === 'workMode' && 'Select Work Mode'}
                </h4>
                <button onClick={() => setActiveModal(null)}>✕</button>
              </div>

              <div className="filter-modal-body">
                {(activeModal === 'state' ? states :
                  activeModal === 'city' ? cities :
                  activeModal === 'salary' ? salaryRanges :
                  activeModal === 'jobType' ? jobTypes :
                  workModes
                ).map(value => (
                  <label key={value} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={filters[activeModal].includes(value)}
                      onChange={() => toggleCheckbox(activeModal, value)}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>

              <div className="filter-modal-footer">
                <button className="apply-btn" onClick={() => setActiveModal(null)}>
                  Apply
                </button>
              </div>
            </div>
          </>,
          document.body
        )
      }

    {/*applied modal*/}
    {activeModal === 'applied' &&
        createPortal(
          <>
          <div
            className="applied-overlay"
            onClick={() => setActiveModal(null)}
          />
          <div className="applied-panel">
            <div className="applied-header">
              <span>Applied Filters</span>
              <button onClick={() => setActiveModal(null)}>✕</button>
            </div>

            <div className="applied-body">
              {Object.entries(filters)
                .filter(([key]) => key !== 'sortBy')
                .flatMap(([key, values]) =>
                  values.map(value => (
                    <label key={`${key}-${value}`} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked
                        onChange={() => toggleCheckbox(key, value)}
                      />
                      <span>{value}</span>
                    </label>
                  ))
                )}
            </div>

            <div className="applied-footer">
              <button className="remove-all" onClick={clearFilters}>
                Remove All
              </button>
            </div>
          </div>
        </>,
          document.body
        )}


    </div>
  );
}

export default JobFilters;
