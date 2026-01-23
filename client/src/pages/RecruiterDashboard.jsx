import React, { useState, useEffect } from 'react';
import './UserDashboard.css'; // Reusing existing dashboard styles

function RecruiterDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isApproved, setIsApproved] = useState(true); // Default to true to avoid blocking UI

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    setUser(userData);
    fetchDashboardData();
    checkApprovalStatus();
    
    const handleWindowFocus = () => {
      fetchDashboardData();
      checkApprovalStatus();
    };

    window.addEventListener('focus', handleWindowFocus);
    
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

  const checkApprovalStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const approved = data.approval_status === 'approved';
        setIsApproved(approved);
      }
    } catch (error) {
      console.error('Error checking approval status:', error);
    }
  };

  const handlePostJobClick = () => {
    if (!isApproved) {
      if (window.showPopup) {
        window.showPopup('Your account is pending admin approval. Please wait for admin to approve your account.', 'warning');
      } else {
        alert('Your account is pending admin approval. Please wait for admin to approve your account.');
      }
      // Stay on dashboard
      return;
    } else {
      window.location.href = '/recruiter/post-job';
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/dashboard/recruiter`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDashboardData(data);
      } else {
        // Fallback data if API fails
        setDashboardData({
          stats: { 
            profilesViewed: 0, 
            savedCandidates: 0, 
            activeJobs: 0, 
            subscriptionStatus: 'Free',
            creditsRemaining: 0
          },
          recentActivity: [],
          jobPosts: [],
          savedProfiles: []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback data if API fails
      setDashboardData({
        stats: { 
          profilesViewed: 0, 
          savedCandidates: 0, 
          activeJobs: 0, 
          subscriptionStatus: 'Free',
          creditsRemaining: 0
        },
        recentActivity: [],
        jobPosts: [],
        savedProfiles: []
      });
    }
  };

  if (!dashboardData) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="user-dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user?.companyName || user?.name || 'Recruiter'}!</h1>
          <p>Manage your recruitment activities and find the best candidates</p>
        </div>
        
        <div className="stats-overview">
          <div className="stat-item">
            <div className="stat-number">{dashboardData.stats.profilesViewed}</div>
            <div className="stat-label">Profiles Viewed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{dashboardData.stats.savedCandidates}</div>
            <div className="stat-label">Saved Candidates</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{dashboardData.stats.activeJobs}</div>
            <div className="stat-label">Active Job Posts</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{dashboardData.stats.creditsRemaining}</div>
            <div className="stat-label">Credits Left</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{dashboardData.stats.subscriptionStatus}</div>
            <div className="stat-label">Plan</div>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="dashboard-nav">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'candidates' ? 'active' : ''}
          onClick={() => setActiveTab('candidates')}
        >
          Search Candidates
        </button>
        <button 
          className={activeTab === 'saved' ? 'active' : ''}
          onClick={() => setActiveTab('saved')}
        >
          Saved Profiles
        </button>
        <button 
          className={activeTab === 'jobs' ? 'active' : ''}
          onClick={() => setActiveTab('jobs')}
        >
          Posted Jobs
        </button>
        <button 
          className={activeTab === 'credits' ? 'active' : ''}
          onClick={() => setActiveTab('credits')}
        >
          Credits & Plans
        </button>
        <button 
          className={activeTab === 'messages' ? 'active' : ''}
          onClick={() => setActiveTab('messages')}
        >
          Messages
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-main">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="status-bars">
              <h2>Recruitment Activity</h2>
              <div className="status-bar-container">
                <div className="status-bar">
                  <div className="bar-label">Profiles</div>
                  <div className="bar">
                    <div 
                      className="bar-fill pending" 
                      style={{ width: `${Math.min((dashboardData.stats.profilesViewed / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="bar-percentage">{dashboardData.stats.profilesViewed}</div>
                </div>
                
                <div className="status-bar">
                  <div className="bar-label">Saved</div>
                  <div className="bar">
                    <div 
                      className="bar-fill approved" 
                      style={{ width: `${Math.min((dashboardData.stats.savedCandidates / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="bar-percentage">{dashboardData.stats.savedCandidates}</div>
                </div>
                
                <div className="status-bar">
                  <div className="bar-label">Jobs</div>
                  <div className="bar">
                    <div 
                      className="bar-fill rejected" 
                      style={{ width: `${Math.min((dashboardData.stats.activeJobs / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="bar-percentage">{dashboardData.stats.activeJobs}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
              <h2>Quick Actions</h2>
              <div className="action-grid">
                <button 
                  className="quick-action-card"
                  onClick={() => setActiveTab('candidates')}
                >
                  <div className="action-icon blue">
                    <i className="ri-search-line"></i>
                  </div>
                  <div className="action-content">
                    <h3>Search Candidates</h3>
                    <p>Find the perfect candidates for your jobs</p>
                  </div>
                </button>
                
                <button 
                  className="quick-action-card"
                  onClick={handlePostJobClick}
                >
                  <div className="action-icon green">
                    <i className="ri-add-line"></i>
                  </div>
                  <div className="action-content">
                    <h3>Post New Job</h3>
                    <p>Create and publish a new job posting</p>
                  </div>
                </button>
                
                <button 
                  className="quick-action-card"
                  onClick={() => setActiveTab('saved')}
                >
                  <div className="action-icon orange">
                    <i className="ri-bookmark-line"></i>
                  </div>
                  <div className="action-content">
                    <h3>Saved Profiles</h3>
                    <p>View your saved candidate profiles</p>
                  </div>
                </button>
                
                <button 
                  className="quick-action-card"
                  onClick={() => setActiveTab('credits')}
                >
                  <div className="action-icon red">
                    <i className="ri-coin-line"></i>
                  </div>
                  <div className="action-content">
                    <h3>Buy Credits</h3>
                    <p>Purchase credits to unlock more features</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'candidates' && (
          <div className="candidates-section">
            <div className="section-placeholder">
              <h2>Resume Database</h2>
              <p>Search and filter candidates will be implemented here</p>
              <button 
                className="cta-btn"
                onClick={() => window.location.href = '/recruiter/search-candidates'}
              >
                Go to Candidate Search
              </button>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="saved-section">
            <div className="section-placeholder">
              <h2>Saved Candidate Profiles</h2>
              <p>Your saved candidate profiles will appear here</p>
              <button 
                className="cta-btn"
                onClick={() => window.location.href = '/recruiter/saved-profiles'}
              >
                View All Saved Profiles
              </button>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <div className="section-placeholder">
              <h2>Posted Jobs</h2>
              <p>Manage your job postings and applications</p>
              <button 
                className="cta-btn"
                onClick={() => window.location.href = '/recruiter/posted-jobs'}
              >
                Manage Job Posts
              </button>
            </div>
          </div>
        )}

        {activeTab === 'credits' && (
          <div className="credits-section">
            <div className="section-placeholder">
              <h2>Credits & Subscription</h2>
              <p>Current Plan: {dashboardData.stats.subscriptionStatus}</p>
              <p>Credits Remaining: {dashboardData.stats.creditsRemaining}</p>
              <button 
                className="cta-btn"
                onClick={() => window.location.href = '/recruiter/subscription'}
              >
                Manage Subscription
              </button>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-section">
            <div className="section-placeholder">
              <h2>Messages</h2>
              <p>Chat with candidates and manage communications</p>
              <button 
                className="cta-btn"
                onClick={() => window.location.href = '/recruiter/messages'}
              >
                Open Messages
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecruiterDashboard;
