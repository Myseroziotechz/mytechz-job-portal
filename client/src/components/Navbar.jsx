//./components/Navbar.jsx
import React,{useRef,useState, useEffect} from 'react';
import { Link, useLocation } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css'; 

function Navbar() {
  const location = useLocation();

  // function to open and close the mobile menu only
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

  
const handleThemeToggle = () => {
  setIsDarkMode(prev => !prev);
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

  // close the mobile menu by clicking outside
  useEffect(() => {
  function handleClickOutside(event) {
    // Close mobile menu when clicking outside on mobile/tablet
    if (mobileMenuOpen && !event.target.closest('.menu') && !event.target.closest('.dropdown-content')) {
        handleMobileMenuClose();
    }
  }
  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

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
        <>
          <div className="register-link tablet-hide-register">
            <Link to="/register" className="register-btn">Sign Up</Link>
          </div>
          <div className="login-link tablet-hide-login">
            <Link to="/login" className="login-btn">Login</Link>
          </div>
        </>
       )}
        
        <div className="log-icon-div">
          {isLoggedIn ? (
            <ProfileDropdown 
              userInfo={userInfo}
              onLogout={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsLoggedIn(false);
                setUserInfo(null);
                window.location.href = '/login';
              }}
            />
          ) : (
            <Link to="/login" className="login-img">
              <i className="ri-user-line"></i>
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;