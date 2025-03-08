/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, useParams } from 'react-router-dom';
import './AdminDash.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faBars, faTimes, faUsers, faShoppingCart, faWrench, faUser, faBell, faHandPointLeft, faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import p3 from '../../assets/p3.png'
import Notifications from './Notifications';
// import Dashboard from './Dashboard';
import Exams from './exams/Exams';
import Candidate from './Candidates/Candidate.jsx';
// import Settings from './settings/Settings';
// import Domain from './Domain';
import Domains from './exams/Domains.jsx'
import Sections from './QuestionBanks/Sections.jsx';
// import Questions from './QuestionBanks/Questions.jsx';
// import Statistics from './Statistics';
import Profile from './Profile';
import DashboardData from './DashboardData.jsx';
import GlobalExams from './GlobalExams/GlobalExams.jsx'

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedView, setSelectedView] = useState('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [expandedMenus, setExpandedMenus] = useState({});
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const menuItems = [
        { id: 'dashboard', name: 'Dashboard ', icon: 'fa fa-home' },
        { id: 'candidates', name: 'Candidates', icon: 'fas fa-user-tie' },
        { id: 'exams', name: 'Exams', icon: 'fas fa-clock' },
        { id: 'globalExams', name: 'Global Tests', icon: 'fas fa-clock' },
        // { id: 'questions', name: 'Questions', icon: 'fas fa-file-alt' },
        // { id: 'domains', name: 'Domains', icon: 'fas fa-book' },
        { id: 'sections', name: 'Question Banks', icon: 'fas fa-folder-open' },
        // { id: 'reports', name: 'Stats & Reports', icon: 'fas fa-poll' },
        { id: 'notifications', name: 'Notifications', icon: 'fas fa-book' },
        { id: 'profile', name: 'Profile', icon: 'fas fa-book' },
    ];


    const handleMenuItemClick = (id) => {
        setSelectedView(id);
        setDropdownVisible(false);
        navigate(`/admin/${id}`);

    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    const toggleSubmenu = (id) => {
        setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
    };


    const renderMenuItem = (item) => (
        <li key={item.id} className="menu-item-container">
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

            // case 'questions':
            //     return <Questions />

            // case 'domains':
            //     return <Domain />

            // case 'reports':
            //     return <Statistics />
            case 'exams':
                return <Domains />

            case 'candidates':
                return < Candidate selectedView={setSelectedView} />
            case 'globalExams':
                return <GlobalExams />
            case 'notifications':
                return <Notifications />

            case 'profile':
                return <Profile />

            case 'sections':
                return <Sections />
            case 'dashboard':
            default:
                return <DashboardData />
        }
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ background: "#060a06", height: "7.5vh", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <img style={{ height: "30px", width: "160px", paddingLeft: "5vh", cursor: "pointer" }} src={p3} alt='text' />
                <div className="container-lg" style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                    <button
                        style={{ color: "black", width: "27px", height: "27px", background: "#f2eded", border: "none", borderRadius: "200%", cursor: "pointer", outline: "none", marginRight: "15px" }}
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


                    <div
                        style={{
                            position: "relative",
                            display: "inline-block",
                        }}
                    >
                        <button
                            style={{
                                color: "black",
                                width: "27px",
                                height: "27px",
                                background: "#f2eded",
                                border: "none",
                                borderRadius: "200%",
                                cursor: "pointer",
                                outline: "none",
                                transition:
                                    "transform 0.3s ease, color 0.3s ease",
                            }}
                            onClick={() =>
                                setDropdownVisible((prev) => !prev)
                            }
                        >
                            <FontAwesomeIcon
                                icon={faUser}
                                style={{
                                    width: "16px",
                                    height: "16px",
                                }}
                            />
                        </button>
                        {dropdownVisible && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: "0",
                                    backgroundColor: "white",
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                                    borderRadius: "5px",
                                    zIndex: "1",
                                    width: "200px",
                                    padding: "10px",
                                }}
                            >
                                <p
                                    style={{
                                        margin: "0",
                                        fontWeight: "bold",
                                        fontSize: "14px",
                                    }}
                                >
                                    RamanaSoft
                                </p>
                                <p
                                    style={{
                                        margin: "0",
                                        fontSize: "12px",
                                        color: "gray",
                                    }}
                                >
                                    Account ID: 000001
                                </p>
                                <hr style={{ margin: "10px 0" }} />
                                <ul
                                    style={{
                                        listStyle: "none",
                                        padding: "0",
                                        margin: "0",
                                    }}
                                >
                                    <li
                                        style={{
                                            padding: "5px 0",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                        }}
                                        onClick={() =>
                                            handleMenuItemClick("my-account")
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faWrench}
                                            style={{
                                                marginRight: "10px",
                                            }}
                                        />
                                        My Account
                                    </li>
                                    <li
                                        style={{
                                            padding: "5px 0",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                        }}
                                        onClick={() =>
                                            handleMenuItemClick("profile")
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faUser}
                                            style={{
                                                marginRight: "10px",
                                            }}
                                        />
                                        My Profile
                                    </li>
                                </ul>
                                <hr style={{ margin: "10px 0" }} />
                                <button
                                    style={{
                                        width: "100%",
                                        padding: "8px",
                                        background: "black",
                                        color: "white",
                                        border: "none",
                                        fontSize: "13px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() =>
                                        handleMenuItemClick("sign-out")
                                    }
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="dashboard" style={{ flex: 1, display: "flex", overflow: "hidden" }}>
                <nav
                    className={`SA_side-nav ${isSidebarOpen ? "open" : "closed"}`}
                    style={{
                        flexShrink: 0,
                        color: "white",
                        transition: "width 0.3s",
                        width: isSidebarOpen ? "250px" : "60px",
                        overflowY: "auto",
                    }}
                >
                    <button className="SA-toggle-button" onClick={toggleSidebar}>
                        <FontAwesomeIcon icon={isSidebarOpen ? faHandPointLeft : faHandPointRight} />
                    </button>
                    <div className="icons-container fw-bolder">
                        <ul>{menuItems.filter((i) => i.id !== "notifications" && i.id !== "profile").map(renderMenuItem)}</ul>
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

export default AdminDashboard;
