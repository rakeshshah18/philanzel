import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../../components/Alert';
import api from '../../services/api';

// Helper function to get the correct image URL
const getImageURL = (filename) => {
    const baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000';
    return `${baseURL}/uploads/images/${filename}`;
};

const AdminCareer = () => {
    // Restore missing functions
    // Apply all filters (search + date range)
    const applyFilters = (applicationsData, searchValue, dateFilter) => {
        let result = applicationsData;
        // Apply search filter
        if (searchValue) {
            result = result.filter(app =>
                app.fullName?.toLowerCase().includes(searchValue.toLowerCase()) ||
                app.email?.toLowerCase().includes(searchValue.toLowerCase()) ||
                app.phone?.includes(searchValue) ||
                app.message?.toLowerCase().includes(searchValue.toLowerCase())
            );
        }
        // Apply date range filter
        if (dateFilter.startDate || dateFilter.endDate) {
            result = result.filter(app => {
                const appDate = new Date(app.createdAt);
                const startDate = dateFilter.startDate ? new Date(dateFilter.startDate) : null;
                const endDate = dateFilter.endDate ? new Date(dateFilter.endDate + 'T23:59:59') : null;
                if (startDate && endDate) {
                    return appDate >= startDate && appDate <= endDate;
                } else if (startDate) {
                    return appDate >= startDate;
                } else if (endDate) {
                    return appDate <= endDate;
                }
                return true;
            });
        }
        const sortedResult = sortApplications(result);
        setFilteredApplications(sortedResult);
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
        applyFilters(applications, '', dateRange);
    };

    // Clear date filter
    const clearDateFilter = () => {
        setDateRange({ startDate: '', endDate: '' });
        applyFilters(applications, searchTerm, { startDate: '', endDate: '' });
    };

    // Handle date range change
    const handleDateRangeChange = (field, value) => {
        const newDateRange = { ...dateRange, [field]: value };
        setDateRange(newDateRange);
        applyFilters(applications, searchTerm, newDateRange);
    };

    // Sorting functionality
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };
    const { isAuthenticated } = useAuth();
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    // Add custom styles for date filters and proper backgrounds
    const filterStyles = {
        dateFilterCard: {
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
        },
        summaryCard: {
            backgroundColor: '#fff',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        dateInput: {
            backgroundColor: '#fff',
            border: '1px solid #ced4da',
            borderRadius: '4px',
            fontSize: '0.875rem'
        },
        tableHeader: {
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #dee2e6'
        },
        tableRow: {
            backgroundColor: '#fff',
            transition: 'background-color 0.2s ease'
        },
        tableRowHover: {
            backgroundColor: '#f8f9fa'
        }
    };

    // Career Post Content State (CRUD for heading, description, image)
    const [careerPosts, setCareerPosts] = useState([]);
    const [showPostForm, setShowPostForm] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [postFormData, setPostFormData] = useState({
        heading: '',
        description: '',
        image: null
    });

    // Career Applications State (Table view of form submissions)
    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchLoading, setSearchLoading] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [showDateFilter, setShowDateFilter] = useState(true);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('content'); // 'content' or 'applications'

    const showAlert = (message, type) => {
        setAlert({ show: true, message, type });
        setTimeout(() => {
            setAlert({ show: false, message: '', type: '' });
        }, 5000);
    };

    // Fetch career posts (content management)
    const fetchCareerPosts = async () => {
        try {
            const response = await api.get('/career-posts');
            if (response.data.status === 'success') {
                setCareerPosts(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching career posts:', error);
            showAlert('Failed to fetch career posts', 'error');
        }
    };

    // Fetch career applications (form submissions)
    const fetchApplications = async (search = '') => {
        try {
            setLoading(search === '');
            setSearchLoading(search !== '');

            let url = '/user/applications';
            if (search.trim()) {
                url += `?search=${encodeURIComponent(search.trim())}`;
            }

            const response = await api.get(url);
            if (response.data.status === 'success') {
                const applicationsData = response.data.data;
                setApplications(applicationsData);
                setFilteredApplications(applicationsData);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            showAlert('Failed to fetch applications', 'error');
        } finally {
            setLoading(false);
            setSearchLoading(false);
        }
    };

    // Handle search functionality
    const handleSearch = async (searchValue) => {
        setSearchTerm(searchValue);

        if (searchValue.trim() === '') {
            // If search is empty, apply only date filter with current sorting
            applyFilters(applications, '', dateRange);
            return;
        }

        // Debounce search to avoid too many API calls
        clearTimeout(window.searchTimeout);
        window.searchTimeout = setTimeout(async () => {
            try {
                setSearchLoading(true);
                const response = await api.get(`/user/applications?search=${encodeURIComponent(searchValue.trim())}`);
                if (response.data.status === 'success') {
                    // Apply both search and date filters
                    applyFilters(response.data.data, searchValue, dateRange);
                }
            } catch (error) {
                console.error('Error searching applications:', error);
                // Fallback to client-side filtering
                applyFilters(applications, searchValue, dateRange);
            } finally {
                setSearchLoading(false);
            }
        }, 300); // 300ms debounce
    };

    // Clear search
    <style jsx>{`
                .active-career-tab {
                    color: #fff;
                    background-color: #262b30ff;
                    border-color: #555758ff #75797eff #696767ff !important;
                    font-weight: 600 !important;
                    border-bottom: 1px solid #696565ff !important;
                }
                .inactive-career-tab {
                    color: #495057 !important;
                    background-color: transparent !important;
                    border-color: #646668ff !important;
                    font-weight: 400 !important;
                }
                .active-career-tab:hover,
                .active-career-tab:focus {
                    color: #262b30ff !important;
                    background-color: #5f5b5bff !important;
                }
                .inactive-career-tab:hover,
                .inactive-career-tab:focus {
                    color: #495057 !important;
                    background-color: #636464ff !important;
                    border-color: #696a6bff !important;
                }
                .sortable-header:hover {
                    background-color: #e9ecef !important;
                    transition: background-color 0.2s ease;
                }
                .table tbody tr:hover {
                    background-color: #f8f9fa !important;
                }
                .card {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border: 1px solid #e9ecef;
                }
                .date-filter-active {
                    border-left: 4px solid #007bff;
                }
                .filter-summary {
                    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                }
                .table {
                    border-collapse: separate;
                    border-spacing: 0;
                }
                .table th {
                    border-top: none;
                    border-bottom: 2px solid #dee2e6;
                    background-color: #f8f9fa;
                    color: #495057;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.875rem;
                    letter-spacing: 0.5px;
                }
                .table td {
                    border-top: 1px solid #f1f3f4;
                    padding: 12px;
                    vertical-align: middle;
                }
                .btn:hover {
                    transform: translateY(-1px);
                    transition: all 0.2s ease;
                    color: #495057;
                }
                .btn:active {
                    color: #495057 !important;
                    background-color: transparent !important;
                    border-color: #646668ff !important;
                    font-weight: 400 !important;
                }
                .form-control:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }
            `}</style>

    // Sort applications based on current sort config
    const sortApplications = (applicationsToSort) => {
        if (!sortConfig.key) return applicationsToSort;

        return [...applicationsToSort].sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            // Handle different data types
            switch (sortConfig.key) {
                case 'fullName':
                    aValue = aValue?.toLowerCase() || '';
                    bValue = bValue?.toLowerCase() || '';
                    break;
                case 'createdAt':
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                    break;
                case 'email':
                    aValue = aValue?.toLowerCase() || '';
                    bValue = bValue?.toLowerCase() || '';
                    break;
                default:
                    aValue = aValue || '';
                    bValue = bValue || '';
            }

            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Get sort icon for column headers
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) {
            return <i className="fas fa-sort text-muted ms-1"></i>;
        }
        return sortConfig.direction === 'asc'
            ? <i className="fas fa-sort-up text-primary ms-1"></i>
            : <i className="fas fa-sort-down text-primary ms-1"></i>;
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchCareerPosts();
            fetchApplications();
        }
    }, [isAuthenticated]);

    // Update filtered applications when applications, sort, or filters change
    useEffect(() => {
        applyFilters(applications, searchTerm, dateRange);
    }, [applications, sortConfig, searchTerm, dateRange]);

    // Handle post form input changes
    const handlePostFormChange = (e) => {
        const { name, value, files } = e.target;
        setPostFormData(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
    };

    // Submit career post form (Create/Update)
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
                // Update existing post
                const response = await api.put(`/admin/career-posts/${editingPost._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.status === 'success') {
                    showAlert('Career post updated successfully', 'success');
                    fetchCareerPosts();
                    resetPostForm();
                }
            } else {
                // Create new post
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

    // Reset post form
    const resetPostForm = () => {
        setPostFormData({ heading: '', description: '', image: null });
        setEditingPost(null);
        setShowPostForm(false);
    };

    // Edit career post
    const handleEditPost = (post) => {
        setPostFormData({
            heading: post.heading,
            description: post.description,
            image: null
        });
        setEditingPost(post);
        setShowPostForm(true);
    };

    // Delete career post
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

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Download resume
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
            <style>
                {`
                .search-container .input-group {
                    transition: all 0.3s ease;
                }
                .search-container .input-group:focus-within {
                    transform: scale(1.02);
                    box-shadow: 0 4px 8px rgba(0,123,255,0.15);
                }
                .table tbody tr:hover {
                    background-color: rgba(0,123,255,0.05);
                }
                .search-highlight {
                    background-color: #fff3cd;
                    padding: 2px 4px;
                    border-radius: 3px;
                }
                .sortable-header {
                    transition: all 0.2s ease;
                    position: relative;
                }
                .sortable-header:hover {
                    background-color: rgba(255,255,255,0.1) !important;
                    transform: translateY(-1px);
                }
                .sortable-header:active {
                    transform: translateY(0);
                }
                .table-dark .sortable-header:hover {
                    background-color: rgba(255,255,255,0.15) !important;
                }
                .fas.fa-sort,
                .fas.fa-sort-up,
                .fas.fa-sort-down {
                    font-size: 0.8em;
                    opacity: 0.7;
                }
                .fas.fa-sort-up.text-primary,
                .fas.fa-sort-down.text-primary {
                    opacity: 1;
                }
                `}
            </style>
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4">Career Management Dashboard</h2>

                    {/* Alert */}
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
                                style={activeTab === 'content' ? { backgroundColor: '#2f323aff', fontWeight: 600 } : {}}
                            >
                                Career Content Management
                            </button>
                        </li>
                        <li className="nav-item">
                            <button
                                className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                                onClick={() => setActiveTab('applications')}
                                style={activeTab === 'applications' ? { backgroundColor: '#2f323aff', fontWeight: 600 } : {}}
                            >
                                Job Applications ({searchTerm ? filteredApplications.length : applications.length})
                                {searchTerm && (
                                    <small className="text-muted ms-1">
                                        of {applications.length}
                                    </small>
                                )}
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
                                                {post.image && (
                                                    <img
                                                        src={getImageURL(post.image.filename)}
                                                        className="card-img-top"
                                                        alt={post.heading}
                                                        style={{ height: '200px', objectFit: 'cover' }}
                                                    />
                                                )}
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{post.heading}</h5>
                                                    <p className="card-text flex-grow-1">{post.description}</p>
                                                    <div className="mt-auto">
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
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="d-flex align-items-center">
                                    <h4 className="mb-0 me-3">Job Applications</h4>
                                    {sortConfig.key && (
                                        <small className="text-muted">
                                            Sorted by {sortConfig.key === 'fullName' ? 'Name' :
                                                sortConfig.key === 'createdAt' ? 'Date' :
                                                    sortConfig.key === 'email' ? 'Email' : sortConfig.key}
                                            ({sortConfig.key === 'createdAt'
                                                ? (sortConfig.direction === 'asc' ? 'Oldest-Newest' : 'Newest-Oldest')
                                                : (sortConfig.direction === 'asc' ? 'A-Z' : 'Z-A')})
                                            <button
                                                className="btn btn-sm btn-outline-secondary ms-2"
                                                onClick={() => setSortConfig({ key: 'createdAt', direction: 'desc' })}
                                                title="Reset to default sorting"
                                            >
                                                <i className="fas fa-undo"></i>
                                            </button>
                                        </small>
                                    )}
                                </div>

                                {/* Search Functionality */}
                                <div className="search-container" style={{ minWidth: '300px' }}>
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by name, email, phone, or message..."
                                            value={searchTerm}
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            type="button"
                                            onClick={clearSearch}
                                            disabled={!searchTerm}
                                        >
                                            {searchLoading ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                            ) : (
                                                <i className="fas fa-times"></i>
                                            )}
                                        </button>
                                        <button className="btn btn-primary" type="button" disabled>
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </div>
                                    {searchTerm && (
                                        <small className="text-muted">
                                            Found {filteredApplications.length} of {applications.length} applications
                                        </small>
                                    )}
                                </div>
                            </div>

                            {/* Filter Controls Row */}
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    {/* Date Range Filter */}
                                    <div className="card" style={filterStyles.dateFilterCard}>
                                        <div className="card-body p-3">
                                            <div className="d-flex align-items-center justify-content-between mb-2">
                                                <h6 className="mb-0 text-secondary">
                                                    <i className="fas fa-calendar-alt me-2"></i>
                                                    Date Range Filter
                                                </h6>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => setShowDateFilter(!showDateFilter)}
                                                    title={showDateFilter ? "Hide date filter" : "Show date filter"}
                                                >
                                                    <i className={`fas fa-chevron-${showDateFilter ? 'up' : 'down'}`}></i>
                                                </button>
                                            </div>

                                            {showDateFilter && (
                                                <div>
                                                    <div className="row g-2">
                                                        <div className="col-6">
                                                            <label className="form-label small">From Date</label>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-sm"
                                                                style={filterStyles.dateInput}
                                                                value={dateRange.startDate}
                                                                onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                                                                max={dateRange.endDate || new Date().toISOString().split('T')[0]}
                                                            />
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="form-label small">To Date</label>
                                                            <input
                                                                type="date"
                                                                className="form-control form-control-sm"
                                                                style={filterStyles.dateInput}
                                                                value={dateRange.endDate}
                                                                onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                                                                min={dateRange.startDate}
                                                                max={new Date().toISOString().split('T')[0]}
                                                            />
                                                        </div>
                                                    </div>

                                                    {(dateRange.startDate || dateRange.endDate) && (
                                                        <div className="mt-2 d-flex justify-content-between align-items-center">
                                                            <small className="text-success">
                                                                <i className="fas fa-filter me-1"></i>
                                                                {dateRange.startDate && dateRange.endDate ?
                                                                    `${dateRange.startDate} to ${dateRange.endDate}` :
                                                                    dateRange.startDate ?
                                                                        `From ${dateRange.startDate}` :
                                                                        `Until ${dateRange.endDate}`
                                                                }
                                                            </small>
                                                            <button
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={clearDateFilter}
                                                                title="Clear date filter"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    {/* Filter Summary */}
                                    <div className="card" style={filterStyles.summaryCard}>
                                        <div className="card-body p-3">
                                            <h6 className="mb-2 text-secondary">
                                                <i className="fas fa-info-circle me-2"></i>
                                                Results Summary
                                            </h6>
                                            <div className="d-flex justify-content-between">
                                                <span className="small">Showing:</span>
                                                <strong className="text-primary">{filteredApplications.length}</strong>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <span className="small">Total:</span>
                                                <strong className="text-muted">{applications.length}</strong>
                                            </div>
                                            {(searchTerm || dateRange.startDate || dateRange.endDate) && (
                                                <div className="mt-2">
                                                    <small className="text-info">
                                                        <i className="fas fa-filter me-1"></i>
                                                        Filters active
                                                    </small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="text-center p-4">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : filteredApplications.length === 0 ? (
                                <div className="text-center p-4">
                                    {searchTerm ? (
                                        <div>
                                            <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                            <p>No applications found matching "{searchTerm}"</p>
                                            <button className="btn btn-outline-primary" onClick={clearSearch}>
                                                Clear Search
                                            </button>
                                        </div>
                                    ) : (
                                        <p>No job applications received yet.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover" style={{ backgroundColor: '#fff' }}>
                                        <thead style={filterStyles.tableHeader}>
                                            <tr>
                                                <th
                                                    className="sortable-header"
                                                    onClick={() => handleSort('fullName')}
                                                    style={{ cursor: 'pointer', userSelect: 'none', padding: '12px', fontWeight: '600' }}
                                                >
                                                    Name
                                                    {getSortIcon('fullName')}
                                                </th>
                                                <th
                                                    className="sortable-header"
                                                    onClick={() => handleSort('email')}
                                                    style={{ cursor: 'pointer', userSelect: 'none', padding: '12px', fontWeight: '600' }}
                                                >
                                                    Email
                                                    {getSortIcon('email')}
                                                </th>
                                                <th style={{ padding: '12px', fontWeight: '600' }}>Phone</th>
                                                <th style={{ padding: '12px', fontWeight: '600' }}>Message</th>
                                                <th style={{ padding: '12px', fontWeight: '600' }}>Resume</th>
                                                <th
                                                    className="sortable-header"
                                                    onClick={() => handleSort('createdAt')}
                                                    style={{ cursor: 'pointer', userSelect: 'none', padding: '12px', fontWeight: '600' }}
                                                >
                                                    Applied Date
                                                    {getSortIcon('createdAt')}
                                                </th>
                                                <th style={{ padding: '12px', fontWeight: '600' }}>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredApplications.map((application) => (
                                                <tr
                                                    key={application._id}
                                                    style={filterStyles.tableRow}
                                                    onMouseEnter={(e) => e.target.parentElement.style.backgroundColor = filterStyles.tableRowHover.backgroundColor}
                                                    onMouseLeave={(e) => e.target.parentElement.style.backgroundColor = filterStyles.tableRow.backgroundColor}
                                                >
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

            {/* Custom CSS Styles */}
            <style jsx>{`
                .sortable-header:hover {
                    background-color: #484b4eff !important;
                    transition: background-color 0.2s ease;
                }
                
                .table tbody tr:hover {
                    background-color: #f8f9fa !important;
                }
                
                .card {
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border: 1px solid #e9ecef;
                }
                
                .date-filter-active {
                    border-left: 4px solid #007bff;
                }
                
                .filter-summary {
                    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                }
                
                .table {
                    border-collapse: separate;
                    border-spacing: 0;
                }
                
                .table th {
                    border-top: none;
                    border-bottom: 2px solid #dee2e6;
                    background-color: #f8f9fa;
                    color: #495057;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.875rem;
                    letter-spacing: 0.5px;
                }
                
                .table td {
                    border-top: 1px solid #f1f3f4;
                    padding: 12px;
                    vertical-align: middle;
                }
                
                .btn:hover {
                    transform: translateY(-1px);
                    transition: all 0.2s ease;
                    color: #495057;
                }
                .btn:active {
                    color: #495057 !important;
                    background-color: transparent !important;
                    border-color: #646668ff !important;
                    font-weight: 400 !important;
                }

                .form-control:focus {
                    border-color: #007bff;
                    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
                }
            `}</style>
        </div>
    );
};

export default AdminCareer;
