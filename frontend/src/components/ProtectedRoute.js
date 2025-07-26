import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Alert from './Alert';

const ProtectedRoute = ({
    children,
    requiredRoles = ['admin', 'super_admin'],
    fallback = null
}) => {
    const { isAuthenticated, hasRole, admin } = useAuth();

    // Show loading if auth status is being checked
    if (admin === undefined) {
        return <div>Loading...</div>;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
        return fallback || (
            <Alert
                message={
                    <div>
                        <h4>Authentication Required</h4>
                        <p>Please login to access this page.</p>
                    </div>
                }
                type="warning"
                dismissible={false}
            />
        );
    }

    // Check if user has required role
    if (!hasRole(requiredRoles)) {
        return fallback || (
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
        );
    }

    // User is authenticated and has required role
    return children;
};

export default ProtectedRoute;
