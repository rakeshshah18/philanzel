import React, { useState, useEffect } from 'react';
import { LoginForm, RegisterForm, AdminNavbar } from '../components/admin-forms';
import OtpModal from '../components/admin-forms/OtpModal';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';

const Dashboard = () => {
    const { admin, isAuthenticated, login, register, logout } = useAuth();

    const [loading, setLoading] = useState(true);

    // Auth states
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authMessage, setAuthMessage] = useState('');
    // OTP registration states
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [pendingOtpEmail, setPendingOtpEmail] = useState('');

    useEffect(() => {
        setLoading(false);
    }, []);

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
            const res = await fetch('http://localhost:8000/api/admin/auth/verify-admin-registration', {
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
            />

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
                {/* Example: Disable or hide action buttons if not authenticated */}
                {/*
                <button className="btn btn-primary" disabled={!isAuthenticated}>Add Something</button>
                */}
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
