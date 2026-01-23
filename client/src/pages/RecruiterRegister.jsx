import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Reusing existing register styles

function RecruiterRegister() {
  // Add error boundary and debugging
  const [debugMode, setDebugMode] = useState(false);
  const [renderError, setRenderError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    companyEmail: '',
    companyName: '',
    gstCin: '',
    hrName: '',
    hrRole: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [focused, setFocused] = useState({
    companyEmail: false,
    companyName: false,
    gstCin: false,
    hrName: false,
    hrRole: false,
    phone: false,
    password: false,
    confirm: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Error boundary
  try {
    // Input Change Handler
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      if (window.showPopup) {
        window.showPopup('Passwords do not match', 'error');
      } else {
        alert('Passwords do not match');
      }
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/recruiter-register`, {
        ...formData,
        role: 'recruiter'
      });
      
      if (response.data.message === 'registered') {
        if (window.showPopup) {
          window.showPopup('Recruiter registration successful! Please login to continue.', 'success');
        } else {
          alert('Recruiter registration successful! Please login to continue.');
        }
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check for specific field errors
        if (errorData.errors) {
          const fieldErrors = [];
          
          // Common field error mappings with user-friendly names
          const fieldNames = {
            'email': 'Email',
            'first_name': 'Name',
            'firstName': 'Name',
            'lastName': 'Name',
            'phone': 'Phone Number',
            'password': 'Password',
            'non_field_errors': 'Error'
          };
          
          for (const [field, errors] of Object.entries(errorData.errors)) {
            const friendlyName = fieldNames[field] || field;
            const errorList = Array.isArray(errors) ? errors : [errors];
            fieldErrors.push(`${friendlyName}: ${errorList.join(', ')}`);
          }
          
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('\n\n');
          }
        }
        
        // Use the message from backend if available and no field errors
        if (errorData.message && errorData.message !== 'Registration failed' && !errorData.errors) {
          errorMessage = errorData.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (window.showPopup) {
        window.showPopup(errorMessage, 'error');
      } else {
        alert(errorMessage);
      }
    }
  };

  // Click Outside Handler
  const handlePageClick = (e) => {
    if (!e.target.closest('.inbox-div')) {
      window.history.back();
    }
  };

  return (
    <div className='login-page' onClick={handlePageClick}>
      <div className="back-box">
        <div className="inbox-div" onClick={(e) => e.stopPropagation()}>
          <div className="sector1">
            <div className="sector1-job-img"></div>
          </div>

          <div className="sector2-login">
            <div className="sector2-job-img-div">
              <div className="logo-img"></div>
              <h3 id="logo-text">MytechZ</h3>
            </div>

            <form className="sector2-job-text register-form" onSubmit={handleSubmit}>
              <h1>Sign up as Recruiter</h1>

              {/* Company Email */}
              <div className={`input-group ${focused.companyEmail ? 'focused' : ''}`}>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, companyEmail: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, companyEmail: false }))}
                  placeholder=" "
                  required
                />
                <label>Company Email</label>
              </div>

              {/* Company Name */}
              <div className={`input-group ${focused.companyName ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, companyName: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, companyName: false }))}
                  placeholder=" "
                  required
                />
                <label>Company Name</label>
              </div>

              {/* GST/CIN (Optional) */}
              <div className={`input-group ${focused.gstCin ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="gstCin"
                  value={formData.gstCin}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, gstCin: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, gstCin: false }))}
                  placeholder=" "
                />
                <label>GST / CIN (Optional)</label>
              </div>

              {/* HR Name */}
              <div className={`input-group ${focused.hrName ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="hrName"
                  value={formData.hrName}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, hrName: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, hrName: false }))}
                  placeholder=" "
                  required
                />
                <label>HR / Recruiter Name</label>
              </div>

              {/* HR Role */}
              <div className={`input-group ${focused.hrRole ? 'focused' : ''}`}>
                <input
                  type="text"
                  name="hrRole"
                  value={formData.hrRole}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, hrRole: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, hrRole: false }))}
                  placeholder=" "
                  required
                />
                <label>Role / Designation</label>
              </div>

              {/* Phone */}
              <div className={`input-group ${focused.phone ? 'focused' : ''}`}>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, phone: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, phone: false }))}
                  placeholder=" "
                  required
                />
                <label>Phone Number</label>
              </div>

              {/* Password */}
              <div className={`input-group ${focused.password ? 'focused' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, password: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, password: false }))}
                  placeholder=" "
                  required
                />
                <label>Password</label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={showPassword ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                </button>
              </div>

              {/* Confirm Password */}
              <div className={`input-group ${focused.confirm ? 'focused' : ''}`}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onFocus={() => setFocused(prev => ({ ...prev, confirm: true }))}
                  onBlur={() => setFocused(prev => ({ ...prev, confirm: false }))}
                  placeholder=" "
                  required
                />
                <label>Confirm Password</label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  <i className={showConfirm ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                </button>
              </div>

              {/* Submit Button */}
              <button type="submit" className="submit-btn">
                Create Recruiter Account
              </button>

              {/* Login Link */}
              <div className="login-link">
                Already have an account? <a href="/login">Login here</a>
              </div>

              {/* Debug Info */}
              {debugMode && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: '#f8f9fa', 
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  <strong>Debug Info:</strong>
                  <br />Current URL: {window.location.href}
                  <br />Form Data: {JSON.stringify(formData, null, 2)}
                </div>
              )}

              {/* Debug Toggle */}
              <button 
                type="button" 
                onClick={() => setDebugMode(!debugMode)}
                style={{
                  marginTop: '1rem',
                  padding: '0.5rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem'
                }}
              >
                {debugMode ? 'Hide Debug' : 'Show Debug'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  } catch (error) {
    // Error boundary fallback
    return (
      <div style={{ 
        padding: '2rem', 
        textAlign: 'center',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <h1>⚠️ Component Error</h1>
        <p>There was an error rendering the Recruiter Registration form.</p>
        <p><strong>Error:</strong> {error.message}</p>
        
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '0.5rem'
            }}
          >
            Reload Page
          </button>
          
          <a 
            href="/test" 
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              margin: '0.5rem'
            }}
          >
            Go to Test Page
          </a>
        </div>
      </div>
    );
  }
}

export default RecruiterRegister;