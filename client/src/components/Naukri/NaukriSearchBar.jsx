import React, { useState } from 'react';
import './NaukriSearchBar.css';

const NaukriSearchBar = ({ onSearch, showPopularSearches = true }) => {
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const popularSearches = [
    'Software Developer',
    'Data Analyst',
    'Full Stack Developer',
    'UI/UX Designer',
    'Product Manager',
    'Business Analyst',
    'DevOps Engineer',
    'Marketing Manager'
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(keyword, location);
    }
  };

  const handlePopularSearch = (search) => {
    setKeyword(search);
    if (onSearch) {
      onSearch(search, location);
    }
  };

  return (
    <div className="naukri-search-container">
      <form className="naukri-search-bar" onSubmit={handleSearch}>
        <div className="naukri-search-input-group">
          <div className="naukri-search-input-wrapper">
            <i className="ri-search-line naukri-search-icon"></i>
            <input
              type="text"
              className="naukri-search-input"
              placeholder="Search jobs, companies, skills..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          
          <div className="naukri-search-divider"></div>
          
          <div className="naukri-search-input-wrapper">
            <i className="ri-map-pin-line naukri-search-icon"></i>
            <input
              type="text"
              className="naukri-search-input"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          
          <button type="submit" className="naukri-search-button">
            <i className="ri-search-line"></i>
            <span>Search</span>
          </button>
        </div>
      </form>

      {showPopularSearches && (
        <div className="naukri-popular-searches">
          <span className="naukri-popular-label">Popular Searches:</span>
          <div className="naukri-popular-chips">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                className="naukri-popular-chip"
                onClick={() => handlePopularSearch(search)}
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NaukriSearchBar;
