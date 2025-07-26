import React from 'react';

const AdminNavbar = ({ onLoginClick, onRegisterClick, isAuthenticated, admin, onLogout }) => {
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
                                className="btn btn-outline-light"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="btn btn-outline-light me-2"
                                onClick={onLoginClick}
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
