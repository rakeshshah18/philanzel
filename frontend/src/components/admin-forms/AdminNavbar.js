import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = ({ onLoginClick, onRegisterClick, isAuthenticated, admin, onLogout, onDeleteAdminClick }) => {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <span className="navbar-brand">Philanzel Admin</span>
                <div className="d-flex align-items-center">
                    {isAuthenticated ? (
                        <>
                            <span className="text-light me-3">
                                Welcome, {admin?.name}
                            </span>
                            <button
                                className="btn btn-outline-light me-2"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                            {admin?.role === 'super_admin' && (
                                <button
                                    className="btn btn-danger"
                                    onClick={onDeleteAdminClick}
                                >
                                    Delete Admin
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            <button
                                className="btn btn-outline-light me-2"
                                onClick={handleLoginClick}
                            >
                                Login
                            </button>
                            <button
                                className="btn btn-light"
                                onClick={onRegisterClick}
                            >
                                Register Admin
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
