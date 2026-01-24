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
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
    try {
        const response = await adminAuthAPI.getProfile();
        setAdmin(response.data.data);
        setIsAuthenticated(true);
    } catch (error) {
        setAdmin(null);
        setIsAuthenticated(false);
    } finally {
        setLoading(false);
    }
};


    // const checkAuthStatus = async () => {
    //     try {
    //         let token = localStorage.getItem('adminToken');
    //         const { isJwtExpired } = require('../utils/jwt');
    //         if (!token || isJwtExpired(token)) {
    //             try {
    //                 const refreshResponse = await adminAuthAPI.refreshToken();
    //                 const newAccessToken = refreshResponse.data.accessToken;
    //                 if (newAccessToken) {
    //                     localStorage.setItem('adminToken', newAccessToken);
    //                     token = newAccessToken;
    //                 } else {
    //                     throw new Error('No access token returned from refresh');
    //                 }
    //             } catch (refreshError) {
    //                 localStorage.removeItem('adminToken');
    //                 setAdmin(null);
    //                 setIsAuthenticated(false);
    //                 setAlert({ show: true, message: 'Session expired. Please log in again.', type: 'warning' });
    //                 setLoading(false);
    //                 return;
    //             }
    //         }
    //         const response = await adminAuthAPI.getProfile();
    //         const adminData = response.data.data;
    //         setAdmin(adminData);
    //         setIsAuthenticated(true);
    //     } catch (error) {
    //         localStorage.removeItem('adminToken');
    //         setAdmin(null);
    //         setIsAuthenticated(false);
    //         if (error?.response?.data?.message?.includes('jwt expired')) {
    //             setAlert({ show: true, message: 'Session expired. Please log in again.', type: 'warning' });
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    const login = async (email, password) => {
        try {
            const response = await adminAuthAPI.login({ email, password });
            const { admin: adminData } = response.data.data;
            // localStorage.setItem('adminToken', accessToken);
            setAdmin(adminData);
            setIsAuthenticated(true);

            return { success: true, admin: adminData };
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error.response?.data?.message || 'Login failed';
            return { success: false, error: errorMessage };
        }
    };
    const register = async (registerData) => {
        try {
            console.log('Registration attempt:', registerData);
            const response = await adminAuthAPI.register(registerData);
            if (response.data.message && response.data.message.includes('OTP')) {
                return { success: true };
            }
            const { admin: adminData, accessToken } = response.data.data;
            // localStorage.setItem('adminToken', accessToken);
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
            // localStorage.removeItem('adminToken');
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
    const hasRole = (requiredRoles) => {
        if (!isAuthenticated || !admin) return false;
        if (Array.isArray(requiredRoles)) {
            return requiredRoles.includes(admin.role);
        }
        return admin.role === requiredRoles;
    };
    const requireAuth = () => {
        if (!isAuthenticated) {
            throw new Error('Authentication required. Please login first.');
        }
    };
    const requirePermission = (requiredRoles = ['admin', 'super_admin']) => {
        requireAuth();
        if (!hasRole(requiredRoles)) {
            throw new Error('Insufficient permissions for this operation.');
        }
    };
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
            throw error;
        }
    };
    const showAlert = (message, type = 'info') => {
        setAlert({ show: true, message, type });
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
