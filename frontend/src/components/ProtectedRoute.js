import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';

const ProtectedRoute = ({
    children,
    requiredRoles = ['admin', 'super_admin'],
    fallback = null,
    redirectToLogin = true
}) => {
    const { isAuthenticated, hasRole, admin, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !isAuthenticated && redirectToLogin) {
            navigate('/admin/login');
        }
    }, [isAuthenticated, loading, redirectToLogin, navigate]);

    // Show loading if auth status is being checked
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
        if (redirectToLogin) {
            return null; // Will redirect via useEffect
        }
        return fallback || (
            <div className="container mt-5">
                <Alert
                    message={
                        <div>
                            <h4>Authentication Required</h4>
                            <p>Please login to access this page.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/admin/login')}
                            >
                                Go to Login
                            </button>
                        </div>
                    }
                    type="warning"
                    dismissible={false}
                />
            </div>
        );
    }

    // Check if user has required role (if hasRole function exists)
    if (hasRole && !hasRole(requiredRoles)) {
        return fallback || (
            <div className="container mt-5">
                <Alert
                    message={
                        <div>
                            <h4>Access Denied</h4>
                            <p>You don't have permission to access this page.</p>
                            <p>Required role(s): {Array.isArray(requiredRoles) ? requiredRoles.join(', ') : requiredRoles}</p>
                            <p>Your role: {admin?.role || 'Unknown'}</p>
                        </div>
                    }
                    type="danger"
                    dismissible={false}
                />
            </div>
        );
    }

    // User is authenticated and has required role
    return children;
};

export default ProtectedRoute;
