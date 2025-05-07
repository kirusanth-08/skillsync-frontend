import React from 'react';
import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom';

import Login from './Pages/Login';
import Home from './Pages/home';
import CourseManagementDashboard from './Pages/CourseManagementDashboard';
import CoursesDashboard from './Pages/dashboard';
import Navbar from './components/layout/Navbar';
import Password from './Pages/password';
import ExamDashboard from './Pages/ExamDashboard';
import ExamFormPage from './Pages/UploadGoogleForm';
import ExamProfilesList from './Pages/ExamProfilesList';
import ProfilePage from './Pages/ProfilePage';
import Reports from './Pages/Reports';
import DashboardHomePage from './Pages/DashboardHome';
import AnalyticsPage from './Pages/AnalyticsPage';
// TODO: Create and import the CreatePostPage component
import CreatePostPage from './Pages/CreatePostPage'; // You'll need to create this file



const App = () => {
  const location = useLocation();
  const shouldShowNavbar = location.pathname !== '/login';


  return (
      <>
      {shouldShowNavbar && <Navbar />}
        <Routes>
          <Route path="/login" element={< Login />} />
          <Route path="/" element={< Home />} />
          
          <Route path="/course" element={< CourseManagementDashboard />} />
          <Route path="/dash" element={< DashboardHomePage />} />
          <Route path="/password" element={< Password />} />
          <Route path="/exam" element={< ExamDashboard />} />
          <Route path="/form/:id" element={< ExamFormPage />} />
          <Route path="/profile" element={< ProfilePage />} />
          <Route path="/profile/exam" element={<ExamProfilesList />} />
          <Route path="/Reports" element={<Reports />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/dashboard" element={< CoursesDashboard/>} />
          <Route path="/create-post" element={<CreatePostPage />} />
        </Routes>
      </>
  );
};

export default App;
