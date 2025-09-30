import React, { useState } from 'react';
import { servicesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
const ServiceModal = ({ show, onHide, onServiceAdded, service = null, isEdit = false }) => {
    const [formData, setFormData] = useState({
        name: service?.name || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { showAlert } = useAuth();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        try {
            if (!formData.name.trim()) {
                setError('Service name is required');
                setIsSubmitting(false);
                return;
            }
            let response;
            if (isEdit && service) {
                response = await servicesAPI.update(service._id, formData);
                showAlert('Service updated successfully!', 'success');
            } else {
                response = await servicesAPI.create(formData);
                showAlert('Service created successfully!', 'success');
            }
            setFormData({ name: '' });
            onServiceAdded(response.data.data);
            onHide();
        } catch (error) {
            console.error('Error saving service:', error);
            setError(error.response?.data?.message || 'Failed to save service');
            showAlert(error.response?.data?.message || 'Failed to save service', 'danger');
        } finally {
            setIsSubmitting(false);
        }
    };
    const handleClose = () => {
        setFormData({ name: service?.name || '' });
        setError('');
        onHide();
    };
    if (!show) return null;
    return (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="fas fa-plus-circle me-2"></i>
                            {isEdit ? 'Edit Service' : 'Add New Service'}
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={handleClose}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="fas fa-exclamation-triangle me-2"></i>
                                    {error}
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="serviceName" className="form-label">
                                    Service Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="serviceName"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter service name"
                                    required
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleClose}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        {isEdit ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-save me-2"></i>
                                        {isEdit ? 'Update Service' : 'Create Service'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ServiceModal;