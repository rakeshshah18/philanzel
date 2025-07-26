import React, { useState, useEffect } from 'react';
import { inquiryAPI, careerAPI } from '../services/api';
import { LoginForm, RegisterForm, AdminNavbar } from '../components/admin-forms';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';

const Dashboard = () => {
    const { admin, isAuthenticated, login, register, logout } = useAuth();

    const [stats, setStats] = useState({
        totalInquiries: 0,
        totalApplications: 0,
        pendingInquiries: 0,
        pendingApplications: 0
    });
    const [loading, setLoading] = useState(true);

    // Auth states
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
    const [authMessage, setAuthMessage] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [inquiriesRes, applicationsRes] = await Promise.all([
                inquiryAPI.getAll().catch(() => ({ data: [] })),
                careerAPI.getAll().catch(() => ({ data: [] }))
            ]);

            const inquiries = inquiriesRes.data || [];
            const applications = applicationsRes.data || [];

            setStats({
                totalInquiries: inquiries.length,
                totalApplications: applications.length,
                pendingInquiries: inquiries.filter(item => item.status === 'pending').length,
                pendingApplications: applications.filter(item => item.status === 'pending').length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    // Auth handlers
    const handleLogin = async (loginData) => {
        setAuthLoading(true);
        setAuthMessage('');

        const result = await login(loginData);

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

        if (result.success) {
            setAuthMessage('✅ Admin registered successfully!');
            setShowRegisterModal(false);
        } else {
            setAuthMessage(`❌ ${result.error}`);
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
