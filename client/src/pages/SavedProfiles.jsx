import React, { useState, useEffect } from 'react';
import CandidateCard from '../components/Recruiter/CandidateCard';
import '../components/Jobs/JobListing.css'; // Using existing jobs listing styles

function SavedProfiles() {
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const profilesPerPage = 12;

  useEffect(() => {
    fetchSavedProfiles();
  }, []);

  useEffect(() => {
    applySearch();
  }, [savedProfiles, searchQuery]);

  const fetchSavedProfiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/saved-profiles`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSavedProfiles(data.profiles || []);
      } else {
        setSavedProfiles([]);
      }
    } catch (error) {
      console.error('Error fetching saved profiles:', error);
      setSavedProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  const applySearch = () => {
    let filtered = savedProfiles;

    if (searchQuery) {
      filtered = filtered.filter(profile =>
        profile.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        profile.jobRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProfiles(filtered);
    setCurrentPage(1);
  };

  const handleRemoveProfile = async (profileId) => {
    if (!window.confirm('Are you sure you want to remove this profile from saved list?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/remove-saved-profile`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profileId })
      });

      if (response.ok) {
        setSavedProfiles(prev => prev.filter(profile => profile.id !== profileId));
        if (window.showPopup) {
          window.showPopup('Profile removed from saved list', 'success');
        }
      }
    } catch (error) {
      console.error('Error removing profile:', error);
      if (window.showPopup) {
        window.showPopup('Error removing profile', 'error');
      }
    }
  };

  const handleViewProfile = (profile) => {
    window.location.href = `/recruiter/candidate/${profile.id}`;
  };

  const handleAddNotes = async (profileId, notes) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/update-profile-notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ profileId, notes })
      });

      if (response.ok) {
        setSavedProfiles(prev => 
          prev.map(profile => 
            profile.id === profileId ? { ...profile, notes } : profile
          )
        );
        if (window.showPopup) {
          window.showPopup('Notes updated successfully', 'success');
        }
      }
    } catch (error) {
      console.error('Error updating notes:', error);
      if (window.showPopup) {
        window.showPopup('Error updating notes', 'error');
      }
    }
  };

  // Pagination
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  if (loading) {
    return <div className="loading">Loading saved profiles...</div>;
  }

  return (
    <div className="jobs-page">
      <div className="jobs-container">
        {/* Header */}
        <div className="jobs-header">
          <h1>Saved Candidate Profiles</h1>
          <p>Manage your saved candidate profiles and add notes</p>
          
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <i className="ri-search-line"></i>
              <input
                type="text"
                placeholder="Search saved profiles by name, skills, or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="jobs-content">
          <div className="jobs-main full-width">
            <div className="jobs-results-header">
              <h2>
                {filteredProfiles.length} Saved Profile{filteredProfiles.length !== 1 ? 's' : ''}
              </h2>
              {filteredProfiles.length > 0 && (
                <div className="results-info">
                  Showing {indexOfFirstProfile + 1}-{Math.min(indexOfLastProfile, filteredProfiles.length)} of {filteredProfiles.length}
                </div>
              )}
            </div>

            {currentProfiles.length > 0 ? (
              <>
                <div className="saved-profiles-grid">
                  {currentProfiles.map(profile => (
                    <div key={profile.id} className="saved-profile-item">
                      <CandidateCard
                        candidate={profile}
                        onSave={() => handleRemoveProfile(profile.id)}
                        onView={() => handleViewProfile(profile)}
                        isSaved={true}
                      />
                      
                      {/* Additional saved profile info */}
                      <div className="saved-profile-meta">
                        <div className="saved-date">
                          <i className="ri-bookmark-line"></i>
                          Saved on {new Date(profile.savedDate).toLocaleDateString()}
                        </div>
                        
                        {/* Notes Section */}
                        <div className="profile-notes">
                          <div className="notes-header">
                            <i className="ri-sticky-note-line"></i>
                            <span>Notes</span>
                          </div>
                          <textarea
                            placeholder="Add notes about this candidate..."
                            value={profile.notes || ''}
                            onChange={(e) => {
                              const updatedProfiles = savedProfiles.map(p =>
                                p.id === profile.id ? { ...p, notes: e.target.value } : p
                              );
                              setSavedProfiles(updatedProfiles);
                            }}
                            onBlur={(e) => handleAddNotes(profile.id, e.target.value)}
                            rows="2"
                          />
                        </div>
                        
                        {/* Quick Actions */}
                        <div className="saved-profile-actions">
                          <button 
                            className="contact-btn"
                            onClick={() => window.location.href = `/recruiter/contact/${profile.id}`}
                          >
                            <i className="ri-message-line"></i>
                            Contact
                          </button>
                          <button 
                            className="remove-btn"
                            onClick={() => handleRemoveProfile(profile.id)}
                          >
                            <i className="ri-delete-bin-line"></i>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
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
                <i className="ri-bookmark-line"></i>
                <h3>No saved profiles found</h3>
                <p>
                  {searchQuery 
                    ? 'Try adjusting your search criteria' 
                    : 'Start saving candidate profiles to see them here'
                  }
                </p>
                {!searchQuery && (
                  <button 
                    className="cta-btn"
                    onClick={() => window.location.href = '/recruiter/search-candidates'}
                  >
                    Search Candidates
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

export default SavedProfiles;
