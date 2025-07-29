import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminAuthAPI } from '../services/api';
import Alert from '../components/Alert';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

    // Check for existing token on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setLoading(false);
                return;
            }

            // Verify token by getting profile
            const response = await adminAuthAPI.getProfile();
            const adminData = response.data.data;

            setAdmin(adminData);
            setIsAuthenticated(true);
        } catch (error) {
            // Token is invalid or expired
            localStorage.removeItem('adminToken');
            setAdmin(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async (loginData) => {
        try {
            console.log('Login attempt with data:', loginData);
            const response = await adminAuthAPI.login(loginData);
            console.log('Login response:', response);
            const { admin: adminData, accessToken } = response.data.data;

            // Store token
            localStorage.setItem('adminToken', accessToken);

            // Update state
            setAdmin(adminData);
            setIsAuthenticated(true);

            return { success: true, admin: adminData };
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed';
            return { success: false, error: errorMessage };
        }
    }; const register = async (registerData) => {
        try {
            console.log('Registration attempt:', registerData);
            const response = await adminAuthAPI.register(registerData);
            console.log('Registration response:', response);
            const { admin: adminData, accessToken } = response.data.data;

            // Store token
            localStorage.setItem('adminToken', accessToken);

            // Update state
            setAdmin(adminData);
            setIsAuthenticated(true);

            return { success: true, admin: adminData };
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error details:', error.response?.data);
            const errorMessage = error.response?.data?.message || 'Registration failed';
            return { success: false, error: errorMessage };
        }
    };

    const logout = async () => {
        try {
            await adminAuthAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local state regardless of API call success
            localStorage.removeItem('adminToken');
            setAdmin(null);
            setIsAuthenticated(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await adminAuthAPI.updateProfile(profileData);
            const updatedAdmin = response.data.data;

            setAdmin(updatedAdmin);
            return { success: true, admin: updatedAdmin };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Profile update failed';
            return { success: false, error: errorMessage };
        }
    };

    const changePassword = async (passwordData) => {
        try {
            await adminAuthAPI.changePassword(passwordData);
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Password change failed';
            return { success: false, error: errorMessage };
        }
    };

    // Helper function to check if admin has required role
    const hasRole = (requiredRoles) => {
        if (!isAuthenticated || !admin) return false;
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(admin.role);
        }
        return admin.role === requiredRoles;
    };

    // Helper function to check if admin is authenticated
    const requireAuth = () => {
        if (!isAuthenticated) {
            throw new Error('Authentication required. Please login first.');
        }
    };

    // Helper function to check if admin has permission for operation
    const requirePermission = (requiredRoles = ['admin', 'super_admin']) => {
        requireAuth();
        if (!hasRole(requiredRoles)) {
            throw new Error('Insufficient permissions for this operation.');
        }
    };

    // Protected API wrapper function
    const protectedOperation = async (operation, requiredRoles = ['admin', 'super_admin']) => {
        try {
            requirePermission(requiredRoles);
            return await operation();
        } catch (error) {
            console.error('Protected operation failed:', error);
            if (error.message.includes('Authentication required') ||
                error.message.includes('Insufficient permissions')) {
                return { success: false, error: error.message };
            }
            // If it's an API error, let it bubble up
            throw error;
        }
    };

    // Alert functionality
    const showAlert = (message, type = 'info') => {
        setAlert({ show: true, message, type });
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setAlert({ show: false, message: '', type: 'info' });
        }, 3000);
    };

    const hideAlert = () => {
        setAlert({ show: false, message: '', type: 'info' });
    };

    const value = {
        admin,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        checkAuthStatus,
        hasRole,
        requireAuth,
        requirePermission,
        protectedOperation,
        showAlert,
        hideAlert,
        alert
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Global Alert */}
            {alert.show && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    zIndex: 9999,
                    minWidth: '300px'
                }}>
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={hideAlert}
                        dismissible={true}
                    />
                </div>
            )}
            {children}
        </AuthContext.Provider>
    );
};
