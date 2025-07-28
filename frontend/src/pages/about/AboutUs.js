import React, { useState, useEffect } from 'react';
import Alert from '../../components/Alert';
import { useAuth } from '../../contexts/AuthContext';

const AboutUs = () => {
    const { isAuthenticated } = useAuth();
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        mission: '',
        vision: '',
        values: '',
        image: { file: null, altText: '' }
    });

    useEffect(() => {
        // Placeholder for fetching about us data
        // fetchAboutData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            if (child === 'file') {
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: files[0]
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: value
                    }
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            // Placeholder for API call
            setMessage('✅ About Us content saved successfully!');
            setShowForm(false);
            // resetForm();
        } catch (error) {
            console.error('Error saving about us content:', error);
            setMessage('❌ Failed to save about us content.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            mission: '',
            vision: '',
            values: '',
            image: { file: null, altText: '' }
        });
        setShowForm(false);
        setMessage('');
    };

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="h2 mb-0">
                            <i className="fas fa-info-circle me-2"></i>
                            About Us
                        </h1>
                        {isAuthenticated && (
                            <div className="btn-group">
                                {!showForm && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowForm(true)}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        {isEditing ? 'Edit Content' : 'Add Content'}
                                    </button>
                                )}
                                {showForm && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {message && (
                <div className="row mb-4">
                    <div className="col-12">
                        <Alert
                            message={message}
                            type={message.includes('✅') ? 'success' : 'danger'}
                            onClose={() => setMessage('')}
                        />
                    </div>
                </div>
            )}

            {loading && (
                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* About Us Content Display */}
            {!showForm && !aboutData && (
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-body text-center py-5">
                                <i className="fas fa-info-circle display-1 text-muted mb-3"></i>
                                <h3>About Us Page</h3>
                                <p className="text-muted">Welcome to our About Us section. This page will showcase information about our company, mission, vision, and values.</p>
                                {isAuthenticated && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowForm(true)}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Add About Us Content
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* About Us Content Form */}
            {showForm && (
                <div className="row">
                    <div className="col-lg-10 mx-auto">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title mb-0">
                                    <i className="fas fa-edit me-2"></i>
                                    {isEditing ? 'Edit About Us Content' : 'Add About Us Content'}
                                </h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="title" className="form-label">
                                                <i className="fas fa-heading me-2"></i>
                                                Title *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="title"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter page title"
                                            />
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="description" className="form-label">
                                                <i className="fas fa-align-left me-2"></i>
                                                Description *
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="description"
                                                name="description"
                                                rows="4"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                                placeholder="Enter company description"
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="mission" className="form-label">
                                                <i className="fas fa-target me-2"></i>
                                                Mission
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="mission"
                                                name="mission"
                                                rows="3"
                                                value={formData.mission}
                                                onChange={handleChange}
                                                placeholder="Enter company mission"
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="vision" className="form-label">
                                                <i className="fas fa-eye me-2"></i>
                                                Vision
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="vision"
                                                name="vision"
                                                rows="3"
                                                value={formData.vision}
                                                onChange={handleChange}
                                                placeholder="Enter company vision"
                                            />
                                        </div>

                                        <div className="col-md-4 mb-3">
                                            <label htmlFor="values" className="form-label">
                                                <i className="fas fa-heart me-2"></i>
                                                Values
                                            </label>
                                            <textarea
                                                className="form-control"
                                                id="values"
                                                name="values"
                                                rows="3"
                                                value={formData.values}
                                                onChange={handleChange}
                                                placeholder="Enter company values"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="image.file" className="form-label">
                                                <i className="fas fa-image me-2"></i>
                                                Company Image
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="image.file"
                                                name="image.file"
                                                onChange={handleChange}
                                                accept="image/*"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="image.altText" className="form-label">
                                                <i className="fas fa-tag me-2"></i>
                                                Image Alt Text
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="image.altText"
                                                name="image.altText"
                                                value={formData.image.altText}
                                                onChange={handleChange}
                                                placeholder="Enter image alt text"
                                            />
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end gap-2">
                                        <button
                                            type="button"
                                            className="btn btn-secondary"
                                            onClick={resetForm}
                                        >
                                            <i className="fas fa-times me-2"></i>
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-2"></i>
                                                    {isEditing ? 'Update' : 'Create'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutUs;
