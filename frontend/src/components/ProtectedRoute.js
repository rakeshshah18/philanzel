import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NotAllowed from '../pages/NotAllowed';
import Alert from './Alert';

const ProtectedRoute = ({
    children,
    requiredRoles = ['admin', 'super_admin'],
    allowedTabs = null, // e.g. ['sections']
    tabKey = null, // e.g. 'sections', the key to check in allowedTabs
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
        return fallback || <NotAllowed />;
    }

    // Check allowedTabs if provided using new permission system
    if (allowedTabs && tabKey && Array.isArray(allowedTabs) && admin?.role !== 'super_admin') {
        // Sidebar categories structure
        const SIDEBAR_CATEGORIES = {
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
        };

        // Check if user has access to the page
        const hasPageAccess = (allowedCategories, pageKey) => {
            // Check if user has direct access to the page (for single pages like dashboard)
            if (allowedCategories.includes(pageKey)) {
                return true;
            }

            // Check if user has access to a category that contains this page
            for (const [categoryKey, category] of Object.entries(SIDEBAR_CATEGORIES)) {
                if (allowedCategories.includes(categoryKey) && category.subPages.includes(pageKey)) {
                    return true;
                }
            }

            return false;
        };

        if (!hasPageAccess(allowedTabs, tabKey)) {
            return <NotAllowed />;
        }
    }

    // User is authenticated and has required role
    return children;
};

export default ProtectedRoute;
