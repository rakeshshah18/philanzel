import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ show, onClose, onLogin, loading }) => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Determine if this is being used as a standalone page or modal
    const isStandalone = !show && !onClose && !onLogin;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError(''); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isStandalone) {
            // Standalone page login
            try {
                setIsLoading(true);
                const result = await login(formData.email, formData.password);
                if (result.success) {
                    navigate('/dashboard');
                } else {
                    setError(result.message || 'Login failed');
                }
            } catch (error) {
                setError('Login failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        } else {
            // Modal login
            await onLogin(formData);
            setFormData({ email: '', password: '' });
        }
    };

    const handleClose = () => {
        setFormData({ email: '', password: '' });
        setError('');
        if (onClose) onClose();
    };

    const handleBackToDashboard = () => {
        navigate('/dashboard');
    };

    // Don't render modal if show is false
    if (!isStandalone && !show) return null;

    const formContent = (
        <>
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            <div className="mb-3">
                <label htmlFor="loginEmail" className="form-label">Email *</label>
                <input
                    type="email"
                    className="form-control"
                    id="loginEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">Password *</label>
                <input
                    type="password"
                    className="form-control"
                    id="loginPassword"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                />
            </div>
        </>
    );

    if (isStandalone) {
        // Standalone page layout
        return (
            <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
                <div className="row w-100">
                    <div className="col-md-4 mx-auto">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white text-center">
                                <h4 className="mb-0">
                                    <i className="fas fa-chart-line me-2"></i>
                                    Philanzel Admin Login
                                </h4>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {formContent}
                                    <div className="d-grid gap-2">
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Logging in...
                                                </>
                                            ) : (
                                                'Login'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => navigate('/admin/register')}
                                        >
                                            Register
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Modal layout
    return (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Admin Login</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {formContent}
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
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
