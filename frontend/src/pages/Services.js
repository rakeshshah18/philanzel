import React from 'react';
import { useParams } from 'react-router-dom';

const ServicePage = ({ serviceNumber }) => {
    const { id } = useParams();
    const serviceNum = serviceNumber || id || '1';

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="h2 mb-0">
                        <i className="fas fa-cogs me-2"></i>
                        Service {serviceNum}
                    </h1>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body text-center py-5">
                            <i className="fas fa-wrench display-1 text-primary mb-3"></i>
                            <h3>Service {serviceNum} Page</h3>
                            <p className="text-muted mb-4">
                                Welcome to Service {serviceNum}. This is where you would describe the details
                                and features of this particular service offering.
                            </p>
                            <div className="row">
                                <div className="col-md-4 mb-3">
                                    <div className="card border-primary">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <i className="fas fa-star text-warning me-2"></i>
                                                Features
                                            </h5>
                                            <p className="card-text">Key features of Service {serviceNum}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card border-success">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <i className="fas fa-check-circle text-success me-2"></i>
                                                Benefits
                                            </h5>
                                            <p className="card-text">Benefits of choosing Service {serviceNum}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <div className="card border-info">
                                        <div className="card-body">
                                            <h5 className="card-title">
                                                <i className="fas fa-info-circle text-info me-2"></i>
                                                Details
                                            </h5>
                                            <p className="card-text">Detailed information about Service {serviceNum}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Individual service components
export const Service1 = () => <ServicePage serviceNumber="1" />;
export const Service2 = () => <ServicePage serviceNumber="2" />;
export const Service3 = () => <ServicePage serviceNumber="3" />;
export const Service4 = () => <ServicePage serviceNumber="4" />;
export const Service5 = () => <ServicePage serviceNumber="5" />;
export const Service6 = () => <ServicePage serviceNumber="6" />;
export const Service7 = () => <ServicePage serviceNumber="7" />;
export const Service8 = () => <ServicePage serviceNumber="8" />;

export default ServicePage;
