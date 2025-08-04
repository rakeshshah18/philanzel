import React, { useState, useEffect, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { optimizeStrategyAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../../components/Alert';

const OptimizeStrategy = ({ setMessage }) => {
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetchingStrategies, setFetchingStrategies] = useState(false);
    const [message, setLocalMessage] = useState('');
    const [strategies, setStrategies] = useState([]);
    const [formData, setFormData] = useState({
        heading: '',
        description: ''
    });

    // Edit functionality state
    const [isEditing, setIsEditing] = useState(false);
    const [editingStrategyId, setEditingStrategyId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        heading: '',
        description: ''
    });

    // Quill editor configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'bullet', 'align', 'link'
    ];

    const fetchStrategies = useCallback(async () => {
        try {
            setFetchingStrategies(true);
            const response = await optimizeStrategyAPI.getAll();
            setStrategies(response.data.data || []);
        } catch (error) {
            console.error('Error fetching strategies:', error);
            const errorMsg = `❌ Failed to fetch strategies. ${error.response?.data?.message || error.message}`;
            if (setMessage) setMessage(errorMsg);
            else setLocalMessage(errorMsg);
        } finally {
            setFetchingStrategies(false);
        }
    }, [setMessage]);

    // Fetch strategies on component mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchStrategies();
        }
    }, [isAuthenticated, fetchStrategies]);

    // Show authentication required message if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="container mt-4">
                <Alert
                    message={
                        <div>
                            <h4>🔐 Authentication Required</h4>
                            <p>Please <a href="/login" className="text-decoration-none">login</a> to access the Optimize Strategy section.</p>
                            <p>You need admin privileges to manage optimize strategies.</p>
                        </div>
                    }
                    type="warning"
                    dismissible={false}
                />
            </div>
        );
    }

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleOptimizeAction = async () => {
        if (!formData.heading.trim()) {
            const errorMsg = '❌ Heading is required';
            if (setMessage) setMessage(errorMsg);
            else setLocalMessage(errorMsg);
            return;
        }

        // Check if description has content (remove HTML tags for validation)
        const descriptionText = formData.description.replace(/<[^>]*>/g, '').trim();
        if (!descriptionText) {
            const errorMsg = '❌ Description is required';
            if (setMessage) setMessage(errorMsg);
            else setLocalMessage(errorMsg);
            return;
        }

        try {
            setLoading(true);

            const strategyData = {
                heading: formData.heading.trim(),
                description: formData.description.trim()
            };

            const response = await optimizeStrategyAPI.create(strategyData);

            if (response.data.success) {
                const successMsg = '✅ Strategy created successfully!';
                if (setMessage) setMessage(successMsg);
                else setLocalMessage(successMsg);

                // Reset form
                setFormData({
                    heading: '',
                    description: ''
                });

                // Refresh strategies list
                await fetchStrategies();
            }
        } catch (error) {
            console.error('Error creating strategy:', error);
            const errorMsg = `❌ Failed to create strategy. ${error.response?.data?.message || error.message}`;
            if (setMessage) setMessage(errorMsg);
            else setLocalMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteStrategy = async (strategyId) => {
        if (!window.confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await optimizeStrategyAPI.delete(strategyId);

            if (response.data.success) {
                const successMsg = '✅ Strategy deleted successfully!';
                if (setMessage) setMessage(successMsg);
                else setLocalMessage(successMsg);

                // Refresh strategies list
                await fetchStrategies();
            }
        } catch (error) {
            console.error('Error deleting strategy:', error);
            const errorMsg = `❌ Failed to delete strategy. ${error.response?.data?.message || error.message}`;
            if (setMessage) setMessage(errorMsg);
            else setLocalMessage(errorMsg);
        }
    };

    // Edit functionality handlers
    const handleEditStrategy = (strategy) => {
        setEditingStrategyId(strategy._id);
        setEditFormData({
            heading: strategy.heading,
            description: strategy.description
        });
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingStrategyId(null);
        setEditFormData({
            heading: '',
            description: ''
        });
    };

    const handleUpdateStrategy = async () => {
        if (!editFormData.heading.trim() || !editFormData.description.trim()) {
            const errorMsg = '❌ Please fill in all fields';
            if (setMessage) setMessage(errorMsg);
            else setLocalMessage(errorMsg);
            return;
        }

        try {
            setLoading(true);
            const response = await optimizeStrategyAPI.update(editingStrategyId, editFormData);

            if (response.data.success) {
                const successMsg = '✅ Strategy updated successfully!';
                if (setMessage) setMessage(successMsg);
                else setLocalMessage(successMsg);

                // Reset edit state
                handleCancelEdit();

                // Refresh strategies list
                await fetchStrategies();
            }
        } catch (error) {
            console.error('Error updating strategy:', error);
            const errorMsg = `❌ Failed to update strategy. ${error.response?.data?.message || error.message}`;
            if (setMessage) setMessage(errorMsg);
            else setLocalMessage(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">
                                🎯 Optimize Strategy Management
                            </h2>

                            {/* Show local message if exists */}
                            {message && (
                                <Alert
                                    message={message}
                                    type={message.includes('❌') ? 'danger' : 'success'}
                                    onClose={() => setLocalMessage('')}
                                />
                            )}

                            {/* Create Strategy Form */}
                            <div className="mb-4">
                                <h4>Create New Strategy</h4>

                                {/* Heading Input */}
                                <div className="mb-3">
                                    <label htmlFor="heading" className="form-label">
                                        <strong>Heading *</strong>
                                    </label>
                                    <input
                                        type="text"
                                        id="heading"
                                        className="form-control"
                                        placeholder="Enter strategy heading..."
                                        value={formData.heading}
                                        onChange={(e) => handleInputChange('heading', e.target.value)}
                                        maxLength={200}
                                    />
                                    <div className="form-text">
                                        {formData.heading.length}/200 characters
                                    </div>
                                </div>

                                {/* Description ReactQuill Editor */}
                                <div className="mb-3">
                                    <label className="form-label">
                                        <strong>Description *</strong>
                                    </label>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(value) => handleInputChange('description', value)}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter strategy description..."
                                        style={{ minHeight: '200px' }}
                                    />
                                </div>

                                {/* Action Button */}
                                <div className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-primary btn-lg px-4"
                                        onClick={handleOptimizeAction}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Creating Strategy...
                                            </>
                                        ) : (
                                            '📝 Create Strategy'
                                        )}
                                    </button>
                                </div>
                            </div>

                            <hr />

                            {/* Strategies List */}
                            <div className="mt-4">
                                <h4>Manage Strategies</h4>
                                <p className="text-muted">
                                    Create, edit, and manage your optimize strategies here.
                                </p>

                                {fetchingStrategies ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading strategies...</span>
                                        </div>
                                        <p className="mt-2">Loading strategies...</p>
                                    </div>
                                ) : strategies.length === 0 ? (
                                    <div className="text-center py-4">
                                        <div className="text-muted">
                                            <i className="fas fa-info-circle fa-2x mb-2"></i>
                                            <p>No strategies found. Create your first strategy above!</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="row">
                                        {strategies.map((strategy) => (
                                            <div key={strategy._id} className="col-md-6 mb-3">
                                                <div className="card h-100">
                                                    <div className="card-header">
                                                        <h5 className="mb-0">{strategy.heading}</h5>
                                                    </div>
                                                    <div className="card-body">
                                                        <div
                                                            className="strategy-description mb-3"
                                                            dangerouslySetInnerHTML={{ __html: strategy.description }}
                                                            style={{ maxHeight: '120px', overflow: 'hidden' }}
                                                        />

                                                        <div className="d-flex gap-2 flex-wrap">
                                                            <button
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => handleEditStrategy(strategy)}
                                                            >
                                                                ✏️ Edit
                                                            </button>

                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => handleDeleteStrategy(strategy._id)}
                                                            >
                                                                🗑️ Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="card-footer text-muted small">
                                                        Created: {new Date(strategy.createdAt).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Strategy Modal */}
            {isEditing && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Strategy</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCancelEdit}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="editHeading" className="form-label">Heading</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="editHeading"
                                            value={editFormData.heading}
                                            onChange={(e) => setEditFormData({
                                                ...editFormData,
                                                heading: e.target.value
                                            })}
                                            placeholder="Enter strategy heading"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="editDescription" className="form-label">Description</label>
                                        <ReactQuill
                                            theme="snow"
                                            value={editFormData.description}
                                            onChange={(value) => setEditFormData({
                                                ...editFormData,
                                                description: value
                                            })}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Enter strategy description..."
                                            style={{ height: '200px', marginBottom: '50px' }}
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCancelEdit}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleUpdateStrategy}
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Strategy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OptimizeStrategy;
