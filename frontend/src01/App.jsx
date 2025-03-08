/* eslint-disable no-unused-vars */

import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/Admin/AdminDash';
import CandidateDashboard from './components/Candidate/CandidateDash';
import Exam from './components/Candidate/home/exam/Exam';
import LandingPage from './components/LandingPage';
import InstructionsPage from './components/Candidate/home/exam/InstructionsPage';
import {toast, ToastContainer} from 'react-toastify';
import RegistrationForm from './components/Admin/exams/RegistrationForm';
import EmailLogs from './components/Admin/GlobalExams/EmailLogs'
import GlobalExamAttempt from './components/Admin/GlobalExams/ExamAttempt/GlobalExamAttempt';
import GlobalExamDetailsPage from './components/Admin/GlobalExams/ExamAttempt/ExamInstructions';
function App() {
  return (
    <>
    <ToastContainer />
      <div>
        <Routes>
        <Route path="/Exam" element={<GlobalExamDetailsPage />} />
        <Route path='/email' element={<EmailLogs />} />
          <Route path='/' element = { <LandingPage defaultTab="home"/> } />
          <Route path='/admin/*' element={<AdminDashboard />} />
          <Route path='/candidate/*' element={<CandidateDashboard />} />
          <Route path="/register" element={<RegistrationForm />} />
          {/* <Route path="/exam/:examID" element={<Exam />} /> */}
          <Route path="/login/admin" element={<LandingPage defaultTab="AdminLogin" />} />
          <Route path="/login/candidate" element={<LandingPage defaultTab="CandidateLogin" />} />
          <Route path="/startExam/:examID" element={<InstructionsPage />} />
        </Routes>
      </div >
    </>
  )
}

export default App
