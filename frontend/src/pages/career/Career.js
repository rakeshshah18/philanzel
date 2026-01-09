import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../../components/Alert';
import api from '../../services/api';
const getImageURL = (filename) => {
    const baseURL = process.env.NODE_ENV === 'production' ? 'https://philanzel-backend.onrender.com' : 'http://localhost:8000';
    const fullURL = `${baseURL}/uploads/images/${filename}`;
    console.log('Generated image URL:', fullURL);
    return fullURL;
};
const Career = () => {
    const { isAuthenticated } = useAuth();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [careerPosts, setCareerPosts] = useState([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [postFormData, setPostFormData] = useState({
        heading: '',
        description: '',
        image: null
    });
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('content');

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: '' });
        }, 5000);
    };
    const fetchCareerPosts = async () => {
        try {
            const response = await api.get('/career-posts');
            if (response.data.status === 'success') {
                console.log('Career posts fetched:', response.data.data);
                response.data.data.forEach((post, index) => {
                    console.log(`Post ${index + 1} image:`, post.image);
                });
                setCareerPosts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching career posts:', error);
            showAlert('Failed to fetch career posts', 'error');
        }
    };
    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/user/applications');
            if (response.data.status === 'success') {
                setApplications(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            showAlert('Failed to fetch applications', 'error');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (isAuthenticated) {
            fetchCareerPosts();
            fetchApplications();
        }
    }, [isAuthenticated]);
    const handlePostFormChange = (e) => {
        const { name, value, files } = e.target;
        setPostFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };
    const handlePostFormSubmit = async (e) => {
        e.preventDefault();
        if (!postFormData.heading.trim() || !postFormData.description.trim()) {
            showAlert('Heading and description are required', 'error');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('heading', postFormData.heading.trim());
            formData.append('description', postFormData.description.trim());

            if (postFormData.image) {
                formData.append('image', postFormData.image);
            }
            if (editingPost) {
                const response = await api.put(`/admin/career-posts/${editingPost._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data.status === 'success') {
                    showAlert('Career post updated successfully', 'success');
                    fetchCareerPosts();
                    resetPostForm();
                }
            } else {
                const response = await api.post('/admin/career-posts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data.status === 'success') {
                    showAlert('Career post created successfully', 'success');
                    fetchCareerPosts();
                    resetPostForm();
                }
            }
        } catch (error) {
            console.error('Error submitting post form:', error);
            const errorMessage = error.response?.data?.message || 'Failed to save career post';
            showAlert(errorMessage, 'error');
        }
    };
    const resetPostForm = () => {
        setPostFormData({ heading: '', description: '', image: null });
        setEditingPost(null);
        setShowPostForm(false);
    };
    const handleEditPost = (post) => {
        setPostFormData({
            heading: post.heading,
            description: post.description,
            image: null
        });
        setEditingPost(post);
        setShowPostForm(true);
    };
    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this career post?')) {
            return;
        }
        try {
            const response = await api.delete(`/admin/career-posts/${postId}`);
            if (response.data.status === 'success') {
                showAlert('Career post deleted successfully', 'success');
                fetchCareerPosts();
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete career post';
            showAlert(errorMessage, 'error');
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const handleDownloadResume = (resumeInfo, applicantName) => {
        if (resumeInfo && resumeInfo.filename) {
            const link = document.createElement('a');
            link.href = `/uploads/${resumeInfo.filename}`;
            link.download = `${applicantName}_resume_${resumeInfo.originalName}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };
    if (!isAuthenticated) {
        return (
            <div className="container mt-5 text-center">
                <h3>Access Denied</h3>
                <p>Please login to access the admin dashboard.</p>
            </div>
        );
    }
    return (
        <div className="container-fluid mt-4">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Career Management Dashboard</h2>
                    {alert.show && (
                        <Alert
                            message={alert.message}
                            type={alert.type}
                            onClose={() => setAlert({ show: false, message: '', type: '' })}
                        />
                    )}
                    {/* Tabs */}
                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'content' ? 'active' : ''}`}
                                onClick={() => setActiveTab('content')}
                                style={{
                                    backgroundColor: activeTab === 'content' ? '#007bff' : 'transparent',
                                    color: activeTab === 'content' ? '#ffffff' : '#495057',
                                    border: activeTab === 'content' ? '1px solid #007bff' : '1px solid #a1a5a8ff',
                                    borderBottom: activeTab === 'content' ? '1px solid #007bff' : '1px solid #a4a8acff',
                                    fontWeight: activeTab === 'content' ? '600' : '400'
                                }}
                            >
                                Career Content Management
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('applications')}
                                style={{
                                    backgroundColor: activeTab === 'applications' ? '#007bff' : 'transparent',
                                    color: activeTab === 'applications' ? '#ffffff' : '#495057',
                                    border: activeTab === 'applications' ? '1px solid #007bff' : '1px solid #5d6063ff',
                                    borderBottom: activeTab === 'applications' ? '1px solid #007bff' : '1px solid #717375ff',
                                    fontWeight: activeTab === 'applications' ? '600' : '400'
                                }}
                            >
                                Job Applications ({applications.length})
                            </button>
                        </li>
                    </ul>

                    {/* Content Management Tab */}
                    {activeTab === 'content' && (
                        <div className="tab-pane">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h4>Career Page Content</h4>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowPostForm(true)}
                                >
                                    Add New Content
                                </button>
                            </div>

                            {/* Add/Edit Form */}
                            {showPostForm && (
                                <div className="card mb-4">
                                    <div className="card-header">
                                        <h5>{editingPost ? 'Edit Career Content' : 'Add New Career Content'}</h5>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handlePostFormSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="heading" className="form-label">Heading *</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="heading"
                                                    name="heading"
                                                    value={postFormData.heading}
                                                    onChange={handlePostFormChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="description" className="form-label">Description *</label>
                                                <textarea
                                                    className="form-control"
                                                    id="description"
                                                    name="description"
                                                    rows="4"
                                                    value={postFormData.description}
                                                    onChange={handlePostFormChange}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="image" className="form-label">Image</label>
                                                <input
                                                    type="file"
                                                    className="form-control"
                                                    id="image"
                                                    name="image"
                                                    accept="image/*"
                                                    onChange={handlePostFormChange}
                                                />
                                                <div className="form-text">Max file size: 5MB. Supported formats: JPG, PNG, GIF</div>
                                            </div>
                                            <div className="d-flex gap-2">
                                                <button type="submit" className="btn btn-primary">
                                                    {editingPost ? 'Update Content' : 'Create Content'}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={resetPostForm}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Career Posts List */}
                            <div className="row">
                                {careerPosts.length === 0 ? (
                                    <div className="col-12">
                                        <div className="text-center p-4">
                                            <p>No career content found. Create your first career post!</p>
                                        </div>
                                    </div>
                                ) : (
                                    careerPosts.map((post) => (
                                        <div key={post._id} className="col-md-6 col-lg-4 mb-4">
                                            <div className="card h-100">
                                                {post.image && post.image.filename ? (
                                                    <div style={{ position: 'relative' }}>
                                                        <img
                                                            src={getImageURL(post.image.filename)}
                                                            className="card-img-top"
                                                            alt={post.heading}
                                                            style={{ height: '200px', width: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e0e0e0', background: '#f8f9fa' }}
                                                            onError={(e) => {
                                                                console.error('Image failed to load:', getImageURL(post.image.filename));
                                                                console.error('Post image object:', post.image);
                                                                e.target.style.display = 'none';
                                                                // Show fallback message
                                                                const fallback = e.target.nextElementSibling;
                                                                if (fallback) fallback.style.display = 'flex';
                                                            }}
                                                            onLoad={() => {
                                                                console.log('Image loaded successfully:', getImageURL(post.image.filename));
                                                            }}
                                                        />
                                                        <div
                                                            style={{
                                                                display: 'none',
                                                                height: '200px',
                                                                backgroundColor: '#f8f9fa',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#6c757d',
                                                                fontSize: '14px',
                                                                border: '2px dashed #dee2e6'
                                                            }}
                                                        >
                                                            <div className="text-center">
                                                                <i className="fas fa-image mb-2" style={{ fontSize: '24px' }}></i>
                                                                <br />
                                                                Image not available
                                                                <br />
                                                                <small>{post.image.filename}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        style={{
                                                            height: '200px',
                                                            backgroundColor: '#f8f9fa',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#6c757d',
                                                            fontSize: '14px',
                                                            border: '2px dashed #dee2e6'
                                                        }}
                                                    >
                                                        <div className="text-center">
                                                            <i className="fas fa-image mb-2" style={{ fontSize: '24px' }}></i>
                                                            <br />
                                                            No image uploaded
                                                        </div>
                                                    </div>
                                                )}
                                                <div className="card-body d-flex flex-column ">
                                                    <h5 className="card-title">{post.heading}</h5>
                                                    <p className="card-text flex-grow-1">{post.description}</p>
                                                    <div className="mt-auto ">
                                                        <small className="text-muted">
                                                            Created: {formatDate(post.createdAt)}
                                                        </small>
                                                        <div className="mt-2">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary me-2"
                                                                onClick={() => handleEditPost(post)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleDeletePost(post._id)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Applications Tab */}
                    {activeTab === 'applications' && (
                        <div className="tab-pane">
                            <h4 className="mb-4">Job Applications</h4>

                            {loading ? (
                                <div className="text-center p-4">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : applications.length === 0 ? (
                                <div className="text-center p-4">
                                    <p>No job applications received yet.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Message</th>
                                                <th>Resume</th>
                                                <th>Applied Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map((application) => (
                                                <tr key={application._id}>
                                                    <td>{application.fullName}</td>
                                                    <td>
                                                        <a href={`mailto:${application.email}`}>
                                                            {application.email}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <a href={`tel:${application.phone}`}>
                                                            {application.phone}
                                                        </a>
                                                    </td>
                                                    <td>
                                                        <div
                                                            style={{
                                                                maxWidth: '200px',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap'
                                                            }}
                                                            title={application.message}
                                                        >
                                                            {application.message}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {application.resume ? (
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => handleDownloadResume(application.resume, application.fullName)}
                                                            >
                                                                Download
                                                            </button>
                                                        ) : (
                                                            <span className="text-muted">No resume</span>
                                                        )}
                                                    </td>
                                                    <td>{formatDate(application.createdAt)}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-info me-1"
                                                            onClick={() => {
                                                                const subject = `Regarding your job application - ${application.fullName}`;
                                                                const body = `Dear ${application.fullName},\n\nThank you for your interest in our company.\n\nBest regards,\nHR Team`;
                                                                window.open(`mailto:${application.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
                                                            }}
                                                        >
                                                            Reply
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Custom CSS for tab styling */}
            <style jsx>{`
                .nav-link:hover {
                    background-color: #e9ecef !important;
                    color: #495057 !important;
                    transition: all 0.2s ease;
                }
                
                .nav-link.active:hover {
                    background-color: #0056b3 !important;
                    color: #ffffff !important;
                }
                
                .nav-tabs .nav-link {
                    border-top-left-radius: 0.375rem;
                    border-top-right-radius: 0.375rem;
                    margin-right: 2px;
                }
                
                .nav-tabs {
                    border-bottom: 2px solid #dee2e6;
                }
            `}</style>
        </div>
    );
};

export default Career;