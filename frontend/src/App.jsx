import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AppNavbar from './components/standard/NavbarOut';
import Footer from './components/standard/Footer';
import Home from './components/standard/Home';
import About from './components/standard/About';
import Contact from './components/standard/Contact';
import StudentLogin from './components/Exam/StudentLogin';
import NotFound from './components/standard/NotFound';
import OrganizationLogin from './components/Organization/OrganizationLogin';
import { AdminLogin } from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';
import OrganizationDashboard from './components/Organization/OrganizationDashboard';
import TestWindow from './components/Exam/TestWindow';
import GuidelinesPage from './components/Exam/GuidelinesPage';
import ExamPage from './components/Exam/ExamPage';
import ExamScreen from './components/Exam/ExamScreen';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <AppNavbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/student" element={<StudentLogin />} />
          <Route path="/organization" element={<OrganizationLogin />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/exam-window" element={<ExamScreen />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/org-dashboard" element={<OrganizationDashboard />} />
          <Route path="/guidelines/:examId" element={<GuidelinesPage />} />
          {/* <Route path="/exam/:examId" element={<TestWindow />} /> */}
          <Route path="/test/:examId" element={<ExamPage/>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
