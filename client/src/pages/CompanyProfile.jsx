import React, { useState, useEffect } from 'react';
import './UserDashboard.css';

function CompanyProfile() {
  // Original data from server (for cancel functionality)
  const [originalData, setOriginalData] = useState(null);
  
  // Current form data (editable)
  const [formData, setFormData] = useState({
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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [newBenefit, setNewBenefit] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      // Demo mode
      if (token === 'demo-recruiter-token') {
        const demoData = {
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
        };
        setFormData(demoData);
        setOriginalData(JSON.parse(JSON.stringify(demoData))); // Deep copy
        setProfileExists(true);
        setLoading(false);
        return;
      }
      
      // Real API call
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/company-profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          const profile = data.profile;
          const mappedData = {
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
          };
          setFormData(mappedData);
          setOriginalData(JSON.parse(JSON.stringify(mappedData))); // Deep copy
          setProfileExists(true);
        } else {
          setProfileExists(false);
          setIsEditMode(true); // Auto-enable edit for new profiles
        }
      } else if (response.status === 404) {
        setProfileExists(false);
        setIsEditMode(true);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileExists(false);
      setIsEditMode(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
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

  const handleRemoveBenefit = (benefit) => {
    setFormData(prev => ({
      ...prev,
      benefitsPerks: prev.benefitsPerks.filter(b => b !== benefit)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.companyName || !formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.industry || !formData.industry.trim()) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.companySize) {
      newErrors.companySize = 'Company size is required';
    }
    if (!formData.headOfficeLocation || !formData.headOfficeLocation.trim()) {
      newErrors.headOfficeLocation = 'Head office location is required';
    }
    if (!formData.companyDescription || !formData.companyDescription.trim()) {
      newErrors.companyDescription = 'Company description is required';
    }
    if (!formData.officeAddress || !formData.officeAddress.trim()) {
      newErrors.officeAddress = 'Office address is required';
    }
    if (!formData.workMode) {
      newErrors.workMode = 'Work mode is required';
    }
    if (formData.website && formData.website.trim()) {
      try {
        new URL(formData.website);
      } catch {
        newErrors.website = 'Please enter a valid website URL';
      }
    }
    
    console.log('Validation errors:', newErrors);
    console.log('Form data:', formData);
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCancel = () => {
    if (originalData) {
      // Restore original data
      setFormData(JSON.parse(JSON.stringify(originalData)));
    }
    setErrors({});
    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      if (window.showPopup) {
        window.showPopup('Please fix the errors before saving', 'error');
      }
      return;
    }

    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      // Demo mode - check both token and email
      if (token === 'demo-recruiter-token' || user.email === 'demo@recruiter.com') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOriginalData(JSON.parse(JSON.stringify(formData))); // Update original
        setProfileExists(true);
        setIsEditMode(false);
        if (window.showPopup) {
          window.showPopup('Company profile saved successfully! (Demo Mode)', 'success');
        }
        setSaving(false);
        return;
      }
      
      // Real API call
      const backendData = {
        company_name: formData.companyName,
        industry: formData.industry,
        company_size: formData.companySize,
        founded_year: formData.foundedYear ? parseInt(formData.foundedYear) : null,
        head_office_location: formData.headOfficeLocation,
        gst_cin: formData.gstCin || '',
        company_description: formData.companyDescription || '',
        mission_and_culture: formData.missionCulture || '',
        benefits_list: formData.benefitsPerks || [],
        office_address: formData.officeAddress || '',
        work_mode: formData.workMode || 'hybrid',
        office_photos_list: formData.officePhotos || []
      };
      
      if (formData.website && formData.website.trim()) {
        backendData.website = formData.website;
      }
      
      const method = profileExists ? 'PUT' : 'POST';
      const url = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/company-profile`;
      
      console.log('Saving company profile:', { method, url, data: backendData });
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(backendData)
      });

      const responseData = await response.json();
      
      console.log('Save response:', { status: response.status, data: responseData });

      if (response.ok && responseData.success) {
        setOriginalData(JSON.parse(JSON.stringify(formData))); // Update original
        setProfileExists(true);
        setIsEditMode(false);
        if (window.showPopup) {
          window.showPopup(`Company profile ${profileExists ? 'updated' : 'created'} successfully!`, 'success');
        }
        fetchCompanyProfile(); // Refresh data
      } else {
        const errorMsg = responseData.message || responseData.error || 'Failed to save profile';
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (window.showPopup) {
        window.showPopup(`Error saving company profile: ${error.message}`, 'error');
      } else {
        alert(`Error saving company profile: ${error.message}`);
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="user-dashboard">
        <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>
          <div>Loading company profile...</div>
        </div>
      </div>
    );
  }

  const completionPercent = Math.round(
    (Object.values(formData).filter(v => v && v !== '').length / Object.keys(formData).length) * 100
  );

  return (
    <div className="user-dashboard">
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
              <div className="stat-number">{completionPercent}%</div>
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
                onClick={handleCancel}
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
                onClick={handleSave}
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
          
          {Object.keys(errors).length > 0 && (
            <div style={{
              backgroundColor: '#fee',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              border: '1px solid #fcc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <i className="ri-error-warning-line" style={{ fontSize: '1.5rem', color: '#d32f2f' }}></i>
                <strong style={{ color: '#d32f2f' }}>Please fix the following errors:</strong>
              </div>
              <ul style={{ margin: '0.5rem 0 0 2.5rem', color: '#c62828' }}>
                {Object.entries(errors).map(([field, message]) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
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
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Retail">Retail</option>
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
                  type="text"
                  value={formData.foundedYear}
                  onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                  placeholder="2020"
                />
              </div>

              <div className="form-group">
                <label>Head Office Location *</label>
                <input
                  type="text"
                  value={formData.headOfficeLocation}
                  onChange={(e) => handleInputChange('headOfficeLocation', e.target.value)}
                  placeholder="City, Country"
                  className={errors.headOfficeLocation ? 'error' : ''}
                />
                {errors.headOfficeLocation && <span className="error-message">{errors.headOfficeLocation}</span>}
              </div>

              <div className="form-group">
                <label>GST/CIN Number</label>
                <input
                  type="text"
                  value={formData.gstCin}
                  onChange={(e) => handleInputChange('gstCin', e.target.value)}
                  placeholder="Enter GST or CIN number"
                />
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
              <div className="benefits-input">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add a benefit (e.g., Health Insurance)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddBenefit())}
                />
                <button type="button" onClick={handleAddBenefit} className="btn-secondary">
                  Add
                </button>
              </div>
              <div className="benefits-list">
                {formData.benefitsPerks.map((benefit, index) => (
                  <span key={index} className="benefit-tag">
                    {benefit}
                    <i className="ri-close-line" onClick={() => handleRemoveBenefit(benefit)}></i>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Office & Work Mode Section */}
          <div className="status-bars">
            <h2>Office & Work Mode</h2>
            <div className="form-group">
              <label>Office Address *</label>
              <textarea
                value={formData.officeAddress}
                onChange={(e) => handleInputChange('officeAddress', e.target.value)}
                placeholder="Enter complete office address..."
                rows="3"
                className={errors.officeAddress ? 'error' : ''}
              />
              {errors.officeAddress && <span className="error-message">{errors.officeAddress}</span>}
            </div>

            <div className="form-group">
              <label>Work Mode *</label>
              <select
                value={formData.workMode}
                onChange={(e) => handleInputChange('workMode', e.target.value)}
                className={errors.workMode ? 'error' : ''}
              >
                <option value="">Select Work Mode</option>
                <option value="remote">Remote</option>
                <option value="office">On-site</option>
                <option value="hybrid">Hybrid</option>
              </select>
              {errors.workMode && <span className="error-message">{errors.workMode}</span>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyProfile;