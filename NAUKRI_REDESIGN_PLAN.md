# 🎨 Naukri-Inspired UI Redesign Plan

**Date:** January 22, 2026  
**Scope:** Candidate/Job Seeker Frontend Only  
**Design Reference:** Naukri.com

---

## 🎯 Design Goals

1. **Job Discovery Focused** - Make finding jobs the primary action
2. **Search-Driven** - Prominent search bar everywhere
3. **Filter-Heavy** - Comprehensive left sidebar filters
4. **Career Oriented** - Professional, trustworthy design
5. **Fast Scanning** - Card-based layout for quick browsing
6. **Trust & Credibility** - Clean, corporate aesthetic

---

## 🎨 Visual Style Guide

### Colors
- **Primary Blue:** #4A90E2 (Naukri-style blue)
- **Dark Blue:** #2E5C8A
- **Light Blue:** #E8F4FD
- **White:** #FFFFFF
- **Light Grey:** #F2F2F2
- **Border Grey:** #E0E0E0
- **Text Dark:** #333333
- **Text Grey:** #666666
- **Success Green:** #4CAF50
- **Warning Orange:** #FF9800

### Typography
- **Font Family:** 'Inter', 'Roboto', 'Open Sans', sans-serif
- **Headings:** 600-700 weight
- **Body:** 400 weight
- **Small Text:** 14px
- **Body Text:** 16px
- **Headings:** 18-24px

### Layout
- **Max Width:** 1200px
- **Sidebar Width:** 280px
- **Card Spacing:** 16px
- **Border Radius:** 4px (subtle)
- **Box Shadow:** 0 1px 3px rgba(0,0,0,0.1)

---

## 📄 Pages to Redesign

### 1. Home Page (Landing)
**Components:**
- Hero search bar (keyword + location)
- Popular searches chips
- Featured jobs carousel
- Job categories grid
- Career tips section
- Stats/trust indicators

### 2. Jobs Search Page
**Layout:**
- Top: Search bar + filters toggle
- Left: Filter sidebar (sticky)
- Center: Job cards feed
- Right: Quick apply widget (optional)

**Filters:**
- Location (multi-select)
- Experience (range)
- Salary (range)
- Job Type (checkboxes)
- Work Mode (checkboxes)
- Industry (dropdown)
- Company (search)
- Posted Date (radio)

**Job Card:**
- Company logo
- Job title (bold, blue link)
- Company name
- Experience required
- Salary range
- Location
- Skills tags
- Posted date
- Save icon
- Apply button

### 3. Job Detail Page
**Sections:**
- Job header (title, company, location)
- Quick apply section (sticky)
- Job description
- Key skills
- Company info
- Similar jobs

### 4. Profile Page
**Sections:**
- Profile completion meter
- Resume headline
- Key skills
- Employment history
- Education
- Resume upload/download
- Profile visibility toggle

### 5. Dashboard
**Sections:**
- Applied jobs (with status)
- Saved jobs
- Job alerts
- Recommended jobs
- Profile views
- Application status tracker

---

## 🔧 Components to Create

### New Components
1. `NaukriSearchBar.jsx` - Main search component
2. `JobFilterSidebar.jsx` - Left filter panel
3. `NaukriJobCard.jsx` - Job listing card
4. `ProfileStrengthMeter.jsx` - Profile completion
5. `QuickApplyWidget.jsx` - Sticky apply section
6. `JobAlertCard.jsx` - Job alert management
7. `RecommendedJobs.jsx` - AI recommendations
8. `PopularSearches.jsx` - Trending searches
9. `TrustIndicators.jsx` - Stats/badges

### Updated Components
1. `Home.jsx` - Naukri-style landing
2. `Jobs.jsx` - Search results page
3. `JobDetails.jsx` - Job detail view
4. `Profile.jsx` - Professional profile
5. `UserDashboard.jsx` - Application tracker

---

## 🎨 CSS Files to Create

1. `NaukriCommon.css` - Shared Naukri styles
2. `NaukriSearchBar.css`
3. `JobFilterSidebar.css`
4. `NaukriJobCard.css`
5. `NaukriProfile.css`
6. `NaukriDashboard.css`

---

## 📱 Responsive Breakpoints

- **Desktop:** > 1024px (full layout)
- **Tablet:** 768px - 1024px (collapsible sidebar)
- **Mobile:** < 768px (bottom filters, stacked cards)

---

## ✅ Implementation Checklist

### Phase 1: Core Components
- [ ] Create NaukriSearchBar component
- [ ] Create JobFilterSidebar component
- [ ] Create NaukriJobCard component
- [ ] Create common CSS file

### Phase 2: Pages
- [ ] Redesign Home page
- [ ] Redesign Jobs search page
- [ ] Redesign Job detail page
- [ ] Redesign Profile page
- [ ] Redesign Dashboard page

### Phase 3: Features
- [ ] Add save job functionality
- [ ] Add job alerts
- [ ] Add profile strength meter
- [ ] Add recommended jobs
- [ ] Add infinite scroll

### Phase 4: Polish
- [ ] Mobile responsive
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Animations

---

## 🚫 What NOT to Change

- Backend APIs
- Database schema
- Recruiter frontend
- Admin frontend
- Business logic
- Authentication flow
- API endpoints
- Data models

---

## 📊 Success Metrics

- Faster job discovery
- Better filter usage
- Higher application rate
- Improved user engagement
- Professional appearance
- Mobile usability

---

**Status:** Ready to implement  
**Estimated Time:** 4-6 hours  
**Priority:** High
