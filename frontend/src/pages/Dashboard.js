import React, { useState, useEffect } from 'react';
import { ASSIGNABLE_PAGES } from '../constants/assignablePages';
import { adminAuthAPI } from '../services/api';
import { LoginForm, RegisterForm, AdminNavbar } from '../components/admin-forms';
import OtpModal from '../components/admin-forms/OtpModal';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';

const Dashboard = () => {
    const { admin, isAuthenticated, login, register, logout } = useAuth();


    // Admin list state (for super_admin)
    const [admins, setAdmins] = useState([]);
    const [adminsLoading, setAdminsLoading] = useState(false);
    const [adminsError, setAdminsError] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Assign Pages modal state
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignAdminId, setAssignAdminId] = useState(null);
    const [assignLoading, setAssignLoading] = useState(false);
    const [selectedPages, setSelectedPages] = useState([]);
    const [selectedAdminId, setSelectedAdminId] = useState(null);

    // View Allowed Pages modal state
    const [showAllowedPagesModal, setShowAllowedPagesModal] = useState(false);
    const [viewAdminId, setViewAdminId] = useState(null);
    const [viewAllowedPages, setViewAllowedPages] = useState([]);
    const [viewLoading, setViewLoading] = useState(false);

    // Auth modals and state
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    const [pendingOtpEmail, setPendingOtpEmail] = useState('');


    // Fetch admins for super_admin
    useEffect(() => {
        if (admin && admin.role === 'super_admin') {
            setAdminsLoading(true);
            adminAuthAPI.getAllAdmins()
                .then((res) => setAdmins(res.data.data || []))
                .catch((err) => setAdminsError('Failed to load admins'))
                .finally(() => setAdminsLoading(false));
        }
    }, [admin]);

    // Handler stubs (implement as needed)
    const handleDeleteAdmin = () => { };

    // View allowed pages for an admin
    const handleViewAllowedPages = (adminId) => {
        setViewAdminId(adminId);
        setShowAllowedPagesModal(true);
        setViewLoading(true);
        setViewAllowedPages([]);
        adminAuthAPI.getAssignedPages(adminId)
            .then(res => setViewAllowedPages(res.data.allowedPages || []))
            .catch(() => setViewAllowedPages([]))
            .finally(() => setViewLoading(false));
    };

    // Remove a page restriction for an admin
    const handleRemovePageRestriction = (pageKey) => {
        if (!viewAdminId) return;
        const updatedPages = viewAllowedPages.filter(p => p !== pageKey);
        setViewLoading(true);
        adminAuthAPI.assignPages(viewAdminId, updatedPages)
            .then(() => {
                setViewAllowedPages(updatedPages);
                setAuthMessage('✅ Page restriction removed!');
            })
            .catch(() => setAuthMessage('Failed to remove page restriction.'))
            .finally(() => setViewLoading(false));
    };
    const handleAssignPages = (adminId) => {
        setAssignAdminId(adminId);
        setSelectedAdminId(adminId);
        setSelectedPages([]);
        setShowAssignModal(true);
    };

    // Handler for changing selected admin in modal
    const handleSelectAdmin = (e) => {
        setSelectedAdminId(e.target.value);
        setSelectedPages([]);
    };

    // Handler for changing selected pages
    const handleSelectPages = (e) => {
        const options = Array.from(e.target.options);
        setSelectedPages(options.filter(o => o.selected).map(o => o.value));
    };

    // Handler for submitting page assignment (stub)
    const handleSubmitAssignPages = (e) => {
        e.preventDefault();
        // TODO: Implement API call to assign selectedPages to selectedAdminId
        setAssignLoading(true);
        setTimeout(() => {
            setAssignLoading(false);
            setShowAssignModal(false);
            setSelectedPages([]);
            setSelectedAdminId(null);
            setAssignAdminId(null);
            // Show success message (replace with real API response)
            setAuthMessage('✅ Pages assigned successfully!');
        }, 1000);
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

            {/* Delete Admin Modal (super_admin only) */}
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
                                                                    <button className="btn btn-primary btn-sm me-2" onClick={() => handleAssignPages(a._id)} disabled={assignLoading}>
                                                                        <i className="bi bi-file-earmark-text"></i> {assignLoading ? 'Assigning...' : 'Assign Pages'}
                                                                    </button>
                                                                    <button className="btn btn-outline-secondary btn-sm" title="View Allowed Pages" onClick={() => handleViewAllowedPages(a._id)}>
                                                                        <i className="bi bi-eye"></i>
                                                                    </button>
                                                                    {/* Allowed Pages Modal */}
                                                                    {showAllowedPagesModal && (
                                                                        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                                                                            <div className="modal-dialog">
                                                                                <div className="modal-content">
                                                                                    <div className="modal-header">
                                                                                        <h5 className="modal-title">Allowed Pages</h5>
                                                                                        <button type="button" className="btn-close" onClick={() => setShowAllowedPagesModal(false)}></button>
                                                                                    </div>
                                                                                    <div className="modal-body">
                                                                                        {viewLoading ? (
                                                                                            <div>Loading...</div>
                                                                                        ) : (
                                                                                            <ul className="list-group">
                                                                                                {viewAllowedPages.length === 0 && <li className="list-group-item">No pages assigned.</li>}
                                                                                                {viewAllowedPages.map(pageKey => {
                                                                                                    const pageObj = ASSIGNABLE_PAGES.find(p => p.key === pageKey);
                                                                                                    return (
                                                                                                        <li key={pageKey} className="list-group-item d-flex justify-content-between align-items-center">
                                                                                                            {pageObj ? pageObj.label : pageKey}
                                                                                                            <button className="btn btn-sm btn-danger" title="Remove Restriction" onClick={() => handleRemovePageRestriction(pageKey)} disabled={viewLoading}>
                                                                                                                <i className="bi bi-trash"></i>
                                                                                                            </button>
                                                                                                        </li>
                                                                                                    );
                                                                                                })}
                                                                                            </ul>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="modal-footer">
                                                                                        <button type="button" className="btn btn-secondary" onClick={() => setShowAllowedPagesModal(false)}>Close</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
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

            {/* Assign Pages Modal */}
            {showAssignModal && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Assign Pages to Admin</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAssignModal(false)}></button>
                            </div>
                            <form onSubmit={handleSubmitAssignPages}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label htmlFor="adminSelect" className="form-label"><strong>Select Admin</strong></label>
                                        <select
                                            id="adminSelect"
                                            className="form-select"
                                            value={selectedAdminId || ''}
                                            onChange={handleSelectAdmin}
                                            required
                                        >
                                            <option value="" disabled>Select an admin</option>
                                            {admins.map(a => (
                                                <option key={a._id} value={a._id}>{a.name} ({a.email})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="pagesSelect" className="form-label"><strong>Select Pages</strong></label>
                                        <select
                                            id="pagesSelect"
                                            className="form-select"
                                            multiple
                                            value={selectedPages}
                                            onChange={handleSelectPages}
                                            required
                                            size={Math.min(ASSIGNABLE_PAGES.length, 8)}
                                        >
                                            {ASSIGNABLE_PAGES.map(page => (
                                                <option key={page.key} value={page.key}>{page.label}</option>
                                            ))}
                                        </select>
                                        <div className="form-text">Hold Ctrl (Windows) or Cmd (Mac) to select multiple pages.</div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" disabled={assignLoading || !selectedAdminId || selectedPages.length === 0}>
                                        {assignLoading ? 'Assigning...' : 'Assign Pages'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Success/Error Messages */}
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
                {/* dashboard content */}
                {!isAuthenticated && (
                    <div className="alert alert-warning d-flex align-items-center justify-content-between" style={{ gap: '1rem' }}>
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

                {/* ...removed Admin Accounts card for super_admin... */}
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
