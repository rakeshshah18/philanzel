import React, { useState, useEffect } from 'react';
import Alert from '../components/Alert';
import api from '../services/api';

// Helper function to get the correct image URL
const getImageURL = (filename) => {
    const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000';
    return `${baseURL}/uploads/images/${filename}`;
};

const PublicCareer = () => {
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [careerContent, setCareerContent] = useState([]);
    const [loading, setLoading] = useState(true);
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

    // Fetch career content
    const fetchCareerContent = async () => {
        try {
            setLoading(true);
            const response = await api.get('/career-posts');
            if (response.data.status === 'success') {
                setCareerContent(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching career content:', error);
            showAlert('Failed to load career information', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCareerContent();
    }, []);

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
        <div className="container mt-5">
            {/* Alert */}
            {alert.show && (
                <Alert
                    message={alert.message}
                    type={alert.type}
                    onClose={() => setAlert({ show: false, message: '', type: '' })}
                />
            )}

            {/* Career Content Section */}
            <div className="row mb-5">
                <div className="col-12">
                    <h1 className="text-center mb-4">Join Our Team</h1>

                    {loading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : careerContent.length === 0 ? (
                        <div className="text-center p-4">
                            <h3>We're Always Looking for Talented People</h3>
                            <p className="lead">Check back soon for exciting career opportunities!</p>
                        </div>
                    ) : (
                        <div className="row">
                            {careerContent.map((content, index) => (
                                <div key={content._id} className="col-lg-6 mb-4">
                                    <div className="card h-100 shadow-sm">
                                        {content.image && (
                                            <img
                                                src={getImageURL(content.image.filename)}
                                                className="card-img-top"
                                                alt={content.heading}
                                                style={{ height: '250px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div className="card-body">
                                            <h3 className="card-title">{content.heading}</h3>
                                            <p className="card-text">{content.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Application Form Section */}
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow">
                        <div className="card-header bg-primary text-white">
                            <h3 className="mb-0 text-center">Apply Now</h3>
                        </div>
                        <div className="card-body">
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
                </div>
            </div>

            {/* Contact Information */}
            <div className="row mt-5 mb-5">
                <div className="col-12 text-center">
                    <h4>Questions about careers?</h4>
                    <p className="text-muted">
                        Feel free to reach out to our HR team for any career-related inquiries.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PublicCareer;
