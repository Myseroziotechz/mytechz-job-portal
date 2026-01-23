import React, { useState } from 'react';
import './DreamCollegeForm.css';

/**
 * IMPORTANT: Google Form integration
 * ----------------------------------
 * 1. Create a Google Form with fields:
 *    - Name
 *    - Phone No
 *    - Email
 *    - Degree Desired
 *    - Branch Desired
 *    - Brief Description
 *    - Expected Percentage in 12th
 *    - PUC/12th Registration no.
 *
 * 2. Publish the form, then open the "View form" page,
 *    right–click and choose "View page source".
 *
 * 3. Find the <form> tag with action="https://docs.google.com/forms/d/e/.../formResponse"
 *    and copy that full URL into GOOGLE_FORM_ACTION below.
 *
 * 4. For each question, copy its "name" attribute (looks like entry.123456789)
 *    and update the FIELD_NAMES mapping.
 */

const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID_HERE/formResponse";

const FIELD_NAMES = {
  name: "entry.YOUR_ENTRY_ID_FOR_NAME",
  phone: "entry.YOUR_ENTRY_ID_FOR_PHONE",
  email: "entry.YOUR_ENTRY_ID_FOR_EMAIL",
  regNo: "entry.YOUR_ENTRY_ID_FOR_PUC_REG_NO",
  degree: "entry.YOUR_ENTRY_ID_FOR_DEGREE_DESIRED",
  branch: "entry.YOUR_ENTRY_ID_FOR_BRANCH_DESIRED",
  description: "entry.YOUR_ENTRY_ID_FOR_BRIEF_DESCRIPTION",
  percentage: "entry.YOUR_ENTRY_ID_FOR_EXPECTED_PERCENTAGE",
};

const initialFormState = {
  name: '',
  phone: '',
  email: '',
  regNo: '',
  degree: '',
  branch: '',
  description: '',
  percentage: '',
};

function DreamCollegeForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null); // null | 'submitting' | 'success'

  const openModal = () => {
    setStatus(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    if (!formData.regNo.trim()) {
      newErrors.regNo = 'PUC/12th Registration no. is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.degree.trim()) {
      newErrors.degree = 'Degree desired is required';
    }

    if (!formData.branch.trim()) {
      newErrors.branch = 'Branch desired is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please add a brief description';
    }

    if (!formData.percentage.trim()) {
      newErrors.percentage = 'Expected percentage is required';
    } else {
      const value = formData.percentage.trim();
      const num = Number(value);
      if (Number.isNaN(num)) {
        newErrors.percentage = 'Enter a valid number';
      } else if (num < 0 || num >= 100) {
        newErrors.percentage = 'Must be between 0 and 99.99';
      } else if (!/^\d{1,2}(\.\d{1,2})?$/.test(value)) {
        newErrors.percentage = 'Use up to 2 decimal places (e.g. 85 or 92.75)';
      }
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus('submitting');

    // Let the browser submit the form to Google Forms via the hidden iframe.
    // This avoids CORS issues and works when hosted locally or online.
    event.target.submit();

    setStatus('success');
    setFormData(initialFormState);
  };

  return (
    <section className="dream-college-section">
      <button
        type="button"
        className="dream-college-btn"
        onClick={openModal}
      >
        Ask us your dream college
      </button>

      {isOpen && (
        <div className="dream-modal-overlay" onClick={closeModal}>
          <div className="dream-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dream-modal-header">
              <h2>Ask us your dream college</h2>
              <button
                type="button"
                className="dream-modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <p className="dream-modal-subtitle">
              Tell us your preferences and we&apos;ll reach out with personalised guidance.
            </p>

            <iframe
              name="hidden_iframe_dream_college"
              title="Dream college hidden submission target"
              style={{ display: 'none' }}
            ></iframe>

            <form
              className="dream-form"
              action={GOOGLE_FORM_ACTION}
              method="POST"
              target="hidden_iframe_dream_college"
              onSubmit={handleSubmit}
            >
              <div className="dream-form-grid">
                <div className="dream-form-field">
                  <label>
                    Name<span className="dream-required">*</span>
                  </label>
                  <input
                    type="text"
                    name={FIELD_NAMES.name}
                    value={formData.name}
                    onChange={handleChange('name')}
                    className="dream-input"
                    required
                  />
                  {errors.name && <p className="dream-error">{errors.name}</p>}
                </div>

                <div className="dream-form-field">
                  <label>
                    Phone No<span className="dream-required">*</span>
                  </label>
                  <input
                    type="tel"
                    name={FIELD_NAMES.phone}
                    value={formData.phone}
                    onChange={handleChange('phone')}
                    className="dream-input"
                    inputMode="numeric"
                    pattern="\d{10}"
                    maxLength={10}
                    required
                  />
                  <p className="dream-hint">Enter a 10 digit mobile number</p>
                  {errors.phone && <p className="dream-error">{errors.phone}</p>}
                </div>

                <div className="dream-form-field">
                  <label>
                    PUC/12th Registration no.<span className="dream-required">*</span>
                  </label>
                  <input
                    type="text"
                    name={FIELD_NAMES.regNo}
                    value={formData.regNo}
                    onChange={handleChange('regNo')}
                    className="dream-input"
                    placeholder="Enter your PUC/12th registration number"
                    required
                  />
                  {errors.regNo && <p className="dream-error">{errors.regNo}</p>}
                </div>

                <div className="dream-form-field">
                  <label>
                    Email<span className="dream-required">*</span>
                  </label>
                  <input
                    type="email"
                    name={FIELD_NAMES.email}
                    value={formData.email}
                    onChange={handleChange('email')}
                    className="dream-input"
                    required
                  />
                  {errors.email && <p className="dream-error">{errors.email}</p>}
                </div>

                <div className="dream-form-field">
                  <label>
                    Degree Desired<span className="dream-required">*</span>
                  </label>
                  <input
                    type="text"
                    name={FIELD_NAMES.degree}
                    value={formData.degree}
                    onChange={handleChange('degree')}
                    className="dream-input"
                    placeholder="e.g. B.E, B.Tech, B.Sc"
                    required
                  />
                  {errors.degree && <p className="dream-error">{errors.degree}</p>}
                </div>

                <div className="dream-form-field">
                  <label>
                    Branch Desired<span className="dream-required">*</span>
                  </label>
                  <input
                    type="text"
                    name={FIELD_NAMES.branch}
                    value={formData.branch}
                    onChange={handleChange('branch')}
                    className="dream-input"
                    placeholder="e.g. CSE, ECE, Mechanical"
                    required
                  />
                  {errors.branch && <p className="dream-error">{errors.branch}</p>}
                </div>

                <div className="dream-form-field">
                  <label>
                    Expected percentage in 12th<span className="dream-required">*</span>
                  </label>
                  <input
                    type="number"
                    name={FIELD_NAMES.percentage}
                    value={formData.percentage}
                    onChange={handleChange('percentage')}
                    className="dream-input"
                    min="0"
                    max="99.99"
                    step="0.01"
                    placeholder="e.g. 92.50"
                    required
                  />
                  <p className="dream-hint">Must be less than 100, up to 2 decimals</p>
                  {errors.percentage && <p className="dream-error">{errors.percentage}</p>}
                </div>
              </div>

              <div className="dream-form-field">
                <label>
                  Brief description<span className="dream-required">*</span>
                </label>
                <textarea
                  name={FIELD_NAMES.description}
                  value={formData.description}
                  onChange={handleChange('description')}
                  className="dream-textarea"
                  rows={4}
                  placeholder="Tell us about your goals, preferred location, budget, exam scores, etc."
                  required
                ></textarea>
                {errors.description && <p className="dream-error">{errors.description}</p>}
              </div>

              <div className="dream-form-actions">
                <button
                  type="button"
                  className="dream-secondary-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="dream-primary-btn"
                  disabled={status === 'submitting'}
                >
                  {status === 'submitting' ? 'Submitting...' : 'Submit enquiry'}
                </button>
              </div>

              {status === 'success' && (
                <p className="dream-success">
                  Thank you! Your response has been recorded. We&apos;ll contact you soon.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default DreamCollegeForm;
