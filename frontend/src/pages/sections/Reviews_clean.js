import React, { useState, useEffect } from 'react';
import Alert from '../../components/Alert';
import { reviewSectionsAPI } from '../../services/api';

const Reviews = () => {
    const [reviewSections, setReviewSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingReviewData, setEditingReviewData] = useState(null);
    const [showReviewEditModal, setShowReviewEditModal] = useState(false);
    const [message, setMessage] = useState('');

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

    const getStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <i
                key={i}
                className={`fas fa-star ${i < rating ? 'text-warning' : 'text-muted'}`}
            ></i>
        ));
    };

    // Individual review management functions
    const editIndividualReview = (sectionId, reviewIndex) => {
        const section = reviewSections.find(s => s._id === sectionId);
        if (section && section.reviews[reviewIndex]) {
            setEditingReviewData({
                sectionId,
                reviewIndex,
                review: { ...section.reviews[reviewIndex] }
            });
            setShowReviewEditModal(true);
        }
    };

    const toggleReviewVisibility = async (sectionId, reviewIndex) => {
        try {
            setLoading(true);
            const section = reviewSections.find(s => s._id === sectionId);
            if (section) {
                const updatedReviews = [...section.reviews];
                updatedReviews[reviewIndex].isVisible = !updatedReviews[reviewIndex].isVisible;

                await reviewSectionsAPI.update(sectionId, {
                    ...section,
                    reviews: updatedReviews
                });

                setMessage('✅ Review visibility updated successfully!');
                await fetchReviewSections();
            }
        } catch (error) {
            console.error('Error updating review visibility:', error);
            setMessage(`❌ Failed to update review visibility. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteIndividualReview = async (sectionId, reviewIndex) => {
        if (!window.confirm('Are you sure you want to delete this review?')) {
            return;
        }

        try {
            setLoading(true);
            const section = reviewSections.find(s => s._id === sectionId);
            if (section) {
                const updatedReviews = section.reviews.filter((_, index) => index !== reviewIndex);

                await reviewSectionsAPI.update(sectionId, {
                    ...section,
                    reviews: updatedReviews
                });

                setMessage('✅ Review deleted successfully!');
                await fetchReviewSections();
            }
        } catch (error) {
            console.error('Error deleting review:', error);
            setMessage(`❌ Failed to delete review. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const saveIndividualReview = async () => {
        if (!editingReviewData) return;

        try {
            setLoading(true);
            const section = reviewSections.find(s => s._id === editingReviewData.sectionId);
            if (section) {
                const updatedReviews = [...section.reviews];
                updatedReviews[editingReviewData.reviewIndex] = editingReviewData.review;

                await reviewSectionsAPI.update(editingReviewData.sectionId, {
                    ...section,
                    reviews: updatedReviews
                });

                setMessage('✅ Review updated successfully!');
                setShowReviewEditModal(false);
                setEditingReviewData(null);
                await fetchReviewSections();
            }
        } catch (error) {
            console.error('Error updating review:', error);
            setMessage(`❌ Failed to update review. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewEditChange = (field, value) => {
        setEditingReviewData(prev => ({
            ...prev,
            review: {
                ...prev.review,
                [field]: value
            }
        }));
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">
                                <i className="fas fa-star me-2"></i>
                                Review Sections
                            </h4>
                        </div>
                        <div className="card-body">
                            {message && (
                                <Alert
                                    message={message}
                                    type={message.startsWith('✅') ? 'success' : 'danger'}
                                    onClose={() => setMessage('')}
                                />
                            )}

                            {/* Review Sections List */}
                            <div className="row">
                                {loading && reviewSections.length === 0 ? (
                                    <div className="col-12 text-center py-4">
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                        <p className="mt-2">Loading review sections...</p>
                                    </div>
                                ) : reviewSections.length === 0 ? (
                                    <div className="col-12 text-center py-5">
                                        <i className="fas fa-star fa-3x text-muted mb-3"></i>
                                        <h5 className="text-muted">No Review Sections Found</h5>
                                        <p className="text-muted">No review sections available at the moment.</p>
                                    </div>
                                ) : (
                                    reviewSections.map((section) => (
                                        <div key={section._id} className="col-12 mb-4">
                                            <div className="card h-100 shadow-sm">
                                                <div className="card-header d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <h5 className="mb-1">{section.heading}</h5>
                                                        <div className="d-flex align-items-center">
                                                            <span className="badge bg-info me-2">{section.reviewProvider}</span>
                                                            <div className="me-2">
                                                                {getStars(Math.round(section.averageRating || 0))}
                                                            </div>
                                                            <span className="text-muted">
                                                                {(section.averageRating || 0).toFixed(1)}
                                                                ({(section.reviews?.filter(r => r.isVisible)?.length || 0)} reviews)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <p className="card-text">{section.description}</p>

                                                    {section.writeReviewButton?.isEnabled && (
                                                        <div className="mb-3">
                                                            <a
                                                                href={section.writeReviewButton.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                <i className="fas fa-pen me-2"></i>
                                                                {section.writeReviewButton.text}
                                                            </a>
                                                        </div>
                                                    )}

                                                    {section.reviews && section.reviews.length > 0 && (
                                                        <div>
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <h6 className="mb-0">
                                                                    What Clients Say?
                                                                    <span className="badge bg-primary ms-2">
                                                                        {section.reviews.filter(r => r.isVisible).length} reviews
                                                                    </span>
                                                                </h6>
                                                                <small className="text-muted">
                                                                    Average: {section.averageRating?.toFixed(1) || '0.0'} ⭐
                                                                </small>
                                                            </div>
                                                            <div className="row">
                                                                {section.reviews.map((review, index) => (
                                                                    <div key={index} className="col-md-4 mb-3">
                                                                        <div className="card border-light position-relative">
                                                                            <div className="card-body p-3">
                                                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                                                    <div className="d-flex align-items-center flex-grow-1">
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
                                                                                            <h6 className="mb-0 small">{review.userName}</h6>
                                                                                            <div className="small">
                                                                                                {getStars(review.rating)}
                                                                                            </div>
                                                                                        </div>
                                                                                        {review.reviewProviderLogo && (
                                                                                            <img
                                                                                                src={review.reviewProviderLogo}
                                                                                                alt="Provider"
                                                                                                style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                                                                                                onError={(e) => {
                                                                                                    e.target.style.display = 'none';
                                                                                                }}
                                                                                            />
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="dropdown">
                                                                                        <button
                                                                                            className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                                                                            type="button"
                                                                                            data-bs-toggle="dropdown"
                                                                                            style={{ fontSize: '0.75rem' }}
                                                                                        >
                                                                                            <i className="fas fa-ellipsis-v"></i>
                                                                                        </button>
                                                                                        <ul className="dropdown-menu">
                                                                                            <li>
                                                                                                <button
                                                                                                    className="dropdown-item"
                                                                                                    onClick={() => editIndividualReview(section._id, index)}
                                                                                                >
                                                                                                    <i className="fas fa-edit me-2"></i>Edit Review
                                                                                                </button>
                                                                                            </li>
                                                                                            <li>
                                                                                                <button
                                                                                                    className="dropdown-item"
                                                                                                    onClick={() => toggleReviewVisibility(section._id, index)}
                                                                                                >
                                                                                                    <i className={`fas fa-eye${review.isVisible ? '-slash' : ''} me-2`}></i>
                                                                                                    {review.isVisible ? 'Hide' : 'Show'} Review
                                                                                                </button>
                                                                                            </li>
                                                                                            <li><hr className="dropdown-divider" /></li>
                                                                                            <li>
                                                                                                <button
                                                                                                    className="dropdown-item text-danger"
                                                                                                    onClick={() => deleteIndividualReview(section._id, index)}
                                                                                                >
                                                                                                    <i className="fas fa-trash me-2"></i>Delete Review
                                                                                                </button>
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>
                                                                                </div>
                                                                                <p className="small mb-2 text-muted">
                                                                                    {review.reviewText}
                                                                                </p>
                                                                                <div className="d-flex justify-content-between align-items-center">
                                                                                    <div>
                                                                                        {review.isVerified && (
                                                                                            <span className="badge bg-success">
                                                                                                <i className="fas fa-check-circle me-1"></i>
                                                                                                Verified
                                                                                            </span>
                                                                                        )}
                                                                                        {!review.isVisible && (
                                                                                            <span className="badge bg-secondary ms-1">
                                                                                                <i className="fas fa-eye-slash me-1"></i>
                                                                                                Hidden
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    <small className="text-muted">
                                                                                        {new Date(review.reviewDate).toLocaleDateString()}
                                                                                    </small>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Individual Review Edit Modal */}
            {showReviewEditModal && editingReviewData && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-edit me-2"></i>
                                    Edit Review
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowReviewEditModal(false);
                                        setEditingReviewData(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">User Name *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={editingReviewData.review.userName}
                                            onChange={(e) => handleReviewEditChange('userName', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Rating *</label>
                                        <select
                                            className="form-select"
                                            value={editingReviewData.review.rating}
                                            onChange={(e) => handleReviewEditChange('rating', parseInt(e.target.value))}
                                        >
                                            <option value={5}>5 Stars</option>
                                            <option value={4}>4 Stars</option>
                                            <option value={3}>3 Stars</option>
                                            <option value={2}>2 Stars</option>
                                            <option value={1}>1 Star</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">User Profile Photo URL</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            value={editingReviewData.review.userProfilePhoto || ''}
                                            onChange={(e) => handleReviewEditChange('userProfilePhoto', e.target.value)}
                                            placeholder="https://example.com/profile.jpg"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Review Provider Logo URL</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            value={editingReviewData.review.reviewProviderLogo || ''}
                                            onChange={(e) => handleReviewEditChange('reviewProviderLogo', e.target.value)}
                                            placeholder="https://example.com/logo.png"
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Review Text *</label>
                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={editingReviewData.review.reviewText}
                                        onChange={(e) => handleReviewEditChange('reviewText', e.target.value)}
                                        required
                                        placeholder="Enter the review text..."
                                    ></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={editingReviewData.review.isVerified}
                                                onChange={(e) => handleReviewEditChange('isVerified', e.target.checked)}
                                            />
                                            <label className="form-check-label">
                                                <i className="fas fa-check-circle me-1"></i>
                                                Verified Review
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={editingReviewData.review.isVisible}
                                                onChange={(e) => handleReviewEditChange('isVisible', e.target.checked)}
                                            />
                                            <label className="form-check-label">
                                                <i className="fas fa-eye me-1"></i>
                                                Visible to Users
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowReviewEditModal(false);
                                        setEditingReviewData(null);
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={saveIndividualReview}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-save me-2"></i>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
