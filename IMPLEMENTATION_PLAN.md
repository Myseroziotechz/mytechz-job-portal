# Implementation Plan - UI/UX Updates

## Changes Required:

### 1. Navbar Background - Change to White
- **File**: `client/src/components/Navbar.css`
- **Change**: Update `nav` background from gradient to white
- **Status**: Ready to implement

### 2. Navbar Sticky on Scroll
- **File**: `client/src/components/Navbar.css`
- **Change**: Already has `position: sticky; top: 0;` - verify it works
- **Status**: Already implemented

### 3. Jobs Dropdown (Government/Private)
- **Files**: 
  - `client/src/components/Navbar.jsx`
  - `client/src/components/Navbar.css`
- **Change**: Add dropdown menu for Jobs nav item with Government Jobs and Private Jobs options
- **Status**: Needs implementation

### 4. Add "Govt Jobs" to Explore Job Sectors
- **File**: `client/src/pages/Home.jsx`
- **Change**: Add new list item for Government Jobs in categories section
- **Status**: Ready to implement

### 5. Update Footer Phone Number
- **File**: Need to find Footer component
- **Change**: Change phone to 8618659319
- **Status**: Need to locate footer file

### 6. Fix "Sort by" to Single Line
- **File**: Need to find Jobs page with sort functionality
- **Change**: CSS adjustment to keep sort dropdown on single line
- **Status**: Need to locate file

### 7. Add WhatsApp Floating Button
- **Files**: 
  - Create new component or add to App.jsx
  - Add CSS for floating button
- **Change**: Add floating WhatsApp button at bottom right
- **Status**: Ready to implement

### 8. Standardize Filters Across Sections
- **Files**: Multiple job listing pages
- **Change**: Ensure all pages use same filter component/styling
- **Status**: Need to audit all pages

### 9. Standardize Search Bar Across Pages
- **Files**: Multiple pages
- **Change**: Ensure consistent search bar design
- **Status**: Need to audit all pages

## Priority Order:
1. Navbar background (white)
2. Jobs dropdown menu
3. Add Govt Jobs to sectors
4. WhatsApp floating button
5. Update footer phone
6. Fix Sort by layout
7. Standardize filters
8. Standardize search bars
