import React, { useState, useEffect } from 'react';
import { adminAuthAPI, servicesAPI, calculatorPagesAPI, reviewSectionsAPI, adsSectionsAPI } from '../services/api';
import { LoginForm, RegisterForm, AdminNavbar } from '../components/admin-forms';
import OtpModal from '../components/admin-forms/OtpModal';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';
const Dashboard = () => {
    const { admin, isAuthenticated, logout } = useAuth();
    const [stats, setStats] = useState({
        services: null,
        calculators: null,
        reviews: null,
        ads: null,
    });
    const [statsLoading, setStatsLoading] = useState(false);
    const [statsError, setStatsError] = useState('');
    useEffect(() => {
        const fetchStats = async () => {
            setStatsLoading(true);
            setStatsError('');
            try {
                const servicesRes = await servicesAPI.getAll();
                const servicesCount = Array.isArray(servicesRes.data.data) ? servicesRes.data.data.length : 0;
                const calculatorsRes = await calculatorPagesAPI.getAll();
                const calculatorsCount = Array.isArray(calculatorsRes.data.data) ? calculatorsRes.data.data.length : 0;
                const reviewsRes = await reviewSectionsAPI.getAll();
                let reviewsCount = 0;
                if (Array.isArray(reviewsRes.data.data)) {
                    reviewsCount = reviewsRes.data.data.reduce((sum, section) => sum + (Array.isArray(section.reviews) ? section.reviews.length : 0), 0);
                }
                const adsRes = await adsSectionsAPI.getAllAdmin();
                const adsCount = Array.isArray(adsRes.data.data) ? adsRes.data.data.length : 0;

                setStats({
                    services: servicesCount,
                    calculators: calculatorsCount,
                    reviews: reviewsCount,
                    ads: adsCount,
                });
            } catch (err) {
                setStatsError('Failed to load dashboard stats');
            } finally {
                setStatsLoading(false);
            }
        };
        fetchStats();
    }, []);
    const [admins, setAdmins] = useState([]);
    const [adminsLoading, setAdminsLoading] = useState(false);
    const [adminsError, setAdminsError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [authLoading] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [pendingOtpEmail] = useState('');
    useEffect(() => {
        if (admin && admin.role === 'super_admin') {
            setAdminsLoading(true);
            adminAuthAPI.getAllAdmins()
                .then((res) => setAdmins(res.data.data || []))
                .catch((err) => setAdminsError('Failed to load admins'))
                .finally(() => setAdminsLoading(false));
        }
    }, [admin]);
    const SIDEBAR_CATEGORIES = React.useMemo(() => ({
        'dashboard': {
            name: 'Dashboard',
            type: 'single',
            subPages: []
        },
        'pages': {
            name: 'Pages',
            type: 'dropdown',
            subPages: ['home', 'about-us', 'career', 'partner', 'contact']
        },
        'services': {
            name: 'Services',
            type: 'dropdown',
            subPages: ['services-sections']
        },
        'calculators': {
            name: 'All Calculators',
            type: 'dropdown',
            subPages: ['calculators']
        },
        'sections': {
            name: 'Sections',
            type: 'dropdown',
            subPages: ['reviews', 'ads', 'footer', 'events']
        }
    }), []);
    const ALL_TABS = React.useMemo(() => Object.keys(SIDEBAR_CATEGORIES), [SIDEBAR_CATEGORIES]);
    const getDisplayName = React.useCallback((key) => {
        if (SIDEBAR_CATEGORIES[key]) {
            return SIDEBAR_CATEGORIES[key].name;
        }
        const pageDisplayNames = {
            'home': 'Home',
            'about-us': 'About Us',
            'career': 'Career',
            'partner': 'Partner',
            'contact': 'Contact Us',
            'services-sections': 'Services Sections',
            'calculators': 'Calculators',
            'reviews': 'Reviews',
            'ads': 'Ads',
            'footer': 'Footer',
            'events': 'Events'
        };

        return pageDisplayNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
    }, [SIDEBAR_CATEGORIES]);
    const getTabDisplayName = (tab) => {
        return getDisplayName(tab);
    };
    const [tabSelections, setTabSelections] = useState({});
    useEffect(() => {
        const fetchAllowedTabs = async () => {
            if (admins.length > 0) {
                const selections = {};
                await Promise.all(admins.map(async (a) => {
                    if (a.role === 'super_admin') return;
                    try {
                        const res = await adminAuthAPI.getAssignedTabs(a._id);
                        selections[a._id] = Array.isArray(res.data.allowedTabs) && res.data.allowedTabs.length > 0 ? res.data.allowedTabs : [...ALL_TABS];
                    } catch {
                        selections[a._id] = [...ALL_TABS];
                    }
                }));
                setTabSelections(selections);
            }
        };
        fetchAllowedTabs();
    }, [admins, ALL_TABS]);
    const handleTabCheckbox = async (adminId, tabKey) => {
        setTabSelections(prev => {
            const current = prev[adminId] || [];
            let updated;
            if (current.includes(tabKey)) {
                updated = current.filter(t => t !== tabKey);
            } else {
                updated = [...current, tabKey];
            }
            adminAuthAPI.assignTabs(adminId, updated);
            return { ...prev, [adminId]: updated };
        });
    };
    const handleDeleteAdmin = async (adminId, email) => {
        if (!window.confirm(`Are you sure you want to delete admin ${email}? This cannot be undone.`)) return;
        setDeleteLoading(true);
        try {
            localStorage.removeItem(`allowedTabs_${adminId}`);
            setAdmins(prev => prev.filter(a => a._id !== adminId));
            setAuthMessage(`✅ Admin ${email} deleted successfully (frontend only)`);
        } catch (err) {
            setAuthMessage(`Failed to delete admin ${email}`);
        } finally {
            setDeleteLoading(false);
        }
    };
    const handleLogin = () => { };
    const handleRegister = () => { };
    const handleVerifyOtp = () => { };
    return (
        <>
            <AdminNavbar
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
                isAuthenticated={isAuthenticated}
                admin={admin}
                onLogout={logout}
                onDeleteAdminClick={() => setShowDeleteAdminModal(true)}
            />
            {showDeleteAdminModal && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Admin Accounts</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteAdminModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="alert alert-warning">
                                    <strong>Warning:</strong> Deleting an admin is permanent and cannot be undone.
                                </div>
                                {adminsLoading ? (
                                    <div>Loading admins...</div>
                                ) : adminsError ? (
                                    <div className="text-danger">{adminsError}</div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-bordered table-hover">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Role</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {admins.map((a) => (
                                                    <tr key={a._id}>
                                                        <td>{a.name}</td>
                                                        <td>{a.email}</td>
                                                        <td>{a.role}</td>
                                                        <td>
                                                            {(a._id !== admin._id && a.role !== 'super_admin') && (
                                                                <>
                                                                    <button className="btn btn-danger btn-sm me-2" onClick={() => handleDeleteAdmin(a._id, a.email)} disabled={deleteLoading}>
                                                                        <i className="bi bi-trash"></i> {deleteLoading ? 'Deleting...' : 'Delete'}
                                                                    </button>
                                                                    {/* Allowed Categories checkboxes */}
                                                                    <div style={{ marginTop: 8 }}>
                                                                        <strong>Allowed Sidebar Categories:</strong>
                                                                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: '700px' }}>
                                                                            {ALL_TABS.map(categoryKey => {
                                                                                const category = SIDEBAR_CATEGORIES[categoryKey];
                                                                                const tooltipText = category.type === 'dropdown'
                                                                                    ? `Includes: ${category.subPages.map(p => getDisplayName(p)).join(', ')}`
                                                                                    : 'Single page access';

                                                                                return (
                                                                                    <label
                                                                                        key={categoryKey}
                                                                                        title={tooltipText}
                                                                                        style={{
                                                                                            fontWeight: 400,
                                                                                            fontSize: 13,
                                                                                            marginBottom: 4,
                                                                                            padding: '4px 8px',
                                                                                            backgroundColor: tabSelections[a._id]?.includes(categoryKey) ? '#e3f2fd' : '#f8f9fa',
                                                                                            borderRadius: '6px',
                                                                                            border: '1px solid #dee2e6',
                                                                                            display: 'flex',
                                                                                            alignItems: 'center',
                                                                                            cursor: 'pointer',
                                                                                            position: 'relative'
                                                                                        }}
                                                                                    >
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={tabSelections[a._id]?.includes(categoryKey) ?? true}
                                                                                            onChange={() => handleTabCheckbox(a._id, categoryKey)}
                                                                                            style={{ marginRight: 6 }}
                                                                                        />
                                                                                        <div>
                                                                                            <div>{getTabDisplayName(categoryKey)}</div>
                                                                                            {category.type === 'dropdown' && (
                                                                                                <div style={{ fontSize: 11, color: '#6c757d', marginTop: 1 }}>
                                                                                                    {category.subPages.length} pages
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </label>
                                                                                );
                                                                            })}
                                                                        </div>
                                                                        <div style={{ fontSize: 11, color: '#6c757d', marginTop: 4 }}>
                                                                            <i className="bi bi-info-circle"></i> Hover over categories to see included pages
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteAdminModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {authMessage && (
                <div className="container-fluid px-4 pt-3">
                    <Alert
                        message={authMessage}
                        type={authMessage.includes('✅') ? 'success' : 'danger'}
                        onClose={() => setAuthMessage('')}
                    />
                </div>
            )}
            <div className="container-fluid p-4">
                <div className="row mb-4">
                    <div className="col">
                        <h1 className="h2 mb-0">Dashboard</h1>
                        <p className="text-muted">Welcome to Philanzel Financial Services</p>
                    </div>
                </div>
                <div className="row g-4 mb-4">
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card shadow-sm dashboard-card h-100" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                            <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                                <i className="fas fa-cogs fa-2x mb-2 text-primary"></i>
                                <h5 className="mb-1" style={{ fontWeight: 700 }}>Services</h5>
                                <div className="display-6 fw-bold">
                                    {statsLoading ? <span className="spinner-border spinner-border-sm text-primary" /> : (stats.services ?? '--')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card shadow-sm dashboard-card h-100" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                            <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                                <i className="fas fa-calculator fa-2x mb-2 text-success"></i>
                                <h5 className="mb-1" style={{ fontWeight: 700 }}>Calculators</h5>
                                <div className="display-6 fw-bold">
                                    {statsLoading ? <span className="spinner-border spinner-border-sm text-success" /> : (stats.calculators ?? '--')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card shadow-sm dashboard-card h-100" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                            <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                                <i className="fas fa-star fa-2x mb-2 text-warning"></i>
                                <h5 className="mb-1" style={{ fontWeight: 700 }}>Reviews</h5>
                                <div className="display-6 fw-bold">
                                    {statsLoading ? <span className="spinner-border spinner-border-sm text-warning" /> : (stats.reviews ?? '--')}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3">
                        <div className="card shadow-sm dashboard-card h-100" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                            <div className="card-body d-flex flex-column align-items-center justify-content-center py-4">
                                <i className="fas fa-bullhorn fa-2x mb-2 text-info"></i>
                                <h5 className="mb-1" style={{ fontWeight: 700 }}>Ads</h5>
                                <div className="display-6 fw-bold">
                                    {statsLoading ? <span className="spinner-border spinner-border-sm text-info" /> : (stats.ads ?? '--')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {statsError && (
                    <div className="alert alert-danger my-2">{statsError}</div>
                )}
                <div className="row g-4">
                    <div className="col-12 col-lg-8">
                        <div className="card shadow-sm dashboard-card h-100" style={{ borderRadius: 18, background: '#fff', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                            <div className="card-body py-4">
                                <h5 className="mb-3" style={{ fontWeight: 700 }}><i className="fas fa-chart-bar me-2 text-primary"></i>Analytics Overview</h5>
                                <div className="text-muted">(Charts and analytics coming soon...)</div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="card shadow-sm dashboard-card h-100" style={{ borderRadius: 18, background: '#fff', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                            <div className="card-body py-4">
                                <h5 className="mb-3" style={{ fontWeight: 700 }}><i className="fas fa-history me-2 text-secondary"></i>Recent Activity</h5>
                                <div className="text-muted">(Recent activity will appear here...)</div>
                            </div>
                        </div>
                    </div>
                </div>

                {!isAuthenticated && (
                    <div className="alert alert-warning d-flex align-items-center justify-content-between mt-4" style={{ gap: '1rem' }}>
                        <div>
                            <strong>Note:</strong> You are viewing as a guest. Please log in as admin to perform actions.
                        </div>
                        <div>
                            <button className="btn btn-primary btn-sm me-2" onClick={() => setShowLoginModal(true)}>
                                <i className="bi bi-box-arrow-in-right me-1"></i> Login
                            </button>
                            <button className="btn btn-success btn-sm" onClick={() => setShowRegisterModal(true)}>
                                <i className="bi bi-person-plus me-1"></i> Register
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <LoginForm
                show={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onLogin={handleLogin}
                loading={authLoading}
            />
            <RegisterForm
                show={showRegisterModal}
                onClose={() => setShowRegisterModal(false)}
                onRegister={handleRegister}
                loading={authLoading}
            />
            <OtpModal
                show={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onVerify={handleVerifyOtp}
                loading={authLoading}
                email={pendingOtpEmail}
            />
        </>
    );
}
export default Dashboard;
