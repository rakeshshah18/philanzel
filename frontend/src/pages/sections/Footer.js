import React, { useState, useEffect } from 'react';
import { footerAPI } from '../../services/api';

const Footer = () => {
    const [footerData, setFooterData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchFooterData();
    }, []);

    const fetchFooterData = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await footerAPI.admin.get();
            if (response.data.success) {
                setFooterData(response.data.data);
            } else {
                setError('Failed to load footer data');
            }
        } catch (error) {
            console.error('Error fetching footer data:', error);
            setError('Failed to load footer data');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const response = await footerAPI.admin.update(footerData);
            if (response.data.success) {
                setEditMode(false);
                alert('Footer updated successfully!');
            } else {
                alert('Failed to update footer');
            }
        } catch (error) {
            console.error('Error updating footer:', error);
            alert('Failed to update footer');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (path, value) => {
        const keys = path.split('.');
        const newFooterData = { ...footerData };
        let current = newFooterData;

        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;

        setFooterData(newFooterData);
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-dark text-white">
                                <h4 className="mb-0">
                                    <i className="bi bi-dash-lg me-2"></i>
                                    Footer Management
                                </h4>
                            </div>
                            <div className="card-body">
                                <div className="text-center py-5">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-3">Loading footer data...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-header bg-dark text-white">
                                <h4 className="mb-0">
                                    <i className="bi bi-dash-lg me-2"></i>
                                    Footer Management
                                </h4>
                            </div>
                            <div className="card-body">
                                <div className="alert alert-danger">
                                    <i className="bi bi-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={fetchFooterData}
                                >
                                    Retry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                <i className="bi bi-dash-lg me-2"></i>
                                Footer Management
                            </h4>
                            <div>
                                {!editMode ? (
                                    <button
                                        className="btn btn-outline-light"
                                        onClick={() => setEditMode(true)}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i>
                                        Edit Footer
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            className="btn btn-success me-2"
                                            onClick={handleSave}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="bi bi-save me-2"></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-outline-light"
                                            onClick={() => {
                                                setEditMode(false);
                                                fetchFooterData();
                                            }}
                                        >
                                            <i className="bi bi-x-lg me-2"></i>
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            {footerData && (
                                <div className="row">
                                    {/* About Us Section */}
                                    <div className="col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <h5 className="mb-0">About Us Section</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <label className="form-label">Description</label>
                                                    {editMode ? (
                                                        <textarea
                                                            className="form-control"
                                                            rows="4"
                                                            value={footerData.aboutUs.description}
                                                            onChange={(e) => handleInputChange('aboutUs.description', e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="form-control-plaintext">{footerData.aboutUs.description}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Read More Button Text</label>
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={footerData.aboutUs.readMoreButton.text}
                                                            onChange={(e) => handleInputChange('aboutUs.readMoreButton.text', e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="form-control-plaintext">{footerData.aboutUs.readMoreButton.text}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Read More Button URL</label>
                                                    {editMode ? (
                                                        <input
                                                            type="url"
                                                            className="form-control"
                                                            value={footerData.aboutUs.readMoreButton.url}
                                                            onChange={(e) => handleInputChange('aboutUs.readMoreButton.url', e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="form-control-plaintext">{footerData.aboutUs.readMoreButton.url}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact Information */}
                                    <div className="col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <h5 className="mb-0">Contact Information</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <label className="form-label">Primary Email</label>
                                                    {editMode ? (
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            value={footerData.contactUs.email.primary}
                                                            onChange={(e) => handleInputChange('contactUs.email.primary', e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="form-control-plaintext">{footerData.contactUs.email.primary}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Primary Phone</label>
                                                    {editMode ? (
                                                        <input
                                                            type="tel"
                                                            className="form-control"
                                                            value={footerData.contactUs.phoneNumber.primary}
                                                            onChange={(e) => handleInputChange('contactUs.phoneNumber.primary', e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="form-control-plaintext">{footerData.contactUs.phoneNumber.primary}</p>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Street Address</label>
                                                    {editMode ? (
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={footerData.contactUs.address.street}
                                                            onChange={(e) => handleInputChange('contactUs.address.street', e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="form-control-plaintext">{footerData.contactUs.address.street}</p>
                                                    )}
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">City</label>
                                                        {editMode ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={footerData.contactUs.address.city}
                                                                onChange={(e) => handleInputChange('contactUs.address.city', e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="form-control-plaintext">{footerData.contactUs.address.city}</p>
                                                        )}
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">State</label>
                                                        {editMode ? (
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={footerData.contactUs.address.state}
                                                                onChange={(e) => handleInputChange('contactUs.address.state', e.target.value)}
                                                            />
                                                        ) : (
                                                            <p className="form-control-plaintext">{footerData.contactUs.address.state}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Style Settings */}
                                    <div className="col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <h5 className="mb-0">Footer Styling</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="mb-3">
                                                    <label className="form-label">Background Color</label>
                                                    {editMode ? (
                                                        <input
                                                            type="color"
                                                            className="form-control form-control-color"
                                                            value={footerData.backgroundColor}
                                                            onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                                                        />
                                                    ) : (
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="me-2"
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    backgroundColor: footerData.backgroundColor,
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #ccc'
                                                                }}
                                                            ></div>
                                                            <span>{footerData.backgroundColor}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Text Color</label>
                                                    {editMode ? (
                                                        <input
                                                            type="color"
                                                            className="form-control form-control-color"
                                                            value={footerData.textColor}
                                                            onChange={(e) => handleInputChange('textColor', e.target.value)}
                                                        />
                                                    ) : (
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="me-2"
                                                                style={{
                                                                    width: '20px',
                                                                    height: '20px',
                                                                    backgroundColor: footerData.textColor,
                                                                    borderRadius: '4px',
                                                                    border: '1px solid #ccc'
                                                                }}
                                                            ></div>
                                                            <span>{footerData.textColor}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Copyright Text</label>
                                                    {editMode ? (
                                                        <textarea
                                                            className="form-control"
                                                            rows="2"
                                                            value={footerData.copyrightText}
                                                            onChange={(e) => handleInputChange('copyrightText', e.target.value)}
                                                        />
                                                    ) : (
                                                        <p className="form-control-plaintext">{footerData.copyrightText}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="col-md-6 mb-4">
                                        <div className="card h-100">
                                            <div className="card-header">
                                                <h5 className="mb-0">Footer Statistics</h5>
                                            </div>
                                            <div className="card-body">
                                                <div className="row text-center">
                                                    <div className="col-4">
                                                        <div className="border rounded p-3">
                                                            <h4 className="text-primary mb-1">{footerData.quickLinks.links.length}</h4>
                                                            <small className="text-muted">Quick Links</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="border rounded p-3">
                                                            <h4 className="text-success mb-1">{footerData.ourServices.services.length}</h4>
                                                            <small className="text-muted">Services</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-4">
                                                        <div className="border rounded p-3">
                                                            <h4 className="text-info mb-1">{footerData.optimizeStrategy.strategies.length}</h4>
                                                            <small className="text-muted">Strategies</small>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row text-center mt-3">
                                                    <div className="col-6">
                                                        <div className="border rounded p-3">
                                                            <h4 className="text-warning mb-1">{footerData.calculators.calculatorList.length}</h4>
                                                            <small className="text-muted">Calculators</small>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="border rounded p-3">
                                                            <h4 className="text-danger mb-1">{footerData.contactUs.followUs.socialLinks.length}</h4>
                                                            <small className="text-muted">Social Links</small>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="row mt-4">
                                <div className="col-12">
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button className="btn btn-primary">
                                            <i className="bi bi-plus-lg me-2"></i>
                                            Add Quick Link
                                        </button>
                                        <button className="btn btn-success">
                                            <i className="bi bi-plus-lg me-2"></i>
                                            Add Service
                                        </button>
                                        <button className="btn btn-info">
                                            <i className="bi bi-plus-lg me-2"></i>
                                            Add Calculator
                                        </button>
                                        <button className="btn btn-warning">
                                            <i className="bi bi-plus-lg me-2"></i>
                                            Add Social Link
                                        </button>
                                        <button className="btn btn-secondary">
                                            <i className="bi bi-eye me-2"></i>
                                            Preview Footer
                                        </button>
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

export default Footer;
