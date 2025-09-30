import React, { useState, useEffect } from 'react';
import { servicesAPI, calculatorPagesAPI, adminAuthAPI, sidebarAPI } from '../services/api';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [services, setServices] = useState([]);
    const [calculatorPages, setCalculatorPages] = useState([]);
    const [allowedTabs, setAllowedTabs] = useState([
        "home", "about-us", "career", "partner", "contact",
        "services", "services-sections", "calculators", "sections",
        "reviews", "ads", "footer", "events"
    ]);
    const [sidebarItems, setSidebarItems] = useState([]);
    const [dropdownStates, setDropdownStates] = useState({});
    const auth = useAuth();
    const admin = auth && auth.admin ? auth.admin : null;
    useEffect(() => {
        const fetchAllowedTabs = async () => {
            if (admin && admin.role !== 'super_admin') {
                try {
                    const res = await adminAuthAPI.getAssignedTabs(admin._id);
                    if (res.data && Array.isArray(res.data.allowedTabs)) {
                        setAllowedTabs(res.data.allowedTabs.length > 0 ? res.data.allowedTabs : []);
                        return;
                    }
                } catch (err) {
                }
            }
            setAllowedTabs([
                "home", "about-us", "career", "partner", "contact",
                "services", "services-sections", "calculators", "sections",
                "reviews", "ads", "footer", "events"
            ]);
        };
        fetchAllowedTabs();
    }, [admin]);
    useEffect(() => {
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        setIsDarkMode(savedDarkMode);
        applyDarkMode(savedDarkMode);
        fetchServices();
        fetchCalculatorPages();
        fetchSidebarItems();
    }, []);
    const fetchServices = async () => {
        try {
            const response = await servicesAPI.getAll();
            setServices(response.data.data || []);
        } catch {
            setServices([]);
        }
    };
    const fetchCalculatorPages = async () => {
        try {
            const response = await calculatorPagesAPI.getAll();
            setCalculatorPages(response.data.data || []);
        } catch {
            setCalculatorPages([]);
        }
    };
    const fetchSidebarItems = async () => {
        try {
            const response = await sidebarAPI.getAll();
            const items = response.data.data || [];
            setSidebarItems(items);
            const initialDropdownStates = {};
            items.forEach(item => {
                if (item.type === 'dropdown') {
                    initialDropdownStates[item._id] = false;
                }
            });
            setDropdownStates(initialDropdownStates);
        } catch (error) {
            console.error('Failed to fetch sidebar items:', error);
            setSidebarItems([]);
        }
    };
    const applyDarkMode = (darkMode) => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
            document.body.setAttribute('data-bs-theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            document.body.setAttribute('data-bs-theme', 'light');
        }
    };
    const toggleDarkMode = () => {
        const newDarkMode = !isDarkMode;
        setIsDarkMode(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
        applyDarkMode(newDarkMode);
    };
    const isActive = (path) => location.pathname === path;
    const isDropdownActive = (sidebarItem) => {
        if (sidebarItem.type === 'single') {
            return isActive(sidebarItem.route);
        }
        if (sidebarItem.type === 'dropdown' && sidebarItem.dropdownItems) {
            const baseActive = sidebarItem.dropdownItems.some(dropdownItem => isActive(dropdownItem.route));
            if (sidebarItem.name.toLowerCase().includes('service')) {
                const servicesActive = services.some(service =>
                    isActive(`/services/${service.slug}`)
                );
                return baseActive || servicesActive;
            }
            if (sidebarItem.name.toLowerCase().includes('calculator')) {
                const calculatorsActive = calculatorPages.some(page =>
                    isActive(`/calculators/${page.name.replace(/\s+/g, '-').toLowerCase()}`)
                );
                return baseActive || calculatorsActive || isActive('/calculators');
            }
            return baseActive;
        }
        return false;
    };
    const toggleDropdown = (itemId) => {
        setDropdownStates(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };
    const getItemIcon = (itemName) => {
        const name = itemName.toLowerCase();
        if (name.includes('dashboard')) return 'fas fa-tachometer-alt';
        if (name.includes('page')) return 'fas fa-file-alt';
        if (name.includes('service')) return 'fas fa-cogs';
        if (name.includes('calculator')) return 'fas fa-calculator';
        if (name.includes('section')) return 'fas fa-puzzle-piece';
        if (name.includes('home')) return 'fas fa-home';
        if (name.includes('about')) return 'fas fa-info-circle';
        if (name.includes('career')) return 'fas fa-briefcase';
        if (name.includes('partner')) return 'fas fa-handshake';
        if (name.includes('contact')) return 'fas fa-envelope';
        if (name.includes('review')) return 'fas fa-star';
        if (name.includes('ads')) return 'fas fa-bullhorn';
        if (name.includes('footer')) return 'fas fa-window-minimize';
        return 'fas fa-circle';
    };
    return (
        <div
            className={`app-sidebar${isSidebarOpen ? '' : ' collapsed'}`}
            style={{ width: isSidebarOpen ? 260 : 60, transition: 'width 0.3s', overflow: 'hidden', overflowY: 'auto', height: '100vh', backgroundColor: '#1565c0' }}
        >
            <style>{`
                .app-sidebar::-webkit-scrollbar {
                    width: 8px;
                    background: rgba(255,255,255,0.2);
                }
                .app-sidebar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.3);
                    border-radius: 4px;
                }
                .sidebar-btn {
                    background-color: #184b86ff !important;
                    color: #fff !important;
                    border: 1px solid #184b86ff !important;
                    transition: all 0.2s;
                }
                .sidebar-btn:hover, .sidebar-btn:focus {
                    background-color: #fff !important;
                    color: #184b86ff !important;
                    border-color: transparent !important;
                }
                body.dark-mode .sidebar-btn:hover, body.dark-mode .sidebar-btn:focus,
                [data-bs-theme="dark"] .sidebar-btn:hover, [data-bs-theme="dark"] .sidebar-btn:focus {
                    background-color: #184b86ff !important;
                    color: #fff !important;
                    border-color: transparent !important;
                }
                body.dark-mode .sidebar-btn,
                [data-bs-theme="dark"] .sidebar-btn {
                    background-color: #1a2332 !important;
                    color: #fff !important;
                    border: 1px solid #184b86ff !important;
                }
                body.dark-mode .sidebar-btn:hover, body.dark-mode .sidebar-btn:focus,
                [data-bs-theme="dark"] .sidebar-btn:hover, [data-bs-theme="dark"] .sidebar-btn:focus {
                    background-color: #184b86ff !important;
                    color: #fff !important;
                }
            `}</style>
            <div className="app-header d-flex align-items-center justify-content-between px-2" style={{ minHeight: 56, backgroundColor: '#0054b4ff' }}>
                <h4 className="mb-0" style={{ fontSize: isSidebarOpen ? '1.25rem' : '1.5rem', transition: 'font-size 0.3s' }}>
                    <i className="fas fa-chart-line me-2"></i>
                    {isSidebarOpen && 'Philanzel'}
                </h4>
                <div className="d-flex align-items-center">
                    {isSidebarOpen && admin && admin.role === 'super_admin' && (
                        <Link
                            to="/sidebar-management"
                            className="btn btn-sm me-2"
                            style={{
                                minWidth: 34,
                                minHeight: 34,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                color: '#fff',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                transition: 'all 0.3s ease',
                                textDecoration: 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }}
                            title="Sidebar Management Settings"
                            onMouseEnter={e => {
                                e.target.style.backgroundColor = '#fff';
                                e.target.style.color = '#0054b4ff';
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
                            }}
                            onMouseLeave={e => {
                                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                                e.target.style.color = '#fff';
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
                            }}
                        >
                            <i className="bi bi-gear" style={{ fontSize: '14px' }}></i>
                        </Link>
                    )}
                    <button
                        className="btn btn-sm"
                        style={{
                            minWidth: 32,
                            minHeight: 32,
                            borderRadius: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#184b86ff',
                            color: '#fff',
                            border: '1px solid #184b86ff',
                            transition: 'all 0.2s'
                        }}
                        onClick={() => setIsSidebarOpen(v => !v)}
                        title={isSidebarOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
                        onMouseEnter={e => {
                            e.target.style.backgroundColor = '#fff';
                            e.target.style.color = '#184b86ff';
                            e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={e => {
                            e.target.style.backgroundColor = '#184b86ff';
                            e.target.style.color = '#fff';
                            e.target.style.transform = 'scale(1)';
                        }}
                    >
                        <i className={`bi ${isSidebarOpen ? 'bi-chevron-left' : 'bi-list'}`} style={{ fontSize: '16px' }}></i>
                    </button>
                </div>
            </div>
            <nav className="nav flex-column p-3" style={{ display: isSidebarOpen ? 'block' : 'none', transition: 'display 0.3s' }}>
                {sidebarItems.map((item) => {
                    if (!item.isActive) {
                        return null;
                    }
                    if (item.type === 'single') {
                        return (
                            <Link
                                key={item._id}
                                to={item.route}
                                className={`nav-link sidebar-btn ${isActive(item.route) || (item.route === '/dashboard' && (isActive('/') || isActive('/dashboard'))) ? 'active' : ''}`}
                                style={{ marginBottom: '0.5rem' }}
                            >
                                <i className={`${getItemIcon(item.name)} me-2`}></i>
                                {item.name}
                            </Link>
                        );
                    }
                    if (item.type === 'dropdown') {
                        const isDropdownOpen = dropdownStates[item._id] || false;
                        const isItemActive = isDropdownActive(item);
                        return (
                            <div key={item._id} className="nav-item">
                                <div
                                    className={`nav-link sidebar-btn ${isItemActive ? 'active' : ''}`}
                                    onClick={() => toggleDropdown(item._id)}
                                    style={{
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    <span>
                                        <i className={`${getItemIcon(item.name)} me-2`}></i>
                                        {item.name}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center' }}>
                                        {item.name.toLowerCase().includes('service') && (
                                            <i
                                                className="bi bi-arrow-clockwise"
                                                style={{ cursor: 'pointer', marginRight: '0.5rem' }}
                                                title="Refresh services"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    fetchServices();
                                                }}
                                            ></i>
                                        )}
                                        {item.name.toLowerCase().includes('calculator') && (
                                            <i
                                                className="bi bi-arrow-clockwise"
                                                style={{ cursor: 'pointer', marginRight: '0.5rem' }}
                                                title="Refresh calculators"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    fetchCalculatorPages();
                                                }}
                                            ></i>
                                        )}
                                        <i className={`fas fa-chevron-${isDropdownOpen ? 'down' : 'right'} float-end mt-1`}></i>
                                    </span>
                                </div>
                                {isDropdownOpen && (
                                    <div className="dropdown-submenu p-1" style={{
                                        backgroundColor: 'rgba(52, 80, 172, 0.96)',
                                        borderLeft: '3px solid rgba(255, 255, 255, 0.1)',
                                        marginLeft: '0.5rem',
                                        marginRight: '0.5rem',
                                        borderRadius: '4px',
                                        paddingTop: '0.25rem',
                                        paddingBottom: '0.25rem'
                                    }}>
                                        {item.dropdownItems && item.dropdownItems.map((dropdownItem) => (
                                            <Link
                                                key={dropdownItem._id}
                                                to={dropdownItem.route}
                                                className={`nav-link sidebar-btn ${isActive(dropdownItem.route) ? 'active' : ''}`}
                                                style={{
                                                    paddingLeft: '3rem',
                                                    paddingRight: '1rem',
                                                    fontSize: '0.9rem',
                                                    width: '100%',
                                                    display: 'block',
                                                    marginBottom: '0.25rem'
                                                }}
                                            >
                                                <i className={`${getItemIcon(dropdownItem.name)} me-2`}></i>
                                                {dropdownItem.name}
                                            </Link>
                                        ))}
                                        {item.name.toLowerCase().includes('service') && services.length > 0 && services.map(service => (
                                            <Link
                                                key={service._id}
                                                to={`/services/${service.slug}`}
                                                className={`nav-link sidebar-btn ${isActive(`/services/${service.slug}`) ? 'active' : ''}`}
                                                style={{ paddingLeft: '3rem', paddingRight: '1rem', fontSize: '0.9rem', width: '100%', display: 'block', marginBottom: '0.25rem' }}
                                            >
                                                <i className="fas fa-cog me-2"></i>{service.name}
                                            </Link>
                                        ))}
                                        {item.name.toLowerCase().includes('calculator') && (
                                            calculatorPages.length === 0 ? (
                                                <div className="nav-link" style={{ paddingLeft: '3rem', fontSize: '0.9rem', color: '#adb5bd' }}>No calculators found</div>
                                            ) : (
                                                calculatorPages.map(page => (
                                                    <Link
                                                        key={page._id}
                                                        to={`/calculators/${page.name.replace(/\s+/g, '-').toLowerCase()}`}
                                                        className={`nav-link sidebar-btn ${isActive(`/calculators/${page.name.replace(/\s+/g, '-').toLowerCase()}`) ? 'active' : ''}`}
                                                        style={{ paddingLeft: '3rem', paddingRight: '1rem', fontSize: '0.9rem', width: '100%', display: 'block', marginBottom: '0.25rem' }}
                                                    >
                                                        <i className="fas fa-calculator me-2"></i>{page.name}
                                                    </Link>
                                                ))
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return null;
                })}
                <div className="mt-auto pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <button
                        className="btn w-100 d-flex align-items-center justify-content-center mb-2"
                        onClick={toggleDarkMode}
                        style={{ backgroundColor: '#184b86ff', border: '1px solid #184b86ff', color: '#fff', fontSize: '0.9rem', padding: '0.5rem 1rem', borderRadius: '6px', transition: 'all 0.3s ease' }}
                        onMouseEnter={e => {
                            e.target.style.backgroundColor = '#fff';
                            e.target.style.color = '#184b86ff';
                        }}
                        onMouseLeave={e => {
                            e.target.style.backgroundColor = '#184b86ff';
                            e.target.style.color = '#fff';
                        }}
                    >
                        <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} me-2`}></i>
                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    {admin && (
                        <button
                            className="btn w-100 d-flex align-items-center justify-content-center"
                            onClick={auth.logout}
                            style={{ backgroundColor: '#fff', border: '1px solid #184b86ff', color: '#184b86ff', fontSize: '0.9rem', padding: '0.5rem 1rem', borderRadius: '6px', transition: 'all 0.3s ease' }}
                            onMouseEnter={e => {
                                e.target.style.backgroundColor = '#184b86ff';
                                e.target.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                                e.target.style.backgroundColor = '#fff';
                                e.target.style.color = '#184b86ff';
                            }}
                        >
                            <i className="fas fa-sign-out-alt me-2"></i>
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;