import React, { useState, useEffect } from 'react';
import { reviewSectionsAPI } from '../../services/api';
import Alert from '../../components/Alert';

const ReviewSections = ({ setMessage }) => {
    const [reviewSections, setReviewSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        reviewProvider: 'Google',
        writeReviewButton: {
            text: 'Write Review',
            url: '',
            isEnabled: true
        },
        reviews: [
            {
                userName: '',
                userProfilePhoto: '',
                reviewProviderLogo: '',
                rating: 5,
                reviewText: '',
                isVerified: false,
                isVisible: true
            }
        ],
        isActive: true,
        displayOrder: 0
    });

    useEffect(() => {
        fetchReviewSections();
    }, []);

    const fetchReviewSections = async () => {
        try {
            setLoading(true);
            const response = await reviewSectionsAPI.getAll();
            setReviewSections(response.data.data || []);
        } catch (error) {
            console.error('Error fetching review sections:', error);
            setMessage(`❌ Failed to fetch review sections. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.heading.trim() || !formData.description.trim() || !formData.writeReviewButton.url.trim()) {
            setMessage('❌ Please fill in heading, description, and write review URL');
            return;
        }

        // Validate reviews
        const validReviews = formData.reviews.filter(review =>
            review.userName.trim() && review.reviewText.trim() && review.reviewProviderLogo.trim()
        );

        if (validReviews.length === 0) {
            setMessage('❌ Please add at least one complete review');
            return;
        }

        try {
            setLoading(true);

            const submitData = {
                ...formData,
                reviews: validReviews
            };

            if (isEditing) {
                await reviewSectionsAPI.update(editingId, submitData);
                setMessage('✅ Review section updated successfully!');
            } else {
                await reviewSectionsAPI.create(submitData);
                setMessage('✅ Review section created successfully!');
            }

            resetForm();
            await fetchReviewSections();
        } catch (error) {
            console.error('Error saving review section:', error);
            setMessage(`❌ Failed to save review section. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (section) => {
        setFormData({
            heading: section.heading,
            description: section.description,
            reviewProvider: section.reviewProvider,
            writeReviewButton: section.writeReviewButton,
            reviews: section.reviews.length > 0 ? section.reviews : [
                {
                    userName: '',
                    userProfilePhoto: '',
                    reviewProviderLogo: '',
                    rating: 5,
                    reviewText: '',
                    isVerified: false,
                    isVisible: true
                }
            ],
            isActive: section.isActive,
            displayOrder: section.displayOrder
        });
        setIsEditing(true);
        setEditingId(section._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this review section?')) {
            return;
        }

        try {
            setLoading(true);
            await reviewSectionsAPI.delete(id);
            setMessage('✅ Review section deleted successfully!');
            await fetchReviewSections();
        } catch (error) {
            console.error('Error deleting review section:', error);
            setMessage(`❌ Failed to delete review section. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            heading: '',
            description: '',
            reviewProvider: 'Google',
            writeReviewButton: {
                text: 'Write Review',
                url: '',
                isEnabled: true
            },
            reviews: [
                {
                    userName: '',
                    userProfilePhoto: '',
                    reviewProviderLogo: '',
                    rating: 5,
                    reviewText: '',
                    isVerified: false,
                    isVisible: true
                }
            ],
            isActive: true,
            displayOrder: 0
        });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.startsWith('writeReviewButton.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                writeReviewButton: {
                    ...prev.writeReviewButton,
                    [field]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleReviewChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            reviews: prev.reviews.map((review, i) =>
                i === index ? { ...review, [field]: value } : review
            )
        }));
    };

    const addReview = () => {
        setFormData(prev => ({
            ...prev,
            reviews: [...prev.reviews, {
                userName: '',
                userProfilePhoto: '',
                reviewProviderLogo: '',
                rating: 5,
                reviewText: '',
                isVerified: false,
                isVisible: true
            }]
        }));
    };

    const removeReview = (index) => {
        if (formData.reviews.length > 1) {
            setFormData(prev => ({
                ...prev,
                reviews: prev.reviews.filter((_, i) => i !== index)
            }));
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <i
                key={i}
                className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}
                style={{ fontSize: '0.9rem' }}
            ></i>
        ));
    };

    const getProviderBadgeColor = (provider) => {
        const colors = {
            'Google': 'bg-danger',
            'Facebook': 'bg-primary',
            'Trustpilot': 'bg-success',
            'Yelp': 'bg-warning text-dark',
            'Custom': 'bg-secondary'
        };
        return colors[provider] || 'bg-secondary';
    };

    if (loading && reviewSections.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Loading review sections...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header with Add Button */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h5 className="mb-1">⭐ Review Sections Management</h5>
                    <p className="text-muted mb-0">Manage customer reviews and testimonials</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                    disabled={loading}
                >
                    <i className="fas fa-plus me-2"></i>
                    Add Review Section
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="card border-primary mb-4">
                    <div className="card-header bg-light">
                        <h6 className="mb-0">
                            {isEditing ? '✏️ Edit Review Section' : '➕ Add New Review Section'}
                        </h6>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            {/* Basic Information */}
                            <div className="row mb-4">
                                <div className="col-md-8">
                                    <label htmlFor="heading" className="form-label">Section Heading *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="heading"
                                        name="heading"
                                        value={formData.heading}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="e.g., Customer Reviews"
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="reviewProvider" className="form-label">Review Provider *</label>
                                    <select
                                        className="form-select"
                                        id="reviewProvider"
                                        name="reviewProvider"
                                        value={formData.reviewProvider}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="Google">Google</option>
                                        <option value="Facebook">Facebook</option>
                                        <option value="Trustpilot">Trustpilot</option>
                                        <option value="Yelp">Yelp</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="form-label">Description *</label>
                                <textarea
                                    className="form-control"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="3"
                                    placeholder="Brief description of the review section"
                                ></textarea>
                            </div>

                            {/* Write Review Button */}
                            <div className="mb-4">
                                <h6>Write Review Button Configuration</h6>
                                <div className="row">
                                    <div className="col-md-4">
                                        <label htmlFor="writeReviewButton.text" className="form-label">Button Text</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="writeReviewButton.text"
                                            value={formData.writeReviewButton.text}
                                            onChange={handleInputChange}
                                            placeholder="Write Review"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label htmlFor="writeReviewButton.url" className="form-label">Review URL *</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="writeReviewButton.url"
                                            value={formData.writeReviewButton.url}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="https://g.page/r/yourBusinessId/review"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <div className="form-check mt-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="writeReviewButton.isEnabled"
                                                checked={formData.writeReviewButton.isEnabled}
                                                onChange={handleInputChange}
                                            />
                                            <label className="form-check-label">
                                                Enabled
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Reviews Section */}
                            <div className="mb-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">Customer Reviews</h6>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={addReview}
                                    >
                                        <i className="fas fa-plus me-1"></i>
                                        Add Review
                                    </button>
                                </div>

                                {formData.reviews.map((review, index) => (
                                    <div key={index} className="border rounded p-3 mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="mb-0">Review {index + 1}</h6>
                                            {formData.reviews.length > 1 && (
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => removeReview(index)}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            )}
                                        </div>

                                        <div className="row">
                                            <div className="col-md-3">
                                                <label className="form-label">User Name *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={review.userName}
                                                    onChange={(e) => handleReviewChange(index, 'userName', e.target.value)}
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Profile Photo URL</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    value={review.userProfilePhoto}
                                                    onChange={(e) => handleReviewChange(index, 'userProfilePhoto', e.target.value)}
                                                    placeholder="https://example.com/profile.jpg"
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Provider Logo URL *</label>
                                                <input
                                                    type="url"
                                                    className="form-control"
                                                    value={review.reviewProviderLogo}
                                                    onChange={(e) => handleReviewChange(index, 'reviewProviderLogo', e.target.value)}
                                                    placeholder="https://example.com/google-logo.png"
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Rating</label>
                                                <select
                                                    className="form-select"
                                                    value={review.rating}
                                                    onChange={(e) => handleReviewChange(index, 'rating', parseInt(e.target.value))}
                                                >
                                                    <option value={5}>5 Stars</option>
                                                    <option value={4}>4 Stars</option>
                                                    <option value={3}>3 Stars</option>
                                                    <option value={2}>2 Stars</option>
                                                    <option value={1}>1 Star</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-3">
                                            <label className="form-label">Review Text *</label>
                                            <textarea
                                                className="form-control"
                                                value={review.reviewText}
                                                onChange={(e) => handleReviewChange(index, 'reviewText', e.target.value)}
                                                rows="3"
                                                placeholder="Write the customer's review..."
                                            ></textarea>
                                        </div>

                                        <div className="row mt-3">
                                            <div className="col-md-6">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={review.isVerified}
                                                        onChange={(e) => handleReviewChange(index, 'isVerified', e.target.checked)}
                                                    />
                                                    <label className="form-check-label">
                                                        Verified Review
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={review.isVisible}
                                                        onChange={(e) => handleReviewChange(index, 'isVisible', e.target.checked)}
                                                    />
                                                    <label className="form-check-label">
                                                        Visible on Website
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Settings */}
                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleInputChange}
                                        />
                                        <label className="form-check-label">
                                            Active Section
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="displayOrder" className="form-label">Display Order</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="displayOrder"
                                        name="displayOrder"
                                        value={formData.displayOrder}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="d-flex gap-2">
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
                                            {isEditing ? 'Update Section' : 'Create Section'}
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetForm}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Review Sections List */}
            {reviewSections.length === 0 && !loading ? (
                <div className="text-center py-5">
                    <i className="fas fa-star fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No Review Sections Found</h5>
                    <p className="text-muted">Create your first review section to get started.</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Add Review Section
                    </button>
                </div>
            ) : (
                <div className="row">
                    {reviewSections.map((section) => (
                        <div key={section._id} className="col-lg-6 mb-4">
                            <div className="card h-100 shadow-sm">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="mb-1">{section.heading}</h6>
                                        <span className={`badge ${getProviderBadgeColor(section.reviewProvider)} me-2`}>
                                            {section.reviewProvider}
                                        </span>
                                        {section.isActive ? (
                                            <span className="badge bg-success">Active</span>
                                        ) : (
                                            <span className="badge bg-secondary">Inactive</span>
                                        )}
                                    </div>
                                    <div className="dropdown">
                                        <button
                                            className="btn btn-sm btn-outline-secondary"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                        >
                                            <i className="fas fa-ellipsis-v"></i>
                                        </button>
                                        <ul className="dropdown-menu">
                                            <li>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleEdit(section)}
                                                >
                                                    <i className="fas fa-edit me-2"></i>
                                                    Edit
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="dropdown-item text-danger"
                                                    onClick={() => handleDelete(section._id)}
                                                >
                                                    <i className="fas fa-trash me-2"></i>
                                                    Delete
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p className="text-muted small mb-3">{section.description}</p>

                                    {/* Overall Rating */}
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="me-3">
                                            <div className="d-flex align-items-center">
                                                {renderStars(Math.round(section.averageRating))}
                                                <span className="ms-2 fw-bold">{section.averageRating?.toFixed(1) || '0.0'}</span>
                                            </div>
                                            <small className="text-muted">{section.totalReviewCount} reviews</small>
                                        </div>
                                        {section.writeReviewButton?.isEnabled && (
                                            <a
                                                href={section.writeReviewButton.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline-primary"
                                            >
                                                {section.writeReviewButton.text}
                                            </a>
                                        )}
                                    </div>

                                    {/* Sample Reviews */}
                                    {section.reviews?.filter(review => review.isVisible).slice(0, 2).map((review, index) => (
                                        <div key={index} className="border-top pt-3 mt-3">
                                            <div className="d-flex align-items-start">
                                                {review.userProfilePhoto && (
                                                    <img
                                                        src={review.userProfilePhoto}
                                                        alt={review.userName}
                                                        className="rounded-circle me-2"
                                                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                                <div className="flex-grow-1">
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        <h6 className="mb-1 small">{review.userName}</h6>
                                                        <div className="d-flex align-items-center">
                                                            {renderStars(review.rating)}
                                                            {review.isVerified && (
                                                                <i className="fas fa-check-circle text-success ms-2" title="Verified"></i>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="small text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                                                        {review.reviewText.length > 100
                                                            ? `${review.reviewText.substring(0, 100)}...`
                                                            : review.reviewText
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {section.reviews?.filter(review => review.isVisible).length > 2 && (
                                        <div className="text-center mt-3">
                                            <small className="text-muted">
                                                +{section.reviews.filter(review => review.isVisible).length - 2} more reviews
                                            </small>
                                        </div>
                                    )}
                                </div>
                                <div className="card-footer text-muted small">
                                    <i className="fas fa-clock me-1"></i>
                                    Created: {new Date(section.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewSections;
