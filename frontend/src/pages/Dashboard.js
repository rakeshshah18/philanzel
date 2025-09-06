import React, { useState, useEffect } from 'react';
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

    // Handle delete admin
    const handleDeleteAdmin = async (adminId, adminEmail) => {
        if (!window.confirm(`Are you sure you want to delete admin: ${adminEmail}? This action cannot be undone.`)) return;
        setDeleteLoading(true);
        try {
            await adminAuthAPI.deleteAdmin(adminId);
            setAdmins((prev) => prev.filter((a) => a._id !== adminId));
            setAuthMessage('✅ Admin deleted successfully!');
        } catch (err) {
            setAuthMessage('❌ Failed to delete admin.');
        }
        setDeleteLoading(false);
    };

    const [loading, setLoading] = useState(true);

    // Auth states
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    // OTP registration states
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [pendingOtpEmail, setPendingOtpEmail] = useState('');

    // Delete Admin Modal state
    const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);

    useEffect(() => {
        setLoading(false);
    }, []);

    // Fetch admins if super_admin
    useEffect(() => {
        const fetchAdmins = async () => {
            if (isAuthenticated && admin && admin.role === 'super_admin') {
                setAdminsLoading(true);
                setAdminsError('');
                try {
                    const res = await adminAuthAPI.getAllAdmins();
                    setAdmins(res.data.data || []);
                } catch (err) {
                    setAdminsError('Failed to fetch admins.');
                }
                setAdminsLoading(false);
            }
        };
        fetchAdmins();
    }, [isAuthenticated, admin]);

    // Auth handlers
    const handleLogin = async (loginData) => {
        setAuthLoading(true);
        setAuthMessage('');

        const result = await login(loginData.email, loginData.password);

        if (result.success) {
            setAuthMessage('✅ Login successful!');
            setShowLoginModal(false);
        } else {
            setAuthMessage(`❌ ${result.error}`);
        }

        setAuthLoading(false);
    };


    const handleRegister = async (registerData) => {
        setAuthLoading(true);
        setAuthMessage('');

        const result = await register(registerData);

        if (result.success && result.admin) {
            setAuthMessage('✅ Admin registered successfully!');
            setShowRegisterModal(false);
        } else if (result.success && !result.admin) {
            // OTP flow triggered
            setPendingOtpEmail(registerData.email);
            setShowRegisterModal(false);
            setShowOtpModal(true);
            setAuthMessage('OTP sent to super admin. Please enter OTP to complete registration.');
        } else {
            setAuthMessage(`❌ ${result.error}`);
        }

        setAuthLoading(false);
    };

    // OTP verification handler
    const handleVerifyOtp = async ({ email, otp }) => {
        setAuthLoading(true);
        setAuthMessage('');
        try {
            const API_BASE = process.env.NODE_ENV === 'production' ? 'https://philanzel-backend.vercel.app/api' : 'http://localhost:8000/api';
            const res = await fetch(`${API_BASE}/admin/auth/verify-admin-registration`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });
            const data = await res.json();
            if (data.success) {
                setAuthMessage('✅ Admin registered successfully!');
                setShowOtpModal(false);
            } else {
                setAuthMessage(`❌ ${data.message}`);
            }
        } catch (err) {
            setAuthMessage('❌ OTP verification failed.');
        }
        setAuthLoading(false);
    };

    const handleLogout = async () => {
        await logout();
        setAuthMessage('✅ Logged out successfully!');
    };

    if (loading) {
        return (
            <>
                <AdminNavbar
                    onLoginClick={() => setShowLoginModal(true)}
                    onRegisterClick={() => setShowRegisterModal(true)}
                    isAuthenticated={isAuthenticated}
                    admin={admin}
                    onLogout={handleLogout}
                />

                <div className="container-fluid p-4">
                    <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
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

    return (
        <>
            <AdminNavbar
                onLoginClick={() => setShowLoginModal(true)}
                onRegisterClick={() => setShowRegisterModal(true)}
                isAuthenticated={isAuthenticated}
                admin={admin}
                onLogout={handleLogout}
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
                                                                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteAdmin(a._id, a.email)} disabled={deleteLoading}>
                                                                    <i className="bi bi-trash"></i> {deleteLoading ? 'Deleting...' : 'Delete'}
                                                                </button>
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
        </>
    );
};

export default Dashboard;
