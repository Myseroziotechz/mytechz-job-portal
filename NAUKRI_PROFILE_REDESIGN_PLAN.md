# Naukri-Style Profile Page Redesign Plan

## Overview
Complete UI/UX redesign of the Candidate Profile Page to match Naukri.com's professional look and feel while maintaining all existing backend functionality.

## Design Principles
- ✅ Keep all existing database columns
- ✅ Keep all existing API calls
- ✅ Keep all existing form fields
- ✅ Keep all existing validations
- ✅ Only change UI layout, styling, and interactions

## Page Structure

### 1. Top Profile Header (3-Column Layout)

#### Left Section:
- Circular profile photo (120px)
- Upload photo button
- Profile completion ring (circular progress)

#### Center Section:
- Full Name (Large, Bold)
- Email (with verified icon)
- Phone (with verified icon)
- Location
- Date of Birth
- Gender

#### Right Section:
- Profile Completion Widget
  - Percentage (e.g., 75%)
  - Progress bar
  - Missing details list
  - Quick action CTAs

### 2. Navigation Tabs
- View & Edit (Active)
- Activity Insights (Future)

### 3. Main Content (2-Column Layout)

#### Left Sidebar (Sticky):
- Quick Links Menu:
  - Career Preferences
  - Education
  - Key Skills
  - Employment
  - Projects
  - Resume
  - Personal Details

#### Right Content Area:
- Section Cards (Each with):
  - Section title
  - Edit button
  - View mode content
  - Inline edit form
  - Save & Cancel buttons

## Sections to Implement

### 1. Career Preferences
- Preferred job type
- Preferred location
- Availability
- Expected salary

### 2. Education
- Degree
- College/University
- Year of passing
- Percentage/CGPA

### 3. Key Skills
- Skill tags
- Add/Remove skills
- Skill level indicators

### 4. Employment
- Current company
- Job title
- Experience duration
- Key responsibilities

### 5. Projects
- Project name
- Description
- Technologies used
- Project URL

### 6. Resume
- Upload resume
- View uploaded resume
- Download resume
- Resume score

### 7. Personal Details
- Full name
- Email
- Phone
- Date of birth
- Gender
- Address
- City, State, Pincode

## Color Scheme (Naukri Style)
- Primary Blue: #4A90E2
- Success Green: #28a745
- Warning Orange: #ff9800
- Background: #f2f4f7
- Card Background: #ffffff
- Text Primary: #1a1a1a
- Text Secondary: #666666
- Border: #e0e0e0

## Typography
- Headings: 20px-24px, Bold (600-700)
- Subheadings: 16px-18px, Medium (500)
- Body: 14px-15px, Regular (400)
- Small text: 12px-13px

## Components to Create

### 1. ProfileHeader.jsx
- Top profile section with photo and completion

### 2. ProfileCompletionWidget.jsx
- Circular progress
- Missing details list
- Quick actions

### 3. ProfileSidebar.jsx
- Sticky navigation menu
- Active section highlighting

### 4. ProfileSection.jsx
- Reusable section card
- View/Edit mode toggle
- Save/Cancel actions

### 5. SkillsSection.jsx
- Skill tags display
- Add/Remove skills

### 6. ResumeSection.jsx
- Upload interface
- Resume preview
- Download option

## File Structure
```
client/src/
├── pages/
│   └── Profile.jsx (Updated with Naukri layout)
├── components/
│   └── Profile/
│       ├── ProfileHeader.jsx
│       ├── ProfileCompletionWidget.jsx
│       ├── ProfileSidebar.jsx
│       ├── ProfileSection.jsx
│       ├── SkillsSection.jsx
│       └── ResumeSection.jsx
└── styles/
    └── NaukriProfile.css
```

## Implementation Steps

### Phase 1: Profile Header
1. Create circular profile photo with upload
2. Add profile completion ring
3. Display basic info (name, email, phone)
4. Add completion widget

### Phase 2: Navigation & Layout
1. Create tab navigation
2. Implement 2-column layout
3. Create sticky sidebar
4. Add section navigation

### Phase 3: Section Cards
1. Create reusable section component
2. Implement view/edit toggle
3. Add inline edit forms
4. Style with Naukri design

### Phase 4: Individual Sections
1. Career Preferences
2. Education
3. Skills
4. Employment
5. Projects
6. Resume
7. Personal Details

### Phase 5: Responsive Design
1. Mobile layout (stacked)
2. Tablet layout (adjusted)
3. Desktop layout (3-column)

## API Integration (No Changes)
- GET /api/auth/profile - Fetch profile
- POST /api/auth/profile - Update profile
- POST /api/auth/upload-photo - Upload photo
- GET /api/resume-upload/info - Get resume info
- POST /api/resume-upload - Upload resume

## Existing Form Fields (Keep All)
- firstName, lastName
- email, phone
- gender, dateOfBirth
- address, city, state, pincode
- bio, skills, experience, education
- linkedin, github, portfolio
- profilePhoto

## Next Steps
1. Read existing Profile.jsx to understand current structure
2. Create new Naukri-style components
3. Update Profile.jsx with new layout
4. Create NaukriProfile.css with Naukri styling
5. Test all existing functionality
6. Ensure responsive design

## Success Criteria
✅ Looks like Naukri.com profile page
✅ All existing fields are present
✅ All existing APIs work
✅ All existing validations work
✅ Responsive on all devices
✅ Professional and clean design
✅ Easy to navigate and edit
