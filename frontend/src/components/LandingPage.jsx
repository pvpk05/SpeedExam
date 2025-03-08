/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Menu, MenuItem } from '@mui/material';
import HomePage from './HomePage';
import ramana from '../assets/p3.png';
import AdminLogin from './AdminLogin';
import CandidateLogin from './CandidateLogin';
import Footer from './Footer';

const LandingPage = ({ defaultTab }) => {
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);


  useEffect(() => {
    if (defaultTab) {
      setSelectedView(defaultTab);
    }
  }, [defaultTab]);


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
    <div className="container-fluid justify-content-center" style={{ height: "auto", background: "black", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center" }}>
      <nav className="navbar navbar-expand-md sticky-top" style={{ zIndex: 1, background: "black" }}>
        <div className="container-fluid">
          <div>
            <Link to="/" style={{ textDecoration: "none", fontFamily: "Andale Mono, monospace", fontSize: "21px", fontWeight: "bolder" }}>
              <img src={ramana} style={{ width: "140px", marginTop: "10px", background: "black", }} alt="Logo" />
            </Link>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleLoginMenuItemClick('candidate')}
            style={{ marginLeft: '20px', background: "black", color: "white", border: "1px solid white" }}
          >
            Login
          </Button>
        </div>
      </nav>
      <div className="content">
        {renderContent()}
      </div>
      <Footer />

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

