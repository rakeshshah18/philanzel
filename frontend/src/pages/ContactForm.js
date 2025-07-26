import React, { useState } from 'react';
import { inquiryAPI } from '../services/api';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        serviceType: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const serviceTypes = [
        'Personal Financial Planning',
        'Investment Advisory',
        'Tax Planning',
        'Insurance Planning',
        'Retirement Planning',
        'Estate Planning',
        'Debt Management',
        'Business Financial Consulting',
        'Wealth Management'
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await inquiryAPI.submit(formData);
            setSuccess(true);
            setFormData({
                name: '',
                email: '',
                phone: '',
                serviceType: '',
                message: ''
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="container-fluid p-4">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card app-card text-center">
                            <div className="card-body p-5">
                                <i className="fas fa-check-circle text-success fa-4x mb-3"></i>
                                <h3 className="text-success mb-3">Thank You!</h3>
                                <p className="mb-4">Your inquiry has been submitted successfully. We'll get back to you soon.</p>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setSuccess(false)}
                                >
                                    Submit Another Inquiry
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid p-4">
            <div className="row mb-4">
                <div className="col">
                    <h1 className="h2 mb-0">Service Inquiry</h1>
                    <p className="text-muted">Get in touch with our financial experts</p>
                </div>
            </div>

            <div className="row">
                <div className="col-lg-8">
                    <div className="card app-card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-envelope me-2"></i>
                                Contact Form
                            </h5>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label htmlFor="name" className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="email" className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="phone" className="form-label">Phone *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <label htmlFor="serviceType" className="form-label">Service Type *</label>
                                        <select
                                            className="form-select"
                                            id="serviceType"
                                            name="serviceType"
                                            value={formData.serviceType}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select a service</option>
                                            {serviceTypes.map((service, index) => (
                                                <option key={index} value={service}>{service}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="col-12">
                                        <label htmlFor="message" className="form-label">Message</label>
                                        <textarea
                                            className="form-control"
                                            id="message"
                                            name="message"
                                            rows="5"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Tell us more about your requirements..."
                                        ></textarea>
                                    </div>

                                    <div className="col-12">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-paper-plane me-2"></i>
                                                    Submit Inquiry
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card app-card">
                        <div className="card-header bg-info text-white">
                            <h5 className="card-title mb-0">
                                <i className="fas fa-info-circle me-2"></i>
                                Contact Information
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <h6 className="fw-bold">
                                    <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                                    Address
                                </h6>
                                <p className="text-muted mb-0">
                                    123 Business Street<br />
                                    Suite 100<br />
                                    City, State 12345
                                </p>
                            </div>

                            <div className="mb-3">
                                <h6 className="fw-bold">
                                    <i className="fas fa-phone me-2 text-primary"></i>
                                    Phone
                                </h6>
                                <p className="text-muted mb-0">+1 (555) 123-4567</p>
                            </div>

                            <div className="mb-3">
                                <h6 className="fw-bold">
                                    <i className="fas fa-envelope me-2 text-primary"></i>
                                    Email
                                </h6>
                                <p className="text-muted mb-0">info@philanzel.com</p>
                            </div>

                            <div>
                                <h6 className="fw-bold">
                                    <i className="fas fa-clock me-2 text-primary"></i>
                                    Business Hours
                                </h6>
                                <p className="text-muted mb-0">
                                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                                    Saturday: 10:00 AM - 4:00 PM<br />
                                    Sunday: Closed
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
