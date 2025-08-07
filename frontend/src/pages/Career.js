import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Alert from '../components/Alert';

const Career = () => {
    const { isAuthenticated } = useAuth();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: '' });
        }, 5000);
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    {alert.show && (
                        <Alert 
                            message={alert.message} 
                            type={alert.type} 
                            onClose={() => setAlert({ show: false, message: '', type: '' })} 
                        />
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h1 className="h3 mb-0">Career Management</h1>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h5 className="card-title mb-0">
                                        <i className="fas fa-briefcase me-2"></i>
                                        Career Applications
                                    </h5>
                                </div>
                                <div className="card-body">
                                    {isAuthenticated ? (
                                        <div>
                                            <p className="text-muted mb-3">
                                                Manage career applications and job postings here.
                                            </p>
                                            
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <div className="card bg-light">
                                                        <div className="card-body text-center">
                                                            <i className="fas fa-file-alt fa-3x text-primary mb-3"></i>
                                                            <h6>Job Applications</h6>
                                                            <p className="text-muted small">View and manage submitted applications</p>
                                                            <button className="btn btn-primary btn-sm">
                                                                View Applications
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="col-md-6 mb-3">
                                                    <div className="card bg-light">
                                                        <div className="card-body text-center">
                                                            <i className="fas fa-plus-circle fa-3x text-success mb-3"></i>
                                                            <h6>Job Postings</h6>
                                                            <p className="text-muted small">Create and manage job openings</p>
                                                            <button className="btn btn-success btn-sm">
                                                                Manage Jobs
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-4">
                                                <h6>Quick Stats</h6>
                                                <div className="row">
                                                    <div className="col-md-3">
                                                        <div className="card border-primary">
                                                            <div className="card-body text-center">
                                                                <h4 className="text-primary">0</h4>
                                                                <small className="text-muted">Total Applications</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="card border-warning">
                                                            <div className="card-body text-center">
                                                                <h4 className="text-warning">0</h4>
                                                                <small className="text-muted">Pending Review</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="card border-success">
                                                            <div className="card-body text-center">
                                                                <h4 className="text-success">0</h4>
                                                                <small className="text-muted">Active Jobs</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="card border-info">
                                                            <div className="card-body text-center">
                                                                <h4 className="text-info">0</h4>
                                                                <small className="text-muted">This Month</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="fas fa-lock fa-3x text-muted mb-3"></i>
                                            <h5 className="text-muted">Access Restricted</h5>
                                            <p className="text-muted">Please log in to access career management features.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Career;
