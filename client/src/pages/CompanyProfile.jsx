import React, { useState, useEffect } from 'react';
import './UserDashboard.css'; // Reusing existing dashboard styles

function CompanyProfile() {
  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    headOfficeLocation: '',
    
    // Legal & Verification
    gstCin: '',
    registrationDocument: null,
    verificationStatus: 'pending',
    
    // About Company
    companyDescription: '',
    missionCulture: '',
    benefitsPerks: [],
    
    // Office & Work Mode
    officeAddress: '',
    workMode: 'hybrid',
    officePhotos: []
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [newBenefit, setNewBenefit] = useState('');
  const [debugInfo, setDebugInfo] = useState('');
  const [isEditMode, setIsEditMode] = useState(false); // Global edit mode

  const [profileExists, setProfileExists] = useState(false); // Track if profile exists

  useEffect(() => {
    console.log('CompanyProfile component mounted');
    setDebugInfo('Component mounted, fetching profile...');
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setDebugInfo('Fetching company profile...');
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      // Check if using demo mode
      if (token === 'demo-recruiter-token') {
        setDebugInfo('Demo mode detected - using demo data');
        setProfileExists(true);
        setFormData({
          companyName: 'TechCorp Solutions',
          website: 'https://techcorp.example.com',
          industry: 'Information Technology',
          companySize: '50-200',
          foundedYear: '2015',
          headOfficeLocation: 'San Francisco, CA',
          gstCin: 'DEMO123456789',
          registrationDocument: null,
          verificationStatus: 'verified',
          companyDescription: 'Leading technology solutions provider specializing in cloud computing and AI.',
          missionCulture: 'Innovation-driven culture focused on solving real-world problems.',
          benefitsPerks: ['Health Insurance', 'Remote Work', 'Learning Budget', 'Flexible Hours'],
          officeAddress: '123 Tech Street, San Francisco, CA 94105',
          workMode: 'hybrid',
          officePhotos: []
        });
        setLoading(false);
        return;
      }
      
      if (!token) {
        setDebugInfo('No token found, redirecting to login...');
        window.location.href = '/login';
        return;
      }
      
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/company-profile`;
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Response status:', response.status);
      setDebugInfo(`API response: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        setDebugInfo('Profile data received successfully');
        
        // Map backend response to frontend format
        if (data.success && data.profile) {
          setProfileExists(true); // Profile exists, use PUT for updates
          const profile = data.profile;
          setFormData({
            companyName: profile.company_name || '',
            website: profile.website || '',
            industry: profile.industry || '',
            companySize: profile.company_size || '',
            foundedYear: profile.founded_year || '',
            headOfficeLocation: profile.head_office_location || '',
            gstCin: profile.gst_cin || '',
            registrationDocument: null,
            verificationStatus: profile.verification_status || 'pending',
            companyDescription: profile.company_description || '',
            missionCulture: profile.mission_and_culture || '',
            benefitsPerks: profile.benefits_list || [],
            officeAddress: profile.office_address || '',
            workMode: profile.work_mode || 'hybrid',
            officePhotos: profile.office_photos_list || []
          });
          setDebugInfo(`Profile loaded: ${profile.company_name || 'No company name'}`);
        } else {
          // No profile exists, use empty form
          setProfileExists(false); // No profile, use POST for creation
          setIsEditMode(true); // Auto-enable edit mode for new profiles
          setDebugInfo('No profile found - showing empty form');
          const emptyData = generateExistingData();
          setFormData(emptyData);
        }
      } else if (response.status === 404) {
        // Profile doesn't exist yet, use empty form
        setProfileExists(false); // No profile, use POST for creation
        setIsEditMode(true); // Auto-enable edit mode for new profiles
        setDebugInfo('Profile not found (404) - showing empty form for new profile creation');
        const emptyData = generateExistingData();
        setFormData(emptyData);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      setDebugInfo(`Error: ${error.message} - showing empty form`);
      setProfileExists(false); // On error, assume no profile exists
      setIsEditMode(true); // Auto-enable edit mode for new profiles
      // On error, show empty form (not demo data)
      const emptyData = generateExistingData();
      setFormData(emptyData);
    } finally {
      setLoading(false);
      console.log('Loading complete');
    }
  };



  const generateExistingData = () => {
    // Return EMPTY form data - no demo/default data
    return {
      companyName: '',
      website: '',
      industry: '',
      companySize: '',
      foundedYear: '',
      headOfficeLocation: '',
      gstCin: '',
      registrationDocument: null,
      verificationStatus: 'pending',
      companyDescription: '',
      missionCulture: '',
      benefitsPerks: [],
      officeAddress: '',
      workMode: 'hybrid',
      officePhotos: []
    };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
    
    // Auto-save draft
    autoSaveDraft();
  };

  const autoSaveDraft = () => {
    // Debounced auto-save
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
      localStorage.setItem('companyProfileDraft', JSON.stringify(formData));
    }, 1000);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
    }
    
    if (!formData.headOfficeLocation.trim()) {
      newErrors.headOfficeLocation = 'Head office location is required';
    }
    
    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website = 'Please enter a valid website URL';
    }
    
    if (!formData.companyDescription.trim()) {
      newErrors.companyDescription = 'Company description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      if (window.showPopup) {
        window.showPopup('Please fix the errors before saving', 'error');
      }
      return;
    }

    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Map frontend data to backend format
      const backendData = {
        company_name: formData.companyName,
        industry: formData.industry,
        company_size: formData.companySize,
        founded_year: formData.foundedYear ? parseInt(formData.foundedYear) : null,
        head_office_location: formData.headOfficeLocation,
        gst_cin: formData.gstCin,
        company_description: formData.companyDescription,
        mission_and_culture: formData.missionCulture,
        benefits_list: formData.benefitsPerks,
        office_address: formData.officeAddress,
        work_mode: formData.workMode,
        office_photos_list: formData.officePhotos
      };
      
      // Only include website if it's not empty
      if (formData.website && formData.website.trim()) {
        backendData.website = formData.website;
      }
      
      // Determine HTTP method based on whether profile exists
      const method = profileExists ? 'PUT' : 'POST';
      const action = profileExists ? 'updated' : 'created';
      
      console.log(`Sending ${method} request with data:`, backendData);
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/company-profile`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(backendData)
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok && responseData.success) {
        // Clear draft
        localStorage.removeItem('companyProfileDraft');
        
        // Update profileExists flag for future saves
        setProfileExists(true);
        
        // Exit edit mode after successful save
        setIsEditMode(false);
        
        if (window.showPopup) {
          window.showPopup(`Company profile ${action} successfully!`, 'success');
        }
        
        // Refresh the data
        fetchCompanyProfile();
      } else {
        throw new Error(responseData.message || `Failed to ${action.slice(0, -1)} profile`);
      }
    } catch (error) {
      console.error('Error saving company profile:', error);
      if (window.showPopup) {
        window.showPopup(`Error saving company profile: ${error.message}`, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim() && !formData.benefitsPerks.includes(newBenefit.trim())) {
      setFormData(prev => ({
        ...prev,
        benefitsPerks: [...prev.benefitsPerks, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefitsPerks: prev.benefitsPerks.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  if (loading) {
    return (
      <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>
        <div>Loading company profile...</div>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
          Debug: {debugInfo}
        </div>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      {/* Debug Info */}
      <div style={{ 
        background: '#f0f0f0', 
        padding: '1rem', 
        marginBottom: '1rem', 
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <strong>Debug Info:</strong> {debugInfo}
        <br />
        <strong>Company Name:</strong> {formData.companyName || 'Not set'}
        <br />
        <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
      </div>
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Company Profile</h1>
          <p>Manage your company information and build your employer brand</p>
        </div>
        
        <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="stats-overview" style={{ marginRight: '1rem' }}>
            <div className="stat-item">
              <div className="stat-number">
                {formData.verificationStatus === 'approved' ? (
                  <i className="ri-verified-badge-fill" style={{ color: '#22c55e' }}></i>
                ) : formData.verificationStatus === 'pending' ? (
                  <i className="ri-time-line" style={{ color: '#f59e0b' }}></i>
                ) : (
                  <i className="ri-close-circle-line" style={{ color: '#ef4444' }}></i>
                )}
              </div>
              <div className="stat-label">
                {formData.verificationStatus === 'approved' ? 'Verified' : 
                 formData.verificationStatus === 'pending' ? 'Pending' : 'Not Verified'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{Math.round((Object.values(formData).filter(v => v && v !== '').length / Object.keys(formData).length) * 100)}%</div>
              <div className="stat-label">Profile Complete</div>
            </div>
          </div>
          
          {!isEditMode ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setIsEditMode(true)}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="ri-edit-line"></i>
              Edit Profile
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setIsEditMode(false);
                  fetchCompanyProfile(); // Reload data to discard changes
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                <i className="ri-close-line"></i>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveProfile}
                disabled={saving}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {saving ? (
                  <>
                    <i className="ri-loader-line spinning"></i>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="ri-save-line"></i>
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Content */}
      <div className="dashboard-main">
        <form className={`company-profile-form ${!isEditMode ? 'view-mode' : 'edit-mode'}`}>
          
          {!isEditMode && (
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              border: '1px solid #90caf9'
            }}>
              <i className="ri-information-line" style={{ fontSize: '1.5rem', color: '#1976d2' }}></i>
              <span style={{ color: '#1565c0', fontWeight: '500' }}>
                Viewing mode - Click "Edit Profile" button above to make changes
              </span>
            </div>
          )}
          
          {/* Company Information Section */}
          <div className="status-bars">
            <h2>Company Information</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Company Name *</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                  disabled={!isEditMode}
                  className={errors.companyName ? 'error' : ''}
                />
                {errors.companyName && <span className="error-message">{errors.companyName}</span>}
              </div>

              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://company.com"
                  className={errors.website ? 'error' : ''}
                />
                {errors.website && <span className="error-message">{errors.website}</span>}
              </div>

              <div className="form-group">
                <label>Industry *</label>
                <select
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className={errors.industry ? 'error' : ''}
                >
                  <option value="">Select Industry</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Media & Entertainment">Media & Entertainment</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Other">Other</option>
                </select>
                {errors.industry && <span className="error-message">{errors.industry}</span>}
              </div>

              <div className="form-group">
                <label>Company Size *</label>
                <select
                  value={formData.companySize}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                  className={errors.companySize ? 'error' : ''}
                >
                  <option value="">Select Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
                {errors.companySize && <span className="error-message">{errors.companySize}</span>}
              </div>

              <div className="form-group">
                <label>Founded Year</label>
                <input
                  type="number"
                  value={formData.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                  placeholder="2015"
                  min="1800"
                  max={new Date().getFullYear()}
                />
              </div>

              <div className="form-group">
                <label>Head Office Location *</label>
                <input
                  type="text"
                  value={formData.headOfficeLocation}
                  onChange={(e) => handleInputChange('headOfficeLocation', e.target.value)}
                  placeholder="City, State, Country"
                  className={errors.headOfficeLocation ? 'error' : ''}
                />
                {errors.headOfficeLocation && <span className="error-message">{errors.headOfficeLocation}</span>}
              </div>
            </div>
          </div>

          {/* Legal & Verification Section */}
          <div className="status-bars">
            <h2>Legal & Verification</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>GST / CIN</label>
                <input
                  type="text"
                  value={formData.gstCin}
                  onChange={(e) => handleInputChange('gstCin', e.target.value)}
                  placeholder="Enter GST or CIN number"
                />
              </div>

              <div className="form-group">
                <label>Company Registration Document</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('registrationDocument', e.target.files[0])}
                    id="registration-doc"
                  />
                  <label htmlFor="registration-doc" className="file-upload-label">
                    <i className="ri-upload-line"></i>
                    {formData.registrationDocument ? formData.registrationDocument.name : 'Upload Document'}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* About Company Section */}
          <div className="status-bars">
            <h2>About Company</h2>
            <div className="form-group">
              <label>Company Description *</label>
              <textarea
                value={formData.companyDescription}
                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                placeholder="Describe your company, what you do, and what makes you unique..."
                rows="4"
                className={errors.companyDescription ? 'error' : ''}
              />
              {errors.companyDescription && <span className="error-message">{errors.companyDescription}</span>}
            </div>

            <div className="form-group">
              <label>Mission & Culture</label>
              <textarea
                value={formData.missionCulture}
                onChange={(e) => handleInputChange('missionCulture', e.target.value)}
                placeholder="Share your company's mission, values, and culture..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Benefits & Perks</label>
              <div className="array-input">
                <div className="input-with-button">
                  <input
                    type="text"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    placeholder="Add a benefit or perk..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                  />
                  <button type="button" onClick={handleAddBenefit} className="add-btn">
                    <i className="ri-add-line"></i>
                  </button>
                </div>
                
                {formData.benefitsPerks.length > 0 && (
                  <div className="items-list">
                    {formData.benefitsPerks.map((benefit, index) => (
                      <div key={index} className="item-chip">
                        <span>{benefit}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBenefit(index)}
                          className="remove-btn"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Office & Work Mode Section */}
          <div className="status-bars">
            <h2>Office & Work Mode</h2>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Office Address</label>
                <textarea
                  value={formData.officeAddress}
                  onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                  placeholder="Enter complete office address..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Work Mode</label>
                <select
                  value={formData.workMode}
                  onChange={(e) => handleInputChange('workMode', e.target.value)}
                >
                  <option value="office">Office Only</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote Only</option>
                </select>
              </div>

              <div className="form-group">
                <label>Office Photos</label>
                <div className="file-upload">
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleFileUpload('officePhotos', Array.from(e.target.files))}
                    id="office-photos"
                  />
                  <label htmlFor="office-photos" className="file-upload-label">
                    <i className="ri-image-line"></i>
                    {formData.officePhotos.length > 0 ? `${formData.officePhotos.length} photos selected` : 'Upload Office Photos'}
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => window.location.href = '/recruiter'}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <>
                  <i className="ri-loader-line spinning"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="ri-save-line"></i>
                  {profileExists ? 'Update Profile' : 'Create Profile'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyProfile;