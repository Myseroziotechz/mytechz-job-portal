//./components/Navbar.jsx
import React,{useRef,useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; 

function Navbar() {
  const sidebarRef = useRef(null);
  const location = useLocation();

  // function to open and close the sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobDropdownOpen, setJobDropdownOpen] = useState(false);
const [isDarkMode, setIsDarkMode] = useState(() => {
  if (typeof window === 'undefined') return false;
  try {
    const stored = localStorage.getItem('mytechz-theme');
    if (stored) {
      return stored === 'dark';
    }
  } catch (err) {
    console.error('Error reading theme from localStorage', err);
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
});

  
  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

const handleThemeToggle = () => {
  setIsDarkMode(prev => !prev);
};

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };
  
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
    setJobDropdownOpen(false);
  };
  
  const handleJobDropdownToggle = () => {
    setJobDropdownOpen(!jobDropdownOpen);
  };

  // close the sidebar by hover on body
  useEffect(() => {
  function handleClickOutside(event) {
    if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      handleSidebarClose();
    }
    // Close mobile menu when clicking outside on mobile/tablet
    if (mobileMenuOpen && !event.target.closest('.menu') && !event.target.closest('.dropdown-content')) {
        handleMobileMenuClose();
    }

  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebarOpen, mobileMenuOpen]);

  // login check
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // update the user name
  const [userInfo, setUserInfo] = useState(null);  // New state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token);
    if (user) {
      setUserInfo(JSON.parse(user));
    }
  }, []);

useEffect(() => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (isDarkMode) {
    root.classList.add('dark');
    try {
      localStorage.setItem('mytechz-theme', 'dark');
    } catch (err) {
      console.error('Error saving dark theme', err);
    }
  } else {
    root.classList.remove('dark');
    try {
      localStorage.setItem('mytechz-theme', 'light');
    } catch (err) {
      console.error('Error saving light theme', err);
    }
  }
}, [isDarkMode]);

    // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setJobDropdownOpen(false);
  }, [location.pathname]);

  return (
    <nav >
      <div className="logo">
        {/* menu dev */}
        <div className="menu dropdown">
            <div className="menu-icondiv color-nav-box" onClick={handleMobileMenuToggle}>
              <i className="ri-menu-2-line"></i>
            </div>
          {/* drop menu  */}
          <ul className={`dropdown-content ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li className='color-subnav-box hamburger-item home-nav-h'><Link to="/" onClick={handleMobileMenuClose}>Home</Link></li>
            <li className='color-subnav-box hamburger-item job-nav-h'><Link to="/jobs" onClick={handleMobileMenuClose}>Jobs</Link></li>
            {/* <li className='color-subnav-box admitcard-nav-h'><Link to="/admit-card" onClick={handleMobileMenuClose}>Admit Card</Link></li> */}
            {/* <li className='color-subnav-box result-nav-h'><Link to="/results" onClick={handleMobileMenuClose}>Results</Link></li> */}
            <li className='color-subnav-box hamburger-item document-nav-h'><Link to="/documents" onClick={handleMobileMenuClose}>Resume</Link></li>
            <li className='color-subnav-box hamburger-item admission-nav-h'><Link to="/admissions" onClick={handleMobileMenuClose}>Admissions</Link></li>
            <li className='color-subnav-box hamburger-item webinar-nav-h'><Link to="/webinars" onClick={handleMobileMenuClose}>Webinars</Link></li>
            <li className='color-subnav-box hamburger-item theme-nav-h'>
              <button type="button" className={`theme-toggle-btn ${isDarkMode ? 'theme-toggle-btn--active' : ''}`} onClick={() => {
                  handleThemeToggle();
                  handleMobileMenuClose();
                }}>
                <i className={isDarkMode ? 'ri-moon-clear-fill' : 'ri-moon-line'}></i>
              </button>
            </li>
            <li className="color-subnav-box hamburger-item login-nav-h">
              <Link to="/login" onClick={handleMobileMenuClose}>Login</Link>
            </li>
          </ul>

        </div>
        {/* img dev logo */}
        <div className='logo-img-div-nav'>
          <img src="../assets/logo2.png" alt="MytechZ Logo" className="logo-img"/>
        </div>
        {/* <h3 id="logo-text">Hireloop</h3> */}
      </div>

      <ul className="sector2">
       
        <li className="color-nav-box home-nav"><Link to="/">Home</Link></li>
        <li className="color-nav-box job-nav"><Link to="/jobs">Jobs</Link></li>
        {/* <li className="color-nav-box admitcard-nav"><Link to="/admit-card">Admit Card</Link></li>
        <li className="color-nav-box result-nav"><Link to="/results">Results</Link></li> */}
        <li className="color-nav-box document-nav"><Link to="/documents">Resume</Link></li>
        <li className="color-nav-box admission-nav"><Link to="/admissions">Admissions</Link></li>
        <li className="color-nav-box webinar-nav"><Link to="/webinars">Webinars</Link></li>
        
      </ul>
      <div className="log-div">
          {/* Theme Toggle (Desktop) */}
          <button
            type="button"
            className={`theme-toggle-btn ${isDarkMode ? 'theme-toggle-btn--active' : ''}`}
            onClick={handleThemeToggle}
            title="Toggle theme"
          >
            <i className={isDarkMode ? 'ri-moon-clear-fill' : 'ri-sun-line'}></i>
          </button>

        <div className="line"></div>
        {!isLoggedIn && (
        <div className="login-link tablet-hide-login">
          <Link to="/login" className="login-btn">Login</Link>
        </div>
       )}
        
        <div className="log-icon-div">
          <div className="login-img" onClick={handleSidebarToggle}>
            {isLoggedIn && userInfo?.profilePhoto ? (
              <>
                <img 
                  src={userInfo.profilePhoto} 
                  alt="User Profile Picture" 
                  className="profile-nav-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <i className="ri-user-line" style={{ display: 'none' }}></i>
              </>
            ) : (
              <i className="ri-user-line"></i>
            )}
          </div>
        </div>

      </div>
    {/* Naukri-Style Sidebar */}
    {sidebarOpen && (
  <div className="naukri-sidebar-overlay" onClick={handleSidebarClose}>
    <div className="naukri-sidebar" ref={sidebarRef} onClick={(e) => e.stopPropagation()}>
      {/* Profile Header Section */}
      <div className="naukri-sidebar-header">
        <button className="naukri-close-btn" onClick={handleSidebarClose}>
          <i className="ri-close-line"></i>
        </button>
        
        <div className="naukri-profile-section">
          <div className="naukri-avatar-wrapper">
            {userInfo?.profilePhoto ? (
              <img 
                src={userInfo.profilePhoto} 
                alt="Profile" 
                className="naukri-avatar-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="naukri-avatar-placeholder" style={{ display: userInfo?.profilePhoto ? 'none' : 'flex' }}>
              <i className="ri-user-line"></i>
            </div>
          </div>
          
          <div className="naukri-profile-info">
            <h3 className="naukri-profile-name">{userInfo?.name || 'User'}</h3>
            <p className="naukri-profile-email">{userInfo?.email || 'user@example.com'}</p>
            {userInfo?.role === 'user' && (
              <Link to="/profile" className="naukri-view-profile" onClick={handleSidebarClose}>
                View Profile <i className="ri-arrow-right-line"></i>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="naukri-sidebar-nav">
        {userInfo?.role === 'admin' ? (
          <>
            <Link 
              to="/dashboard/admin" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-dashboard-3-line"></i>
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/admin/jobs" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-briefcase-4-line"></i>
              <span>Manage Jobs</span>
            </Link>
            <Link 
              to="/admin/admissions" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-graduation-cap-line"></i>
              <span>Manage Admissions</span>
            </Link>
            <Link 
              to="/admin/users" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-team-line"></i>
              <span>Manage Users</span>
            </Link>
          </>
        ) : userInfo?.role === 'recruiter' ? (
          <>
            <Link 
              to="/recruiter" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-dashboard-3-line"></i>
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/recruiter/search-candidates" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-search-2-line"></i>
              <span>Search Candidates</span>
            </Link>
            <Link 
              to="/recruiter/saved-profiles" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-bookmark-3-line"></i>
              <span>Saved Profiles</span>
            </Link>
            <Link 
              to="/recruiter/posted-jobs" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-briefcase-4-line"></i>
              <span>Posted Jobs</span>
            </Link>
            <Link 
              to="/recruiter/subscription" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-vip-crown-line"></i>
              <span>Credits & Plans</span>
            </Link>
            <Link 
              to="/recruiter/messages" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-message-3-line"></i>
              <span>Messages</span>
            </Link>
          </>
        ) : (
          <>
            <Link 
              to="/dashboard/user" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-dashboard-3-line"></i>
              <span>Dashboard</span>
            </Link>
            <Link 
              to="/profile" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-user-3-line"></i>
              <span>Profile</span>
            </Link>
            <Link 
              to="/applications" 
              className="naukri-nav-item"
              onClick={handleSidebarClose}
            >
              <i className="ri-file-list-3-line"></i>
              <span>My Applications</span>
            </Link>
          </>
        )}
      </nav>

      {/* Logout Section */}
      <div className="naukri-sidebar-footer">
        <div className="naukri-divider"></div>
        <button 
          className="naukri-logout-btn"
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setIsLoggedIn(false);
              setUserInfo(null);
              handleSidebarClose();
              window.location.href = '/login';
            }
          }}
        >
          <i className="ri-logout-box-r-line"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  </div>
  )}
    </nav>
  );
}

export default Navbar;