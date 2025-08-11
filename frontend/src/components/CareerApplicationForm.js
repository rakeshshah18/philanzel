import React, { useState } from 'react';
import Alert from './Alert';
import api from '../services/api';

const CareerApplicationForm = ({ onSuccess }) => {
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        resume: null
    });

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: '' });
        }, 5000);
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    // Submit application form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
            showAlert('Please fill in all required fields', 'error');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showAlert('Please enter a valid email address', 'error');
            return;
        }

        // Basic phone validation
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            showAlert('Please enter a valid phone number', 'error');
            return;
        }

        try {
            setSubmitting(true);

            const applicationData = new FormData();
            applicationData.append('fullName', formData.fullName.trim());
            applicationData.append('email', formData.email.trim());
            applicationData.append('phone', formData.phone.trim());
            applicationData.append('message', formData.message.trim());

            if (formData.resume) {
                applicationData.append('resume', formData.resume);
            }

            const response = await api.post('/user/career-inquiry', applicationData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.status === 'success') {
                showAlert('Application submitted successfully! We will contact you soon.', 'success');
                // Reset form
                setFormData({
                    fullName: '',
                    email: '',
                    phone: '',
                    message: '',
                    resume: null
                });
                // Reset file input
                const fileInput = document.getElementById('resume');
                if (fileInput) fileInput.value = '';

                // Call onSuccess callback if provided
                if (onSuccess) {
                    onSuccess();
                }
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
            showAlert(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="card shadow">
            <div className="card-header bg-primary text-white">
                <h3 className="mb-0 text-center">Apply Now</h3>
            </div>
            <div className="card-body">
                {/* Alert */}
                {alert.show && (
                    <Alert
                        message={alert.message}
                        type={alert.type}
                        onClose={() => setAlert({ show: false, message: '', type: '' })}
                    />
                )}

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="fullName" className="form-label">
                                Full Name <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">
                                Email Address <span className="text-danger">*</span>
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label htmlFor="phone" className="form-label">
                                Phone Number <span className="text-danger">*</span>
                            </label>
                            <input
                                type="tel"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                placeholder="Enter your phone number"
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label htmlFor="resume" className="form-label">
                                Resume (Optional)
                            </label>
                            <input
                                type="file"
                                className="form-control"
                                id="resume"
                                name="resume"
                                accept=".pdf,.doc,.docx"
                                onChange={handleInputChange}
                            />
                            <div className="form-text">
                                Accepted formats: PDF, DOC, DOCX (Max 5MB)
                            </div>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="message" className="form-label">
                            Cover Letter / Message <span className="text-danger">*</span>
                        </label>
                        <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleInputChange}
                            required
                            placeholder="Tell us about yourself, your experience, and why you'd like to join our team..."
                        />
                    </div>

                    <div className="text-center">
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg px-5"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CareerApplicationForm;
