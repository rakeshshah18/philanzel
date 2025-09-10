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
