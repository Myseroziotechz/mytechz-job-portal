import { useState,useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NaukriJobs from './pages/NaukriJobs';
import GovExams from './pages/GovExams';

import AdmitCard from './pages/AdmitCard';
import Results from './pages/Results';
import Documents from './pages/Documents';
import Admissions from './pages/Admissions';
import Webinars from './pages/Webinars';  
import AdmissionCards from './pages/AdmissionCards';
import TestShare from './pages/TestShare';
import Mentorship from './pages/Mentorship';
import Portfolio from './pages/Portfolio';
import Login from './pages/Login';
import Register from './pages/Register';  
import RecruiterRegister from './pages/RecruiterRegister';
import TestPage from './pages/TestPage';
import ForgotPassword from './pages/ForgotPassword';
import MyApplications from './pages/MyApplications';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateSearch from './pages/CandidateSearch';
import SavedProfiles from './pages/SavedProfiles';
import PostedJobs from './pages/PostedJobs';
import RecruiterSubscription from './pages/RecruiterSubscription';
import RecruiterMessages from './pages/RecruiterMessages';
import CompanyProfile from './pages/CompanyProfile';
import PostJob from './pages/PostJob';
import JobApply from './pages/JobApply';
import NaukriJobDetail from './pages/NaukriJobDetail';
import RecruiterLayout from './components/Recruiter/RecruiterLayout';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationSystem from './components/Notification/NotificationSystem';
import LoadingPage from './components/LoadingPage/LoadingPage';
import PopupNotification from './components/PopupNotification/PopupNotification';
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', type: 'success', isVisible: false });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.showPopup = (message, type = 'success') => {
      setNotification({ message, type, isVisible: true });
    };
  }, []);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <Router >
      <Navbar /> {/* Navbar component for navigation */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<NaukriJobs />} />
        <Route path="/jobs/:jobId" element={<NaukriJobDetail />} />
        <Route path="/jobs/:jobId/apply" element={<JobApply />} />
        <Route path="/gov-exams" element={<GovExams />} />
        <Route path="/gov-exams/:id" element={<GovExams />} />

        <Route path="/admit-card" element={<AdmitCard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/admissions" element={<Admissions />} />
        <Route path="/webinars" element={<Webinars />} />
        <Route path="/webinars/:id" element={<Webinars />} />
        <Route path="/admission-cards" element={<AdmissionCards />} />
        <Route path="/admission-cards/:shareId" element={<AdmissionCards />} />
        <Route path="/test-share" element={<TestShare />} />
        <Route path="/test-share/:shareId" element={<TestShare />} />
        <Route path="/mentorship" element={<Mentorship />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recruiter/register" element={<RecruiterRegister />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/applications" element={
          <ProtectedRoute requiredRole="user">
            <MyApplications />
          </ProtectedRoute>
        } />
        <Route path="/my-applications" element={
          <ProtectedRoute requiredRole="candidate">
            <MyApplications />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/user" element={
          <ProtectedRoute requiredRole="user">
            <UserDashboard />
          </ProtectedRoute>
        } />
        <Route path="/recruiter" element={
          <ProtectedRoute requiredRole="recruiter">
            <RecruiterLayout />
          </ProtectedRoute>
        }>
          <Route index element={<RecruiterDashboard />} />
          <Route path="search-candidates" element={<CandidateSearch />} />
          <Route path="resume-database" element={<CandidateSearch />} />
          <Route path="saved-profiles" element={<SavedProfiles />} />
          <Route path="posted-jobs" element={<PostedJobs />} />
          <Route path="post-job" element={<PostJob />} />
          <Route path="company-profile" element={<CompanyProfile />} />
          <Route path="subscription" element={<RecruiterSubscription />} />
          <Route path="messages" element={<RecruiterMessages />} />
        </Route>
        <Route path="/settings" element={<div>Settings Page</div>} />
      </Routes>
      <Footer /> {/* Footer component for additional information */}
      <NotificationSystem />
      <PopupNotification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </Router>
  )
}

export default App