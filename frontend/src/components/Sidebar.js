import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

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

                <Link
                    to="/home"
                    className={`nav-link ${isActive('/home') ? 'active' : ''}`}
                >
                    <i className="fas fa-home me-2"></i>
                    Home
                </Link>

                {/* <Link
                    to="/about"
                    className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                >
                    <i className="fas fa-info-circle me-2"></i>
                    About Us
                </Link> */}

                {/* <Link
                    to="/services"
                    className={`nav-link ${isActive('/services') ? 'active' : ''}`}
                >
                    <i className="fas fa-cogs me-2"></i>
                    Services
                </Link> */}

                {/* <Link
                    to="/careers"
                    className={`nav-link ${isActive('/careers') ? 'active' : ''}`}
                >
                    <i className="fas fa-briefcase me-2"></i>
                    Career Application
                </Link> */}

                {/* <hr className="my-3" /> */}

                {/* <div className="text-muted small px-3 mb-2">ADMIN PANEL</div> */}

                {/* <Link
                    to="/admin/inquiries"
                    className={`nav-link ${isActive('/admin/inquiries') ? 'active' : ''}`}
                >
                    <i className="fas fa-list me-2"></i>
                    Manage Inquiries
                </Link> */}

                {/* <Link
                    to="/admin/applications"
                    className={`nav-link ${isActive('/admin/applications') ? 'active' : ''}`}
                >
                    <i className="fas fa-users me-2"></i>
                    Manage Applications
                </Link> */}
            </nav>
        </div>
    );
};

export default Sidebar;
