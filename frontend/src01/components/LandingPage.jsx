/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@mui/material';
import HomePage from './HomePage';
import ramana from '../assets/p3.png';
import AdminLogin from './AdminLogin';
import CandidateLogin from './CandidateLogin';
const LandingPage = ({ defaultTab }) => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  // const menuItems = [
  //   { id: 'About', name: 'About Us' },
  //   { id: 'Jobs', name: 'Careers' },
  //   { id: 'Contact', name: 'Contact Us' },
  //   { id: 'HrReg', name: 'Register as HR' },
  //   { id: 'InternReg', name: 'Register as Intern' },
  //   { id: 'HrReg', name: 'Register as Guest' },
  //   { id: 'HRLogin', name: 'Login as HR' },
  //   { id: 'SuperAdminLogin', name: 'Login as SA' },
  //   { id: 'InternLogin', name: 'Login as Intern' },
  //   { id: 'GuestLogin', name: 'Login as Guest' },
  //   { id: 'PrivacyPolicy', name: 'Privacy Ploicy' },
  //   { id: 'Security', name: 'Security' },
  //   { id: 'accessibility', name: 'accessibility' },
  //   { id: 'Cookies', name: 'cookies' },
  //   { id: 'PageNotFound', name: 'PageNotFound' },

  // ];

  const features = [
    { Title: "Easy Registration", content: "Register and manage users effortlessly with our streamlined process." },
    { Title: "Exam Scheduling", content: "Schedule exams with an intuitive calendar-based interface." },
    { Title: "Real-Time Results", content: " Get results instantly after the exam is completed." }
  ]

  useEffect(() => {
    if (defaultTab) {
      setSelectedView(defaultTab);
    }
  }, [defaultTab]);

  const [formData, setFormData] = useState({ email: '', password: '', mobileNo: '', otp: ['', '', '', '', '', ''] });
  const [errors, setErrors] = useState({ email: '', password: '', mobileNo: "" });



  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderContent = () => {
    switch (selectedView) {
      case 'AdminLogin':
        return <AdminLogin />
      case 'CandidateLogin':
        return <CandidateLogin />
      case 'home':
        return <HomePage />
      default:
        return <HomePage />;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setShowBackToTop(true);
    } else {
      setShowBackToTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLoginMenuItemClick = (loginType) => {
    // setSelectedView(`${loginType}Login`);
    navigate(`/login/${loginType.toLowerCase()}`)
    handleClose();
  };

  return (
    <div className="container-fluid justify-content-center" style={{ height: "100vh", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center" }}>
      <nav className="navbar navbar-expand-md sticky-top" style={{ zIndex: 1, background: "white" }}>
        <div className="container-fluid">
          <div>
            <Link to="/" style={{textDecoration:"none", fontFamily:"Andale Mono, monospace", fontSize:"21px", fontWeight:"bolder"}}>
              {/* <img src={ramana} style={{ width: "160px", background:"black",  }} alt="Logo" /> */}
              RamanaSoft<span style={{marginLeft:"5px", fontFamily:"Andale Mono, monospace"}}>Exams</span>
            </Link>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            style={{ marginLeft: '20px', background: "rgb(255, 255, 255)", color: "#2563eb", border: "1px solid #2563eb" }}
          >
            Login
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleLoginMenuItemClick('Admin')} style={{ color: "#2563eb", fontFamily:"Andale Mono, monospace"}}>
              Admin
            </MenuItem>
            <MenuItem onClick={() => handleLoginMenuItemClick('candidate')} style={{ color: "#2563eb", fontFamily:"Andale Mono, monospace"}}>
              Candidate
            </MenuItem>
          </Menu>
        </div>
      </nav>
      <div className="content">
        {renderContent()}
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <div className="back-to-top" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '999' }} onClick={scrollToTop}>
          <button className="p-2 rounded btn btn-outline-dark" title="back to top">
            <i className="fas fa-arrow-up fs-5"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

