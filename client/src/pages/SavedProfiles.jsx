import React, { useState, useEffect } from 'react';
import '../components/Jobs/JobListing.css';
import './SavedProfiles.css';

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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/saved-profiles`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
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
        profile.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/unsave-candidate/${profileId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      );

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

  const handleUpdateNotes = async (profileId, notes) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/update-candidate-notes/${profileId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ notes })
        }
      );

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
                placeholder="Search saved profiles by name, email, or location..."
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
                    <div key={profile.id} className="saved-profile-card">
                      {/* Profile Header */}
                      <div className="profile-header">
                        <div className="profile-avatar">
                          {profile.profile_photo ? (
                            <img src={profile.profile_photo} alt={profile.name} />
                          ) : (
                            <div className="avatar-placeholder">
                              {profile.name?.charAt(0)?.toUpperCase() || 'C'}
                            </div>
                          )}
                        </div>
                        <div className="profile-info">
                          <h3 className="profile-name">{profile.name || 'Unnamed Candidate'}</h3>
                          {profile.experience && (
                            <p className="profile-title">{profile.experience}</p>
                          )}
                        </div>
                      </div>

                      {/* Profile Details */}
                      <div className="profile-details">
                        {profile.email && (
                          <div className="detail-item">
                            <i className="ri-mail-line"></i>
                            <span>{profile.email}</span>
                          </div>
                        )}
                        {profile.phone && (
                          <div className="detail-item">
                            <i className="ri-phone-line"></i>
                            <span>{profile.phone}</span>
                          </div>
                        )}
                        {profile.location && (
                          <div className="detail-item">
                            <i className="ri-map-pin-line"></i>
                            <span>{profile.location}</span>
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      {profile.skills && profile.skills.length > 0 && (
                        <div className="profile-skills">
                          {profile.skills.slice(0, 5).map((skill, index) => (
                            <span key={index} className="skill-badge">{skill}</span>
                          ))}
                          {profile.skills.length > 5 && (
                            <span className="skill-badge more">+{profile.skills.length - 5} more</span>
                          )}
                        </div>
                      )}

                      {/* Saved Date */}
                      <div className="saved-meta">
                        <i className="ri-bookmark-line"></i>
                        <span>Saved on {new Date(profile.saved_at).toLocaleDateString()}</span>
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
                          onBlur={(e) => handleUpdateNotes(profile.id, e.target.value)}
                          rows="2"
                        />
                      </div>

                      {/* Actions */}
                      <div className="profile-actions">
                        <button 
                          className="action-btn contact-btn"
                          onClick={() => window.location.href = `mailto:${profile.email}`}
                        >
                          <i className="ri-message-line"></i>
                          Contact
                        </button>
                        <button 
                          className="action-btn remove-btn"
                          onClick={() => handleRemoveProfile(profile.id)}
                        >
                          <i className="ri-delete-bin-line"></i>
                          Remove
                        </button>
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
