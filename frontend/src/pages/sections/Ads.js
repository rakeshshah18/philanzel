import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Alert from '../../components/Alert';
import { adsSectionsAPI } from '../../services/api';

const Ads = () => {
    const [adsSections, setAdsSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingData, setEditingData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newAdsData, setNewAdsData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        linkUrl: '',
        hashtag: '',
        backgroundColor: '#ffffff',
        isVisible: true
    });
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [message, setMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        limit: 10
    });

    // Quill editor configuration
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image'],
            ['clean']
        ],
    };

    const quillFormats = [
        'header', 'bold', 'italic', 'underline', 'strike',
        'color', 'background', 'list', 'bullet', 'align',
        'link', 'image'
    ];

    useEffect(() => {
        fetchAdsSections();
    }, []);

    const fetchAdsSections = async () => {
        try {
            setLoading(true);
            const response = await adsSectionsAPI.getAll();
            setAdsSections(response.data.data || []);
        } catch (error) {
            console.error('Error fetching ads sections:', error);
            setMessage(`❌ Failed to fetch ads sections. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchWithPagination = async (page = 1) => {
        try {
            setLoading(true);
            const response = await adsSectionsAPI.getPaginated(page, pagination.limit);
            setAdsSections(response.data.data || []);
            setPagination({
                currentPage: response.data.currentPage || 1,
                totalPages: response.data.totalPages || 1,
                totalItems: response.data.totalItems || 0,
                limit: response.data.limit || 10
            });
        } catch (error) {
            console.error('Error fetching paginated ads sections:', error);
            setMessage(`❌ Failed to fetch ads sections. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            fetchAdsSections();
            return;
        }

        try {
            setLoading(true);
            const response = await adsSectionsAPI.search(searchQuery);
            setAdsSections(response.data.data || []);
        } catch (error) {
            console.error('Error searching ads sections:', error);
            setMessage(`❌ Search failed. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const addAdsSection = () => {
        setNewAdsData({
            title: '',
            description: '',
            imageUrl: '',
            linkUrl: '',
            hashtag: '',
            backgroundColor: '#ffffff',
            isVisible: true
        });
        setSelectedImageFile(null);
        setImagePreview('');
        setShowAddModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const saveNewAdsSection = async () => {
        if (!newAdsData.title.trim()) {
            setMessage('❌ Title is required');
            return;
        }

        try {
            setLoading(true);

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('title', newAdsData.title);
            formData.append('description', newAdsData.description);
            formData.append('hashtag', newAdsData.hashtag);
            formData.append('imageUrl', newAdsData.imageUrl);
            formData.append('linkUrl', newAdsData.linkUrl);
            formData.append('backgroundColor', newAdsData.backgroundColor);
            formData.append('isVisible', newAdsData.isVisible);

            // Add image file if selected
            if (selectedImageFile) {
                formData.append('image', selectedImageFile);
            }

            await adsSectionsAPI.createWithFile(formData);
            setMessage('✅ Ads section created successfully!');
            setShowAddModal(false);
            setSelectedImageFile(null);
            setImagePreview('');
            await fetchAdsSections();
        } catch (error) {
            console.error('Error creating ads section:', error);
            setMessage(`❌ Failed to create ads section. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const editAdsSection = (adsSection) => {
        // Handle backward compatibility with old field names
        setEditingData({
            ...adsSection,
            imageUrl: adsSection.imageUrl || adsSection.image || (adsSection.link && adsSection.link.includes('image') ? adsSection.link : ''),
            linkUrl: adsSection.linkUrl || (!adsSection.imageUrl && !adsSection.image && adsSection.link && !adsSection.link.includes('image') ? adsSection.link : '')
        });
        setSelectedImageFile(null);
        setImagePreview('');
        setShowEditModal(true);
    };

    const saveEditedAdsSection = async () => {
        if (!editingData.title.trim()) {
            setMessage('❌ Title is required');
            return;
        }

        try {
            setLoading(true);

            if (selectedImageFile) {
                // If new image file selected, use FormData
                const formData = new FormData();
                formData.append('title', editingData.title);
                formData.append('description', editingData.description);
                formData.append('hashtag', editingData.hashtag);
                formData.append('imageUrl', editingData.imageUrl);
                formData.append('linkUrl', editingData.linkUrl);
                formData.append('backgroundColor', editingData.backgroundColor);
                formData.append('isVisible', editingData.isVisible);
                formData.append('image', selectedImageFile);

                await adsSectionsAPI.updateWithFile(editingData._id, formData);
            } else {
                // No new file, use regular update
                await adsSectionsAPI.update(editingData._id, editingData);
            }

            setMessage('✅ Ads section updated successfully!');
            setShowEditModal(false);
            setEditingData(null);
            setSelectedImageFile(null);
            setImagePreview('');
            await fetchAdsSections();
        } catch (error) {
            console.error('Error updating ads section:', error);
            setMessage(`❌ Failed to update ads section. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const toggleVisibility = async (id, currentVisibility) => {
        try {
            setLoading(true);
            const adsSection = adsSections.find(ads => ads._id === id);
            if (adsSection) {
                await adsSectionsAPI.update(id, {
                    ...adsSection,
                    isVisible: !currentVisibility
                });
                setMessage('✅ Visibility updated successfully!');
                await fetchAdsSections();
            }
        } catch (error) {
            console.error('Error updating visibility:', error);
            setMessage(`❌ Failed to update visibility. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const deleteAdsSection = async (id) => {
        if (!window.confirm('Are you sure you want to delete this ads section?')) {
            return;
        }

        try {
            setLoading(true);
            await adsSectionsAPI.delete(id);
            setMessage('✅ Ads section deleted successfully!');
            await fetchAdsSections();
        } catch (error) {
            console.error('Error deleting ads section:', error);
            setMessage(`❌ Failed to delete ads section. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNewAdsChange = (field, value) => {
        setNewAdsData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditChange = (field, value) => {
        setEditingData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className="container-fluid py-4" style={{ background: document.body.classList.contains('dark-mode') ? '#181818' : 'linear-gradient(135deg, #d9cc9fff 0%, #dfa35fff 100%)', minHeight: '100vh' }}>
            {message && <Alert message={message} onClose={() => setMessage('')} />}

            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header text-dark d-flex justify-content-between align-items-center"
                            style={{
                                background: document.body.classList.contains('dark-mode') ? '#222' : '#ff9f31ff',
                            }}
                        >
                            <h4 className="mb-0">
                                <i className="fas fa-bullhorn me-2"></i>
                                Ads Management
                            </h4>
                            <button
                                className="btn btn-dark"
                                onClick={addAdsSection}
                                disabled={loading}
                            >
                                <i className="fas fa-plus me-2"></i>
                                Add New Ads Section
                            </button>
                        </div>

                        <div className="card-body"
                            style={{
                                background: document.body.classList.contains('dark-mode') ? '#222' : 'linear-gradient(135deg, #e0d4abff 0%, #dab183ff 100%)',
                            }}
                        >
                            {/* Search Bar */}
                            <div className="row mb-3">
                                <div className="col-md-8">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Search by title, hashtag..."
                                            style={{
                                                backgroundColor: document.body.classList.contains('dark-mode') ? '#333' : '#d3c29fff'
                                            }}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                        <button
                                            className="btn btn-outline-secondary"
                                            onClick={handleSearch}
                                            disabled={loading}
                                        >
                                            <i className="bi bi-search"
                                                style={{
                                                    backgroundColor: document.body.classList.contains('dark-mode') ? '#333' : '#d3c29fff'
                                                }}
                                            ></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={() => {
                                            setSearchQuery('');
                                            fetchAdsSections();
                                        }}
                                    >
                                        <i className="bi bi-x me-2"></i>
                                        Clear Search
                                    </button>
                                </div>
                            </div>

                            {loading && (
                                <div className="text-center py-3">
                                    <div className="spinner-border text-warning" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            )}

                            {!loading && adsSections.length === 0 && (
                                <div className="text-center py-5">
                                    <i className="fas fa-bullhorn fa-3x text-muted mb-3"></i>
                                    <h5>No ads sections found</h5>
                                    <p className="text-muted">
                                        {searchQuery ? 'No ads sections match your search criteria.' : 'Start by creating your first ads section.'}
                                    </p>
                                </div>
                            )}

                            {/* Ads Sections List */}
                            {!loading && adsSections.length > 0 && (
                                <div className="row justify-content-center" >
                                    {adsSections.map((adsSection) => {
                                        const isDarkMode = document.body.classList.contains('dark-mode');
                                        return (
                                            <div key={adsSection._id} className="col-12 col-sm-6 col-lg-4 mb-4 d-flex justify-content-center">
                                                <div
                                                    className="card shadow-lg h-100 w-100"
                                                    style={{
                                                        borderRadius: '18px',
                                                        background: isDarkMode
                                                            ? '#222'
                                                            : 'linear-gradient(135deg, #d9cc9fff 0%, #dfa35fff 100%)',
                                                        color: isDarkMode ? '#fff' : '#212529',
                                                        minWidth: 340,
                                                        maxWidth: 420,
                                                        boxShadow: isDarkMode ? '0 2px 16px rgba(0,0,0,0.7)' : '0 2px 16px rgba(200,200,200,0.2)'
                                                    }}
                                                >
                                                    <div className="card-body d-flex flex-column" style={{ padding: '1.2rem', color: isDarkMode ? '#fff' : '#212529' }}>
                                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                                            <h5 className="card-title mb-1" style={{ fontWeight: 700, background: isDarkMode ? '#333' : '#fffbe6', color: isDarkMode ? '#ffe066' : '#212529', borderRadius: '8px', padding: '0.4rem 1rem', display: 'inline-block' }}>{adsSection.title}</h5>
                                                            <div className="dropdown">
                                                                <button
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                    type="button"
                                                                    data-bs-toggle="dropdown"
                                                                >
                                                                    <i className="bi bi-three-dots-vertical"></i>
                                                                </button>
                                                                <ul className="dropdown-menu">
                                                                    <li>
                                                                        <button
                                                                            className="dropdown-item"
                                                                            onClick={() => editAdsSection(adsSection)}
                                                                        >
                                                                            <i className="fas fa-edit me-2"></i>Edit
                                                                        </button>
                                                                    </li>
                                                                    <li>
                                                                        <button
                                                                            className="dropdown-item"
                                                                            onClick={() => toggleVisibility(adsSection._id, adsSection.isVisible)}
                                                                        >
                                                                            <i className={`fas fa-${adsSection.isVisible ? 'eye-slash' : 'eye'} me-2`}></i>
                                                                            {adsSection.isVisible ? 'Hide' : 'Show'}
                                                                        </button>
                                                                    </li>
                                                                    <li><hr className="dropdown-divider" /></li>
                                                                    <li>
                                                                        <button
                                                                            className="dropdown-item text-danger"
                                                                            onClick={() => deleteAdsSection(adsSection._id)}
                                                                        >
                                                                            <i className="fas fa-trash me-2"></i>Delete
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        {adsSection.hashtag && (
                                                            <span className="badge bg-primary mb-2" style={{ fontSize: '0.95rem', background: isDarkMode ? '#ffe066' : '#007bff', color: isDarkMode ? '#222' : '#fff' }}>#{adsSection.hashtag}</span>
                                                        )}

                                                        {(adsSection.imageUrl || adsSection.image || adsSection.link) && (
                                                            <div className="mb-2">
                                                                <img
                                                                    src={
                                                                        (adsSection.imageUrl && adsSection.imageUrl.startsWith('/uploads')
                                                                            ? `http://localhost:8000${adsSection.imageUrl}`
                                                                            : adsSection.imageUrl) ||
                                                                        adsSection.image ||
                                                                        adsSection.link
                                                                    }
                                                                    alt={adsSection.title}
                                                                    className="img-fluid rounded"
                                                                    style={{ maxHeight: '120px', width: '100%', objectFit: 'cover', boxShadow: isDarkMode ? '0 2px 8px #000' : '0 2px 8px #ccc' }}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}

                                                        <div
                                                            className="card-text"
                                                            dangerouslySetInnerHTML={{ __html: adsSection.description }}
                                                            style={{ maxHeight: '100px', overflow: 'hidden', fontSize: '1.05rem' }}
                                                        />

                                                        {(adsSection.linkUrl || (!adsSection.imageUrl && !adsSection.image && adsSection.link)) && (
                                                            <div className="mt-2">
                                                                <a
                                                                    href={adsSection.linkUrl || adsSection.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    style={{ fontWeight: 600 }}
                                                                >
                                                                    <i className="fas fa-external-link-alt me-1"></i>
                                                                    Visit Link
                                                                </a>
                                                            </div>
                                                        )}

                                                        <div className="mt-2 d-flex justify-content-between align-items-center">
                                                            <small className="text-muted" style={{ color: isDarkMode ? '#ffe066' : '#6c757d' }}>
                                                                Created: {new Date(adsSection.createdAt).toLocaleDateString()}
                                                            </small>
                                                            <span className={`badge ${adsSection.isVisible ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.95rem', background: adsSection.isVisible ? (isDarkMode ? '#28a745' : '#28a745') : (isDarkMode ? '#444' : '#6c757d'), color: '#fff' }}>
                                                                {adsSection.isVisible ? 'Visible' : 'Hidden'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Add New Ads Section Modal */}
            {showAddModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add New Ads Section</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowAddModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newAdsData.title}
                                        onChange={(e) => handleNewAdsChange('title', e.target.value)}
                                        placeholder="Enter ads section title"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <ReactQuill
                                        value={newAdsData.description}
                                        onChange={(value) => handleNewAdsChange('description', value)}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter ads description..."
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Image</label>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small">Upload Image File</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small">Or Paste Image URL</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                value={newAdsData.imageUrl}
                                                onChange={(e) => handleNewAdsChange('imageUrl', e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                    </div>
                                    {(imagePreview || newAdsData.imageUrl) && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview || newAdsData.imageUrl}
                                                alt="Preview"
                                                className="img-thumbnail"
                                                style={{ maxHeight: '100px', maxWidth: '150px' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">External Link (Optional)</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        value={newAdsData.linkUrl}
                                        onChange={(e) => handleNewAdsChange('linkUrl', e.target.value)}
                                        placeholder="https://example.com - Where users go when they click the ad"
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Hashtag</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={newAdsData.hashtag}
                                                onChange={(e) => handleNewAdsChange('hashtag', e.target.value)}
                                                placeholder="trending"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Background Color</label>
                                            <input
                                                type="color"
                                                className="form-control form-control-color"
                                                value={newAdsData.backgroundColor}
                                                onChange={(e) => handleNewAdsChange('backgroundColor', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={newAdsData.isVisible}
                                            onChange={(e) => handleNewAdsChange('isVisible', e.target.checked)}
                                        />
                                        <label className="form-check-label">
                                            Visible to users
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={saveNewAdsSection}
                                    disabled={loading}
                                >
                                    {loading ? 'Creating...' : 'Create Ads Section'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Ads Section Modal */}
            {showEditModal && editingData && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Ads Section</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowEditModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Title *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editingData.title}
                                        onChange={(e) => handleEditChange('title', e.target.value)}
                                        placeholder="Enter ads section title"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <ReactQuill
                                        value={editingData.description}
                                        onChange={(value) => handleEditChange('description', value)}
                                        modules={quillModules}
                                        formats={quillFormats}
                                        placeholder="Enter ads description..."
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Image</label>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small">Upload New Image File</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-muted small">Or Paste Image URL</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                value={editingData.imageUrl}
                                                onChange={(e) => handleEditChange('imageUrl', e.target.value)}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        </div>
                                    </div>
                                    {(imagePreview || editingData.imageUrl) && (
                                        <div className="mt-2">
                                            <img
                                                src={imagePreview || editingData.imageUrl}
                                                alt="Preview"
                                                className="img-thumbnail"
                                                style={{ maxHeight: '100px', maxWidth: '150px' }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">External Link (Optional)</label>
                                    <input
                                        type="url"
                                        className="form-control"
                                        value={editingData.linkUrl}
                                        onChange={(e) => handleEditChange('linkUrl', e.target.value)}
                                        placeholder="https://example.com - Where users go when they click the ad"
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Hashtag</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editingData.hashtag}
                                                onChange={(e) => handleEditChange('hashtag', e.target.value)}
                                                placeholder="trending"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="mb-3">
                                            <label className="form-label">Background Color</label>
                                            <input
                                                type="color"
                                                className="form-control form-control-color"
                                                value={editingData.backgroundColor}
                                                onChange={(e) => handleEditChange('backgroundColor', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={editingData.isVisible}
                                            onChange={(e) => handleEditChange('isVisible', e.target.checked)}
                                        />
                                        <label className="form-check-label">
                                            Visible to users
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-warning"
                                    onClick={saveEditedAdsSection}
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Ads Section'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ads;
