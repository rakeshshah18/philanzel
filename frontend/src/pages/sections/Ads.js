import React from 'react';

const Ads = () => {
    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-warning text-dark">
                            <h4 className="mb-0">
                                <i className="fas fa-bullhorn me-2"></i>
                                Ads Management
                            </h4>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-5">
                                <i className="fas fa-bullhorn fa-3x text-warning mb-3"></i>
                                <h5>Ads Management</h5>
                                <p className="text-muted">
                                    This section will allow you to manage advertisements displayed on your website.
                                </p>
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    Coming Soon! This feature is under development.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Ads;
