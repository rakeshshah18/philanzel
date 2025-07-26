import React, { useState } from 'react';

const RegisterForm = ({ show, onClose, onRegister, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        await onRegister(formData);
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    };

    const handleClose = () => {
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        onClose();
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
                                    className="form-control"
                                    id="registerName"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="registerEmail" className="form-label">Email *</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="registerEmail"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="registerPassword" className="form-label">Password *</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="registerPassword"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="registerConfirmPassword" className="form-label">Confirm Password *</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="registerConfirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
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
                                disabled={loading}
                            >
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
