import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
const Events = () => {
    const { admin } = useAuth();
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [showPhotoModal, setShowPhotoModal] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);
    const fetchImages = async () => {
        try {
            const res = await axios.get('api/event-images');
            setImages(res.data.data || []);
        } catch {
            setImages([]);
        }
    };
    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadError('');
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('images', files[i]);
        }
        try {
            await axios.post('api/event-images/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchImages();
        } catch (err) {
            setUploadError('Failed to upload images');
        }
        setUploading(false);
    };
    const getStatusBadge = (status) => {
        const baseClasses = "badge fs-6 px-3 py-2";
        switch (status) {
            case 'upcoming':
                return `${baseClasses} bg-success`;
            case 'completed':
                return `${baseClasses} bg-secondary`;
            default:
                return `${baseClasses} bg-primary`;
        }
    };

    const getCategoryColor = (category) => {
        const colors = {
            'Conference': '#e74c3c',
            'Workshop': '#3498db',
            'Seminar': '#9b59b6',
            'Meetup': '#f39c12',
            'Forum': '#2ecc71',
            'Bootcamp': '#34495e'
        };
        return colors[category] || '#6c757d';
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    return (
        <div className="container py-4">
            <div className="row mb-4">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <h2 className="mb-0">
                        <i className="bi bi-calendar-event me-3" style={{ color: '#0d6efd' }}></i>
                        Philanzel Events Gallery
                    </h2>
                    {admin && (
                        <div>
                            <label className="btn btn-primary mb-0">
                                <i className="bi bi-upload me-2"></i>Upload Image
                                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploading} />
                            </label>
                            {uploading && <span className="ms-2 text-muted">Uploading...</span>}
                            {uploadError && <span className="ms-2 text-danger">{uploadError}</span>}
                        </div>
                    )}
                </div>
            </div>
            <div className="row g-4">
                {images.length === 0 && (
                    <div className="col-12 text-center text-muted">No event images uploaded yet.</div>
                )}
                {images.map(img => (
                    <div key={img._id} className="col-6 col-md-4 col-lg-3">
                        <div className="card h-100 shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }}
                            onClick={() => { setSelectedImage(img); setShowPhotoModal(true); }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
                        >
                            <img src={img.imageUrl} alt="Event" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                        </div>
                    </div>
                ))}
            </div>
            {showPhotoModal && selectedImage && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title">
                                    <i className="bi bi-image me-2" style={{ color: '#0d6efd' }}></i>
                                    Event Image
                                </h5>
                                <button type="button" className="btn-close" onClick={() => { setShowPhotoModal(false); setSelectedImage(null); }}></button>
                            </div>
                            <div className="modal-body p-4 text-center">
                                <img src={selectedImage.imageUrl} alt="Event" style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: '12px' }} />
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" className="btn btn-secondary" onClick={() => { setShowPhotoModal(false); setSelectedImage(null); }} style={{ borderRadius: '25px' }}>
                                    <i className="bi bi-x-circle me-2"></i>Close
                                </button>
                                {admin && (
                                    <button type="button" className="btn btn-danger" style={{ borderRadius: '25px' }}
                                        onClick={async () => {
                                            await axios.delete(`/api/event-images/${selectedImage._id}`);
                                            setShowPhotoModal(false); setSelectedImage(null); fetchImages();
                                        }}
                                    >
                                        <i className="bi bi-trash me-2"></i>Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Events;