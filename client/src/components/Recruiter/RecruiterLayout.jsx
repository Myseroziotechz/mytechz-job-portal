import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import './RecruiterLayout.css';

function RecruiterLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [notifications, setNotifications] = useState(3);
  const location = useLocation();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(userData);
    // Fetch credits and notifications
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits || 25);
      } else {
        setCredits(25); // Fallback
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setCredits(25); // Fallback
    }
  };

  const sidebarItems = [
    {
      path: '/recruiter',
      icon: 'ri-dashboard-line',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/recruiter/search-candidates',
      icon: 'ri-search-line',
      label: 'Search Candidates'
    },
    {
      path: '/recruiter/resume-database',
      icon: 'ri-database-line',
      label: 'Resume Database'
    },
    {
      path: '/recruiter/saved-profiles',
      icon: 'ri-bookmark-line',
      label: 'Saved Profiles'
    },
    {
      path: '/recruiter/posted-jobs',
      icon: 'ri-briefcase-line',
      label: 'Posted Jobs'
    },
    {
      path: '/recruiter/company-profile',
      icon: 'ri-building-line',
      label: 'Company Profile'
    },
    {
      path: '/recruiter/subscription',
      icon: 'ri-coin-line',
      label: 'Credits & Plans'
    },
    {
      path: '/recruiter/messages',
      icon: 'ri-message-line',
      label: 'Messages'
    }
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="recruiter-layout">
      {/* Left Sidebar */}
      <div className={`recruiter-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <div className="logo-img"></div>
            {!sidebarCollapsed && <span className="logo-text">MytechZ</span>}
          </div>
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            <i className={sidebarCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'}></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`nav-item ${isActiveRoute(item.path, item.exact) ? 'active' : ''}`}
              title={sidebarCollapsed ? item.label : ''}
            >
              <i className={item.icon}></i>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-section">
            <div className="user-avatar">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" />
              ) : (
                <i className="ri-user-line"></i>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="user-info">
                <div className="user-name">{user?.companyName || user?.name || 'Recruiter'}</div>
                <div className="user-email">{user?.email}</div>
              </div>
            )}
          </div>
          
          {!sidebarCollapsed && (
            <button className="logout-btn" onClick={handleLogout}>
              <i className="ri-logout-box-line"></i>
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="recruiter-main">
        {/* Top Bar */}
        <div className="recruiter-topbar">
          <div className="topbar-left">
            <div className="global-search">
              <i className="ri-search-line"></i>
              <input 
                type="text" 
                placeholder="Search candidates, jobs, companies..."
                className="global-search-input"
              />
            </div>
          </div>

          <div className="topbar-right">
            <div className="credits-display">
              <i className="ri-coin-line"></i>
              <span className="credits-count">{credits}</span>
              <span className="credits-label">Credits</span>
            </div>

            <div className="notifications">
              <button className="notification-btn">
                <i className="ri-notification-line"></i>
                {notifications > 0 && (
                  <span className="notification-badge">{notifications}</span>
                )}
              </button>
            </div>

            <div className="profile-menu">
              <button className="profile-btn">
                <div className="profile-avatar">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt="Profile" />
                  ) : (
                    <i className="ri-user-line"></i>
                  )}
                </div>
                <span className="profile-name">{user?.companyName || user?.name || 'Recruiter'}</span>
                <i className="ri-arrow-down-s-line"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="recruiter-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default RecruiterLayout;