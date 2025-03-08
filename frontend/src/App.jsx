/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/Admin/AdminDash';
import CandidateDashboard from './components/Candidate/CandidateDash';
import Exam from './components/Candidate/home/exam/Exam';
import LandingPage from './components/LandingPage';
import InstructionsPage from './components/Candidate/home/exam/InstructionsPage';
import { toast, ToastContainer } from 'react-toastify';
import RegistrationForm from './components/Admin/GlobalExams/RegistrationForm';
import ResultsForm from './components/Admin/GlobalExams/ResultsForm';
import EmailLogs from './components/Admin/GlobalExams/EmailLogs'
import GlobalExamAttempt from './components/Admin/GlobalExams/ExamAttempt/GlobalExamAttempt';
import GlobalExamDetailsPage from './components/Admin/GlobalExams/ExamAttempt/ExamInstructions';
import Cookies from 'js-cookie';  // Assuming you're using cookies for authentication and role verification.


// PrivateRoute to handle role-based route protection
function PrivateRoute({ element, role }) {
  const userRole = Cookies.get('role');
  const verified = Cookies.get('verified');
  if (verified === 'true' && userRole === role) {
    return element;
  }
  toast.warning('Please login to Continue.');
  return <Navigate to="/" />;
}


function App() {
  return (
    <>
      <ToastContainer />
      <div>
        <Routes>
          <Route path="/Exam" element={<GlobalExamDetailsPage />} />
          <Route path='/' element={<LandingPage defaultTab="home" />} />
          <Route path="/admin/*" element={<PrivateRoute role="SA" element={<AdminDashboard />} />} />
          <Route path="/candidate/*" element={<PrivateRoute role="intern" element={<CandidateDashboard />} />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/results" element={<ResultsForm />} />
          <Route path="/exam/:examID" element={<Exam />} />
          <Route path="/login/admin" element={<LandingPage defaultTab="AdminLogin" />} />
          <Route path="/login/candidate" element={<LandingPage defaultTab="CandidateLogin" />} />
          <Route path="/startExam/:examID" element={<InstructionsPage />} />
        </Routes>
      </div >
    </>
  )
}

export default App
