import React, { useState } from 'react';
import { careerAPI } from '../../services/api';
import Alert from '../../components/Alert';

const CareerForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: '',
        resume: null
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const submitData = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    submitData.append(key, formData[key]);
                }
            });

            // Add a dummy reCAPTCHA token for now (you can implement real reCAPTCHA later)
            submitData.append('recaptchaToken', 'dummy-token-for-development');

            const response = await careerAPI.submit(submitData);

            setMessage('Application submitted successfully!');
            setFormData({
                fullName: '',
                email: '',
                phone: '',
                message: '',
                resume: null
            });
            // Reset file input
            document.getElementById('resume').value = '';
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Career Application Form</h3>
                        </div>
                        <div className="card-body">
                            {message && (
                                <Alert
                                    message={message}
                                    type={message.includes('success') ? 'success' : 'danger'}
                                    onClose={() => setMessage('')}
                                />
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="fullName" className="form-label">Full Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="email" className="form-label">Email *</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="phone" className="form-label">Phone *</label>
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message/Cover Letter *</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        name="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us about your qualifications, experience, and why you're interested in this position..."
                                        required
                                    ></textarea>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="resume" className="form-label">Resume (PDF/DOC/DOCX) *</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="resume"
                                        name="resume"
                                        onChange={handleChange}
                                        accept=".pdf,.doc,.docx"
                                        required
                                    />
                                    <div className="form-text">
                                        Maximum file size: 5MB. Accepted formats: PDF, DOC, DOCX
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Application'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerForm;
