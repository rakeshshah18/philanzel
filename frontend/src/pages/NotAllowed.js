
import React, { useEffect } from 'react';
import './NotAllowed.css';


const NotAllowed = () => {
    useEffect(() => {
        document.body.classList.add('not-allowed-bg');
        return () => {
            document.body.classList.remove('not-allowed-bg');
        };
    }, []);
    return (
        <>
            {/* Animated floating icons */}
            <i className="fas fa-ban floating-icon icon1"></i>
            <i className="fas fa-lock floating-icon icon2"></i>
            <i className="fas fa-user-slash floating-icon icon3"></i>
            <i className="fas fa-shield-alt floating-icon icon4"></i>
            <i className="fas fa-exclamation-triangle floating-icon icon5"></i>
            <div className="container mt-5 text-center not-allowed-fade-in" style={{ position: 'relative', zIndex: 1 }}>
                <div className="animated-lock mx-auto mb-4">
                    <div className="lock-body"></div>
                    <div className="lock-shackle"></div>
                </div>
                <h1 className="display-4 text-danger">Access Denied</h1>
                <p className="lead">You are not allowed to visit this page.</p>
                <p className="lead">You need permission.</p>
            </div>
        </>
    );
};

export default NotAllowed;
