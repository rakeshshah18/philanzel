import React from 'react';

const ServicesOverview = () => {
    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="h2 mb-0">
                        <i className="fas fa-eye me-2"></i>
                        Services Overview
                    </h1>
                    <p className="text-muted">Comprehensive overview of all our services</p>
                </div>
            </div>

            

            <div className="row">
                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100 border-left-primary shadow-sm">
                        <div className="card-body text-center">
                            <div className="text-primary mb-3">
                                <i className="fas fa-wrench fa-3x"></i>
                            </div>
                            <h5 className="card-title">Service 1</h5>
                            <p className="card-text text-muted">Technical maintenance and support solutions</p>
                            <a href="/service-1" className="btn btn-outline-primary btn-sm">Learn More</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100 border-left-success shadow-sm">
                        <div className="card-body text-center">
                            <div className="text-success mb-3">
                                <i className="fas fa-tools fa-3x"></i>
                            </div>
                            <h5 className="card-title">Service 2</h5>
                            <p className="card-text text-muted">Advanced tooling and equipment services</p>
                            <a href="/service-2" className="btn btn-outline-success btn-sm">Learn More</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100 border-left-info shadow-sm">
                        <div className="card-body text-center">
                            <div className="text-info mb-3">
                                <i className="fas fa-laptop-code fa-3x"></i>
                            </div>
                            <h5 className="card-title">Service 3</h5>
                            <p className="card-text text-muted">Software development and coding solutions</p>
                            <a href="/service-3" className="btn btn-outline-info btn-sm">Learn More</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100 border-left-warning shadow-sm">
                        <div className="card-body text-center">
                            <div className="text-warning mb-3">
                                <i className="fas fa-mobile-alt fa-3x"></i>
                            </div>
                            <h5 className="card-title">Service 4</h5>
                            <p className="card-text text-muted">Mobile application development services</p>
                            <a href="/service-4" className="btn btn-outline-warning btn-sm">Learn More</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100 border-left-secondary shadow-sm">
                        <div className="card-body text-center">
                            <div className="text-secondary mb-3">
                                <i className="fas fa-database fa-3x"></i>
                            </div>
                            <h5 className="card-title">Service 5</h5>
                            <p className="card-text text-muted">Database management and optimization</p>
                            <a href="/service-5" className="btn btn-outline-secondary btn-sm">Learn More</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100 border-left-dark shadow-sm">
                        <div className="card-body text-center">
                            <div className="text-dark mb-3">
                                <i className="fas fa-cloud fa-3x"></i>
                            </div>
                            <h5 className="card-title">Service 6</h5>
                            <p className="card-text text-muted">Cloud infrastructure and deployment</p>
                            <a href="/service-6" className="btn btn-outline-dark btn-sm">Learn More</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100 border-left-danger shadow-sm">
                        <div className="card-body text-center">
                            <div className="text-danger mb-3">
                                <i className="fas fa-shield-alt fa-3x"></i>
                            </div>
                            <h5 className="card-title">Service 7</h5>
                            <p className="card-text text-muted">Security and protection solutions</p>
                            <a href="/service-7" className="btn btn-outline-danger btn-sm">Learn More</a>
                        </div>
                    </div>
                </div>

                <div className="col-md-6 col-lg-3 mb-4">
                    <div className="card h-100 border-left-primary shadow-sm">
                        <div className="card-body text-center">
                            <div className="text-primary mb-3">
                                <i className="fas fa-chart-line fa-3x"></i>
                            </div>
                            <h5 className="card-title">Service 8</h5>
                            <p className="card-text text-muted">Analytics and business intelligence</p>
                            <a href="/service-8" className="btn btn-outline-primary btn-sm">Learn More</a>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default ServicesOverview;
