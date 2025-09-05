
import React, { useState, useEffect } from 'react';

const RegisterForm = ({ show, onClose, onRegister, onVerifyOtp, loading, otpRequired, emailForOtp }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [otp, setOtp] = useState('');
    const [showOtpField, setShowOtpField] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    // Keep OTP field in sync with parent prop
    useEffect(() => {
        setShowOtpField(otpRequired);
    }, [otpRequired]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validate = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Full Name is required';
        } else if (formData.name.length < 2 || formData.name.length > 50) {
            errors.name = 'Name must be between 2 and 50 characters';
        } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
            errors.name = 'Name can only contain letters and spaces';
        }
        if (!formData.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
            errors.email = 'Please provide a valid email address';
        }
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
            errors.password = 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
        }
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }
        await onRegister(formData);
        // showOtpField will be set by useEffect if needed
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setOtp('');
        setShowOtpField(false);
        onClose();
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (onVerifyOtp) {
            onVerifyOtp({ email: emailForOtp || formData.email, otp });
        }
    };

    if (!show) return null;

    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Register Admin</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="registerName" className="form-label">Full Name *</label>
                                <input
                                    type="text"
                                    className={`form-control${formErrors.name ? ' is-invalid' : ''}`}
                                    id="registerName"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                />
                                {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="registerEmail" className="form-label">Email *</label>
                                <input
                                    type="email"
                                    className={`form-control${formErrors.email ? ' is-invalid' : ''}`}
                                    id="registerEmail"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                                {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="registerPassword" className="form-label">Password *</label>
                                <input
                                    type="password"
                                    className={`form-control${formErrors.password ? ' is-invalid' : ''}`}
                                    id="registerPassword"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                />
                                {formErrors.password && <div className="invalid-feedback">{formErrors.password}</div>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="registerConfirmPassword" className="form-label">Confirm Password *</label>
                                <input
                                    type="password"
                                    className={`form-control${formErrors.confirmPassword ? ' is-invalid' : ''}`}
                                    id="registerConfirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                />
                                {formErrors.confirmPassword && <div className="invalid-feedback">{formErrors.confirmPassword}</div>}
                            </div>
                        </div>
                        <div className="modal-footer flex-column align-items-stretch">
                            <div className="d-flex justify-content-between w-100 mb-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleClose}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading || showOtpField}
                                >
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            </div>
                        </div>
                    </form>
                    {showOtpField && (
                        <div className="modal-footer flex-column align-items-stretch pt-0">
                            <form onSubmit={handleVerifyOtp} className="d-flex flex-row align-items-center gap-2 w-100">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    style={{ maxWidth: 180 }}
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={handleOtpChange}
                                    required
                                />
                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={loading || !otp}
                                >
                                    {loading ? 'Verifying...' : 'Verify OTP'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
