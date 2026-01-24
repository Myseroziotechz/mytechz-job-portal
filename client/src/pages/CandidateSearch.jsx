import React, { useState, useEffect } from 'react';
import CandidateCard from '../components/Recruiter/CandidateCard';
import CandidateFilters from '../components/Recruiter/CandidateFilters';
import '../components/Jobs/JobListing.css';

function CandidateSearch() {
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    skills: [],
    experience: '',
    location: '',
    keyword: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const candidatesPerPage = 12;

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [candidates, filters, searchQuery, sortBy]);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Build query params
      const params = new URLSearchParams();
      if (searchQuery) params.append('keyword', searchQuery);
      if (filters.location) params.append('location', filters.location);
      if (filters.experience) params.append('experience', filters.experience);
      if (filters.skills.length > 0) params.append('skills', filters.skills.join(','));
      
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/search-candidates?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        setCandidates(data.candidates || []);
      } else {
        setCandidates([]);
        if (window.showPopup) {
          window.showPopup('Unable to load candidates. Please try again later.', 'error');
        }
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([]);
      if (window.showPopup) {
        window.showPopup('Failed to connect to server. Please check your connection.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...candidates];

    // Client-side search filter
    if (searchQuery) {
      filtered = filtered.filter(candidate =>
        candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      case 'recent':
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      default:
        break;
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchCandidates(); // Refetch with new filters
  };

  const handleSaveProfile = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/save-candidate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ candidate_id: candidateId })
        }
      );

      const data = await response.json();
      
      if (response.ok) {
        // Update local state to mark as saved
        setCandidates(prev => prev.map(c => 
          c.id === candidateId ? { ...c, is_saved: true } : c
        ));
        
        if (window.showPopup) {
          window.showPopup('Profile saved successfully!', 'success');
        }
      } else {
        if (window.showPopup) {
          window.showPopup(data.message || 'Error saving profile', 'error');
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (window.showPopup) {
        window.showPopup('Error saving profile', 'error');
      }
    }
  };

  const handleUnsaveProfile = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/unsave-candidate/${candidateId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.ok) {
        // Update local state to mark as unsaved
        setCandidates(prev => prev.map(c => 
          c.id === candidateId ? { ...c, is_saved: false } : c
        ));
        
        if (window.showPopup) {
          window.showPopup('Profile removed from saved list', 'success');
        }
      }
    } catch (error) {
      console.error('Error unsaving profile:', error);
      if (window.showPopup) {
        window.showPopup('Error removing profile', 'error');
      }
    }
  };

  // Pagination
  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

  if (loading) {
    return <div className="loading">Loading candidates...</div>;
  }

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        {/* Header */}
        <div className="jobs-header">
          <div className="header-content">
            <h1>Search Candidates</h1>
            <p>Discover talented candidates for your job openings</p>
          </div>
          
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <i className="ri-search-line"></i>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="jobs-controls">
          <div className="results-info">
            <span className="results-count">
              {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="controls-right">
            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="name">Name</option>
                <option value="recent">Recently Joined</option>
              </select>
            </div>
            
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <i className="ri-grid-line"></i>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <i className="ri-list-line"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="jobs-content">
          {/* Filters Sidebar */}
          <div className="filters-sidebar">
            <CandidateFilters 
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Candidates Grid/List */}
          <div className="jobs-main">
            {currentCandidates.length > 0 ? (
              <>
                <div className={`candidates-container ${viewMode}`}>
                  {currentCandidates.map(candidate => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onSave={() => candidate.is_saved ? handleUnsaveProfile(candidate.id) : handleSaveProfile(candidate.id)}
                      isSaved={candidate.is_saved}
                      viewMode={viewMode}
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
                <i className="ri-search-line"></i>
                <h3>No candidates found</h3>
                <p>Try adjusting your search criteria or filters</p>
                <button 
                  className="reset-filters-btn"
                  onClick={() => {
                    setFilters({
                      skills: [],
                      experience: '',
                      location: '',
                      keyword: ''
                    });
                    setSearchQuery('');
                    fetchCandidates();
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateSearch;
