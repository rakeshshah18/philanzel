import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
    const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
    const [isSectionsDropdownOpen, setIsSectionsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load dark mode preference from localStorage on component mount
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(savedDarkMode);
        applyDarkMode(savedDarkMode);
    }, []);

    // Apply dark mode classes to body
    const applyDarkMode = (darkMode) => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.body.setAttribute('data-bs-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.setAttribute('data-bs-theme', 'light');
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        applyDarkMode(newDarkMode);
    };

    const isActive = (path) => location.pathname === path;

    // Check if any page route is active
    const isPagesActive = () => {
        return isActive('/home') || isActive('/about-us') || isActive('/career');
    };

    // Check if any service route is active
    const isServicesActive = () => {
        return isActive('/services-overview') || isActive('/service-1') || isActive('/service-2') || isActive('/service-3') ||
            isActive('/service-4') || isActive('/service-5') || isActive('/service-6') ||
            isActive('/service-7') || isActive('/service-8');
    };

    // Check if any section route is active
    const isSectionsActive = () => {
        return isActive('/sections') || isActive('/sections/reviews') || isActive('/sections/ads') || isActive('/sections/footer');
    };

    const togglePagesDropdown = () => {
        setIsPagesDropdownOpen(!isPagesDropdownOpen);
    };

    const toggleServicesDropdown = () => {
        setIsServicesDropdownOpen(!isServicesDropdownOpen);
    };

    const toggleSectionsDropdown = () => {
        setIsSectionsDropdownOpen(!isSectionsDropdownOpen);
    };

    return (
        <div className="app-sidebar">
            <div className="app-header">
                <h4 className="mb-0">
                    <i className="fas fa-chart-line me-2"></i>
                    Philanzel
                </h4>
            </div>

            <nav className="nav flex-column p-3">
                <Link
                    to="/dashboard"
                    className={`nav-link ${isActive('/') || isActive('/dashboard') ? 'active' : ''}`}
                >
                    <i className="fas fa-tachometer-alt me-2"></i>
                    Dashboard
                </Link>

                {/* Pages Dropdown */}
                <div className="nav-item">
                    <div
                        className={`nav-link ${isPagesActive() ? 'active' : ''}`}
                        onClick={togglePagesDropdown}
                        style={{
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        <i className="fas fa-file-alt me-2"></i>
                        Pages
                        <i className={`fas fa-chevron-${isPagesDropdownOpen ? 'down' : 'right'} float-end mt-1`}></i>
                    </div>

                    {isPagesDropdownOpen && (
                        <div className="dropdown-submenu" style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderLeft: '3px solid rgba(255, 255, 255, 0.1)',
                            marginLeft: '0.5rem',
                            marginRight: '0.5rem',
                            borderRadius: '4px',
                            paddingTop: '0.25rem',
                            paddingBottom: '0.25rem'
                        }}>
                            <Link
                                to="/home"
                                className={`nav-link ${isActive('/home') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/home') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-home me-2"></i>
                                Home
                            </Link>

                            <Link
                                to="/about-us"
                                className={`nav-link ${isActive('/about-us') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/about-us') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-info-circle me-2"></i>
                                About Us
                            </Link>

                            <Link
                                to="/career"
                                className={`nav-link ${isActive('/career') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/career') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-briefcase me-2"></i>
                                Career
                            </Link>
                        </div>
                    )}
                </div>

                {/* Services Dropdown */}
                <div className="nav-item">
                    <div
                        className={`nav-link ${isServicesActive() ? 'active' : ''}`}
                        onClick={toggleServicesDropdown}
                        style={{
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        <i className="fas fa-cogs me-2"></i>
                        Services
                        <i className={`fas fa-chevron-${isServicesDropdownOpen ? 'down' : 'right'} float-end mt-1`}></i>
                    </div>

                    {isServicesDropdownOpen && (
                        <div className="dropdown-submenu" style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderLeft: '3px solid rgba(255, 255, 255, 0.1)',
                            marginLeft: '0.5rem',
                            marginRight: '0.5rem',
                            borderRadius: '4px',
                            paddingTop: '0.25rem',
                            paddingBottom: '0.25rem'
                        }}>
                            <Link
                                to="/services-overview"
                                className={`nav-link ${isActive('/services-overview') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/services-overview') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-eye me-2"></i>
                                Overview
                            </Link>

                            <Link
                                to="/service-1"
                                className={`nav-link ${isActive('/service-1') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/service-1') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-wrench me-2"></i>
                                Service 1
                            </Link>

                            <Link
                                to="/service-2"
                                className={`nav-link ${isActive('/service-2') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/service-2') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-tools me-2"></i>
                                Service 2
                            </Link>

                            <Link
                                to="/service-3"
                                className={`nav-link ${isActive('/service-3') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/service-3') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-laptop-code me-2"></i>
                                Service 3
                            </Link>

                            <Link
                                to="/service-4"
                                className={`nav-link ${isActive('/service-4') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/service-4') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-mobile-alt me-2"></i>
                                Service 4
                            </Link>

                            <Link
                                to="/service-5"
                                className={`nav-link ${isActive('/service-5') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/service-5') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-database me-2"></i>
                                Service 5
                            </Link>

                            <Link
                                to="/service-6"
                                className={`nav-link ${isActive('/service-6') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/service-6') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-cloud me-2"></i>
                                Service 6
                            </Link>

                            <Link
                                to="/service-7"
                                className={`nav-link ${isActive('/service-7') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/service-7') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-shield-alt me-2"></i>
                                Service 7
                            </Link>

                            <Link
                                to="/service-8"
                                className={`nav-link ${isActive('/service-8') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/service-8') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-chart-line me-2"></i>
                                Service 8
                            </Link>
                        </div>
                    )}
                </div>

                {/* Sections Dropdown */}
                <div className="nav-item">
                    <div
                        className={`nav-link ${isSectionsActive() ? 'active' : ''}`}
                        onClick={toggleSectionsDropdown}
                        style={{
                            cursor: 'pointer',
                            userSelect: 'none'
                        }}
                    >
                        <i className="fas fa-puzzle-piece me-2"></i>
                        Sections
                        <i className={`fas fa-chevron-${isSectionsDropdownOpen ? 'down' : 'right'} float-end mt-1`}></i>
                    </div>

                    {isSectionsDropdownOpen && (
                        <div className="dropdown-submenu" style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            borderLeft: '3px solid rgba(255, 255, 255, 0.1)',
                            marginLeft: '0.5rem',
                            marginRight: '0.5rem',
                            borderRadius: '4px',
                            paddingTop: '0.25rem',
                            paddingBottom: '0.25rem'
                        }}>
                            <Link
                                to="/sections/reviews"
                                className={`nav-link ${isActive('/sections/reviews') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/sections/reviews') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-star me-2"></i>
                                Reviews
                            </Link>

                            <Link
                                to="/sections/ads"
                                className={`nav-link ${isActive('/sections/ads') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/sections/ads') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-bullhorn me-2"></i>
                                Ads
                            </Link>

                            <Link
                                to="/sections/footer"
                                className={`nav-link ${isActive('/sections/footer') ? 'active' : ''}`}
                                style={{
                                    paddingLeft: '3rem',
                                    paddingRight: '1rem',
                                    fontSize: '0.9rem',
                                    color: isActive('/sections/footer') ? '#fff' : '#adb5bd',
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                <i className="fas fa-window-minimize me-2"></i>
                                Footer
                            </Link>
                        </div>
                    )}
                </div>

                {/* Dark Mode Toggle Button */}
                <div className="mt-auto pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <button
                        className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
                        onClick={toggleDarkMode}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            color: '#adb5bd',
                            fontSize: '0.9rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                            e.target.style.color = '#fff';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#adb5bd';
                        }}
                    >
                        <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} me-2`}></i>
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>

            </nav>
        </div>
    );
};

export default Sidebar;
