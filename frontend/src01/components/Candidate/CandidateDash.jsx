/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import '../Admin/AdminDash.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faTimes, faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import Dashboard from './home/dashboard/Dashboard';
import p3 from '../../assets/p3.png'
import ExamHistory from './home/examHistory/ExamHistory';
import Profile from './home/profile/Profile';
import Help from './Help';

// import Notifications from './Notifications';
// import Dashboard from './Dashboard';
// import Exams from './exams/Exams';
// import Candidate from './Candidate';
// // import Settings from './settings/Settings';
// import Domain from './settings/Domain';
// import Sections from './settings/Sections';
// import Questions from './question/Questions';

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedView, setSelectedView] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState({});


    const menuItems = [
        { id: 'dashboard', name: 'Dashboard ', icon: 'fas fa-home' },
        { id: 'exams', name: 'Exams', icon: 'fas fa-clock' },
        { id: 'profile', name: 'Profile', icon: 'fas fa-user' },
        { id: 'help', name: 'Help & Support', icon: 'fas fa-comment-alt' },
    ];


    const handleMenuItemClick = (id) => {
        setSelectedView(id);
        navigate(`/candidate/${id}`);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    const toggleSubmenu = (id) => {
        setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
    };


    const renderMenuItem = (item) => (
        <li key={item.id}>
            <div
                className={`menu-item ${selectedView === item.id ? 'active' : ''}`}
                onClick={() => item.submenu ? toggleSubmenu(item.id) : handleMenuItemClick(item.id)}
            >
                <i className={item.icon}></i>
                {isSidebarOpen && <span>{item.name}</span>}
                {item.submenu && isSidebarOpen && (
                    <i className={`submenu-toggle fas ${expandedMenus[item.id] ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                )}
            </div>
            {item.submenu && expandedMenus[item.id] && (
                <ul className="submenu">
                    {item.submenu.map(subItem => (
                        <li
                            key={subItem.id}
                            className={`submenu-item ${selectedView === subItem.id ? 'active' : ''}`}
                            onClick={() => handleMenuItemClick(subItem.id)}
                        >
                            <i className={subItem.icon}></i>
                            {isSidebarOpen && subItem.name}
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );

    const renderContent = () => {

        switch (selectedView) {
            case 'exams':
                return <ExamHistory />
            case 'profile':
                return <Profile />
            case 'help':
                return <Help />
            case 'dashboard': 
                default:
                    return <Dashboard />;
        }
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "#060a06", height: "7.5vh", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <img style={{height:"30px", width:"160px", paddingLeft:"5vh", cursor:"pointer"}} src={p3} alt='text' />
                <div className="container-lg" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    {/* <button
                        style={{ color: "black", width:"27px", height:"27px", background: "#f2eded", border: "none", borderRadius:"200%", cursor: "pointer", outline: "none", marginRight: "15px"}}
                        onClick={() => handleMenuItemClick("notifications")}
                    >
                        <FontAwesomeIcon
                            icon={faBell}
                            onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                            style={{
                                width: "16px",
                                height: "16px",
                            }}
                        />
                    </button>


                    <button
                        style={{ color: "black", width:"27px", height:"27px", background: "#f2eded", border: "none", borderRadius:"200%", cursor: "pointer", outline: "none", transition: "transform 0.3s ease, color 0.3s ease"}}
                        onClick={() => handleMenuItemClick("profile")}
                    >
                        <FontAwesomeIcon
                            icon={faUser}
                            onMouseOver={(e) => (e.target.style.transform = "scale(1.04)")}
                            onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                            style={{
                                width: "16px",
                                height: "16px",
                            }}
                        />
                    </button> */}
                </div>
            </div>


            <div className="dashboard" style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <nav
                    className={`SA_side-nav ${isSidebarOpen ? "open" : "closed"}`}
                    style={{
                        flexShrink: 0,
                        color:"white",
                        transition: "width 0.3s",
                        width: isSidebarOpen ? "250px" : "60px",
                        overflowY: "auto",
                    }}
                >
                    <button className="SA-toggle-button" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} />
                    </button>
                    <div className="icons-container fw-bolder">
                        <ul>{menuItems.filter((i) => i.id !== "notifications").map(renderMenuItem)}</ul>
                    </div>
                </nav>

                <div
                    className={`main-content ${isSidebarOpen ? "expanded" : "collapsed"}`}
                    style={{ flex: 1, overflowY: "auto", padding: "1rem" }}
                >
                    {renderContent()}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
