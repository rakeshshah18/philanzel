import React, { useState, useEffect } from 'react';
import Alert from '../../components/Alert';
import { homePageAPI, ourTrackAPI, servicesAPI, tabbingServicesSettingsAPI } from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Helper function to get full image URL
const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;

    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }

    // If it's a relative URL from backend, prepend the base URL
    const baseUrl = process.env.NODE_ENV === 'production'
        ? ''
        : 'http://localhost:8000';

    // Handle backend upload paths correctly
    if (imageUrl.startsWith('/uploads/')) {
        return `${baseUrl}${imageUrl}`;
    }

    // Handle legacy paths
    if (imageUrl.startsWith('/images/')) {
        return `${baseUrl}${imageUrl}`;
    }

    // Default case - add uploads prefix if missing
    return `${baseUrl}/uploads/images/${imageUrl}`;
};

const Home = () => {
    const [homePages, setHomePages] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [trackMessage, setTrackMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        button: { text: '', link: '' },
        image: { file: null, altText: '' }
    });

    // OurTrack state
    const [trackData, setTrackData] = useState(null);
    const [trackLoading, setTrackLoading] = useState(false);
    const [showTrackForm, setShowTrackForm] = useState(false);
    const [isTrackEditing, setIsTrackEditing] = useState(false);
    const [trackFormData, setTrackFormData] = useState({
        yearExp: '',
        totalExpert: '',
        planningDone: '',
        happyCustomers: ''
    });

    useEffect(() => {
        // Add a small delay to ensure backend is ready and DOM is mounted
        const initializeData = async () => {
            try {
                // Wait for component to mount properly
                await new Promise(resolve => setTimeout(resolve, 100));
                await fetchHomePages();
                // Wait a bit before fetching track data to avoid overwhelming the API
                setTimeout(() => {
                    fetchTrackData();
                }, 300);
            } catch (error) {
                console.error('Error initializing data:', error);
            }
        };

        initializeData();
    }, []); const fetchHomePages = async () => {
        setFetchLoading(true);
        try {
            console.log('Fetching homepage data...');
            const response = await homePageAPI.getAll();
            console.log('Homepage API response:', response);
            if (response.data && response.data.data) {
                setHomePages(response.data.data);
                console.log('Homepage data loaded successfully:', response.data.data.length, 'items');
            }
        } catch (error) {
            console.error('Error fetching homepage content:', error);
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            setMessage(`❌ Failed to fetch homepage content. ${error.response?.data?.message || error.message}`);
        } finally {
            setFetchLoading(false);
        }
    };

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
            const submitData = new FormData();
            submitData.append('heading', formData.heading);
            submitData.append('description', formData.description);
            submitData.append('button[text]', formData.button.text);
            submitData.append('button[link]', formData.button.link);
            submitData.append('image[altText]', formData.image.altText);

            if (formData.image.file) {
                submitData.append('image', formData.image.file);
            }

            if (isEditing && editingId) {
                await homePageAPI.updateWithFile(editingId, submitData);
                setMessage('✅ Banner updated successfully!');
            } else {
                await homePageAPI.createWithFile(submitData);
                setMessage('✅ Banner created successfully!');
            }

            resetForm();
            fetchHomePages();
            setShowForm(false);

        } catch (error) {
            setMessage('❌ Failed to save banner. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            heading: '',
            description: '',
            button: { text: '', link: '' },
            image: { file: null, altText: '' }
        });
        setIsEditing(false);
        setEditingId(null);

        const fileInput = document.getElementById('image.file');
        if (fileInput) fileInput.value = '';
    };

    const handleEdit = (page) => {
        setFormData({
            heading: page.heading,
            description: page.description,
            button: {
                text: page.button?.text || '',
                link: page.button?.link || ''
            },
            image: {
                file: null,
                altText: page.image?.altText || ''
            }
        });
        setIsEditing(true);
        setEditingId(page._id);
        setShowForm(true);
        setMessage('');
    };

    const handleCancelEdit = () => {
        resetForm();
        setShowForm(false);
        setMessage('');
    };

    const deleteHomePage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this banner?')) {
            return;
        }

        try {
            await homePageAPI.delete(id);
            setHomePages(homePages.filter(page => page._id !== id));
            setMessage('✅ Banner deleted successfully!');
        } catch (error) {
            setMessage('❌ Failed to delete banner.');
        }
    };

    const handleView = (page) => {
        alert(`Title: ${page.heading}\nDescription: ${page.description}\nButton: ${page.button?.text || 'No button'} -> ${page.button?.link || 'No link'}\nAlt Text: ${page.image?.altText || 'No alt text'}`);
    };

    // OurTrack functions
    const fetchTrackData = async () => {
        setTrackLoading(true);
        try {
            const response = await ourTrackAPI.get();
            if (response.data && response.data.data) {
                setTrackData(response.data.data);
                setIsTrackEditing(true);
            } else {
                setIsTrackEditing(false);
            }
        } catch (error) {
            console.error('Error fetching track data:', error);
            // Only show error message if it's not a 404 (no data found) and not network related
            if (error.response?.status !== 404 && error.response?.status !== 0) {
                setTrackMessage('❌ Failed to fetch track record.');
            }
            setIsTrackEditing(false);
        } finally {
            setTrackLoading(false);
        }
    };

    const handleTrackChange = (e) => {
        const { name, value } = e.target;
        setTrackFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTrackSubmit = async (e) => {
        e.preventDefault();
        setTrackLoading(true);
        setMessage('');

        try {
            const submitData = {
                yearExp: parseInt(trackFormData.yearExp),
                totalExpert: parseInt(trackFormData.totalExpert),
                planningDone: parseInt(trackFormData.planningDone),
                happyCustomers: parseInt(trackFormData.happyCustomers)
            };

            for (const [key, value] of Object.entries(submitData)) {
                if (isNaN(value) || value < 0) {
                    setMessage(`❌ ${key} must be a valid positive number.`);
                    setTrackLoading(false);
                    return;
                }
            }

            let response;
            if (isTrackEditing) {
                response = await ourTrackAPI.update(submitData);
                setTrackMessage('✅ Track record updated successfully!');
            } else {
                response = await ourTrackAPI.create(submitData);
                setTrackMessage('✅ Track record created successfully!');
                setIsTrackEditing(true);
            }

            setTrackData(response.data.data);
            setShowTrackForm(false);
            resetTrackForm();

        } catch (error) {
            console.error('Error saving track data:', error);
            setTrackMessage(error.response?.data?.message || '❌ Failed to save track record.');
        } finally {
            setTrackLoading(false);
        }
    };

    const handleTrackEdit = () => {
        if (trackData) {
            setTrackFormData({
                yearExp: trackData.yearExp.toString(),
                totalExpert: trackData.totalExpert.toString(),
                planningDone: trackData.planningDone.toString(),
                happyCustomers: trackData.happyCustomers.toString()
            });
        }
        setShowTrackForm(true);
        setTrackMessage('');
    };

    const resetTrackForm = () => {
        setTrackFormData({
            yearExp: '',
            totalExpert: '',
            planningDone: '',
            happyCustomers: ''
        });
        setShowTrackForm(false);
        setTrackMessage('');
    };

    // Filter and pagination logic
    const filteredItems = homePages.filter(page =>
        page.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <div className="container-fluid px-4 py-3">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="mb-0" style={{ color: '#333' }}>Home</h2>
                    <nav style={{ fontSize: '14px' }}>
                        <span style={{ color: '#17a2b8' }}>Admin</span>
                        <span className="mx-2" style={{ color: '#6c757d' }}>›</span>
                        <span style={{ color: '#6c757d' }}>Home</span>
                    </nav>
                </div>

                {/* Action Buttons */}
                <div className="mb-3">
                    <button
                        className="btn me-2"
                        style={{
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            fontSize: '14px'
                        }}
                        onClick={() => {
                            if (isEditing) {
                                handleCancelEdit();
                            } else {
                                setShowForm(!showForm);
                            }
                        }}
                    >
                        {isEditing ? 'Cancel' : 'Add New'}
                    </button>
                    <button
                        className="btn"
                        style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '8px 16px',
                            fontSize: '14px'
                        }}
                        onClick={fetchHomePages}
                        disabled={fetchLoading}
                    >
                        {fetchLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                </div>

                {/* Success/Error Messages */}
                {message && (
                    <Alert
                        message={message}
                        type={message.includes('✅') ? 'success' : 'danger'}
                        onClose={() => setMessage('')}
                        className="mb-3"
                    />
                )}

                {/* Create/Edit Form */}
                {showForm && (
                    <div className="card mb-4" style={{ border: '1px solid #dee2e6' }}>
                        <div className="card-header" style={{ backgroundColor: '#fff', borderBottom: '1px solid #dee2e6' }}>
                            <h5 className="card-title mb-0" style={{ color: '#333' }}>
                                {isEditing ? 'Edit Banner' : 'Add New Banner'}
                            </h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="heading" className="form-label">Title *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="heading"
                                            name="heading"
                                            value={formData.heading}
                                            onChange={handleChange}
                                            placeholder="Enter title"
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="image.file" className="form-label">Image</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            id="image.file"
                                            name="image.file"
                                            onChange={handleChange}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <label htmlFor="description" className="form-label">Description *</label>
                                        <ReactQuill
                                            theme="snow"
                                            value={formData.description}
                                            onChange={(value) => setFormData({ ...formData, description: value })}
                                            placeholder="Enter description"
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                    [{ 'script': 'sub' }, { 'script': 'super' }],
                                                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                    [{ 'direction': 'rtl' }],
                                                    [{ 'color': [] }, { 'background': [] }],
                                                    [{ 'align': [] }],
                                                    ['link', 'image'],
                                                    ['clean']
                                                ]
                                            }}
                                            formats={[
                                                'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
                                                'list', 'bullet', 'indent', 'link', 'image', 'color', 'background',
                                                'align', 'script'
                                            ]}
                                            style={{
                                                minHeight: '150px'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="button.text" className="form-label">Button Text</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="button.text"
                                            name="button.text"
                                            value={formData.button.text}
                                            onChange={handleChange}
                                            placeholder="Enter button text"
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="button.link" className="form-label">Button Link</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            id="button.link"
                                            name="button.link"
                                            value={formData.button.link}
                                            onChange={handleChange}
                                            placeholder="Enter button link"
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label htmlFor="image.altText" className="form-label">Image Alt Text *</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="image.altText"
                                            name="image.altText"
                                            value={formData.image.altText}
                                            onChange={handleChange}
                                            placeholder="Enter image alt text"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={handleCancelEdit}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Main Content Card */}
                <div className="card" style={{ border: '1px solid #dee2e6' }}>
                    <div className="card-body" style={{ padding: '20px' }}>
                        {/* Section Title */}
                        <h5 className="mb-3" style={{ color: '#6c757d', fontSize: '14px', fontWeight: 'normal' }}>
                            HOME SLIDER
                        </h5>

                        {/* Controls */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="d-flex align-items-center">
                                <span className="me-2" style={{ fontSize: '14px' }}>Show</span>
                                <select
                                    className="form-select form-select-sm me-2"
                                    style={{ width: 'auto', fontSize: '14px' }}
                                    value={itemsPerPage}
                                    onChange={(e) => {
                                        setItemsPerPage(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                                <span style={{ fontSize: '14px' }}>entries</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <label className="me-2" style={{ fontSize: '14px' }}>Search:</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    style={{ width: '200px', fontSize: '14px' }}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    placeholder=""
                                />
                            </div>
                        </div>

                        {/* Table */}
                        {fetchLoading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : currentItems.length === 0 ? (
                            <div className="text-center py-5">
                                <p className="text-muted">No banners found.</p>
                            </div>
                        ) : (
                            <>
                                <div className="table-responsive">
                                    <table className="table" style={{ backgroundColor: '#454d55', color: 'white', marginBottom: '0' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#343a40' }}>
                                                <th style={{
                                                    width: '60px',
                                                    color: '#adb5bd',
                                                    fontSize: '14px',
                                                    fontWeight: 'normal',
                                                    padding: '12px 8px',
                                                    borderTop: 'none'
                                                }}>No</th>
                                                <th style={{
                                                    width: '120px',
                                                    color: '#adb5bd',
                                                    fontSize: '14px',
                                                    fontWeight: 'normal',
                                                    padding: '12px 8px',
                                                    borderTop: 'none'
                                                }}>Thumbnail</th>
                                                <th style={{
                                                    color: '#adb5bd',
                                                    fontSize: '14px',
                                                    fontWeight: 'normal',
                                                    padding: '12px 8px',
                                                    borderTop: 'none'
                                                }}>Title</th>
                                                <th style={{
                                                    color: '#adb5bd',
                                                    fontSize: '14px',
                                                    fontWeight: 'normal',
                                                    padding: '12px 8px',
                                                    borderTop: 'none'
                                                }}>Category</th>
                                                <th style={{
                                                    width: '100px',
                                                    color: '#adb5bd',
                                                    fontSize: '14px',
                                                    fontWeight: 'normal',
                                                    padding: '12px 8px',
                                                    borderTop: 'none'
                                                }}>Status</th>
                                                <th style={{
                                                    width: '150px',
                                                    color: '#adb5bd',
                                                    fontSize: '14px',
                                                    fontWeight: 'normal',
                                                    padding: '12px 8px',
                                                    borderTop: 'none'
                                                }}>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((page, index) => (
                                                <tr key={page._id} style={{ borderTop: '1px solid #565e64' }}>
                                                    <td style={{
                                                        color: '#adb5bd',
                                                        fontSize: '14px',
                                                        padding: '12px 8px',
                                                        verticalAlign: 'middle'
                                                    }}>
                                                        {startIndex + index + 1}
                                                    </td>
                                                    <td style={{ padding: '8px' }}>
                                                        {page.image?.url ? (
                                                            <img
                                                                src={getImageUrl(page.image.url)}
                                                                alt={page.image.altText}
                                                                style={{
                                                                    width: '80px',
                                                                    height: '60px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '4px'
                                                                }}
                                                                onError={(e) => {
                                                                    console.error('Image failed to load:', page.image.url);
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div
                                                            style={{
                                                                width: '80px',
                                                                height: '60px',
                                                                backgroundColor: '#6c757d',
                                                                display: page.image?.url ? 'none' : 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                fontSize: '12px',
                                                                color: 'white',
                                                                borderRadius: '4px'
                                                            }}
                                                        >
                                                            No Image
                                                        </div>
                                                    </td>
                                                    <td style={{
                                                        color: '#adb5bd',
                                                        fontSize: '14px',
                                                        padding: '12px 8px',
                                                        verticalAlign: 'middle',
                                                        maxWidth: '300px'
                                                    }}>
                                                        {page.heading}
                                                    </td>
                                                    <td style={{
                                                        color: '#adb5bd',
                                                        fontSize: '14px',
                                                        padding: '12px 8px',
                                                        verticalAlign: 'middle'
                                                    }}>
                                                        Homepage Banner
                                                    </td>
                                                    <td style={{
                                                        padding: '12px 8px',
                                                        verticalAlign: 'middle'
                                                    }}>
                                                        <span style={{
                                                            backgroundColor: '#28a745',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '12px',
                                                            fontWeight: '500'
                                                        }}>
                                                            Active
                                                        </span>
                                                    </td>
                                                    <td style={{
                                                        padding: '12px 8px',
                                                        verticalAlign: 'middle'
                                                    }}>
                                                        <div className="d-flex gap-1">
                                                            <button
                                                                style={{
                                                                    backgroundColor: '#28a745',
                                                                    border: 'none',
                                                                    color: 'white',
                                                                    padding: '6px 8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px'
                                                                }}
                                                                onClick={() => handleView(page)}
                                                                title="View Details"
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                            <button
                                                                style={{
                                                                    backgroundColor: '#17a2b8',
                                                                    border: 'none',
                                                                    color: 'white',
                                                                    padding: '6px 8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px'
                                                                }}
                                                                onClick={() => handleEdit(page)}
                                                                title="Edit"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                style={{
                                                                    backgroundColor: '#dc3545',
                                                                    border: 'none',
                                                                    color: 'white',
                                                                    padding: '6px 8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '12px'
                                                                }}
                                                                onClick={() => deleteHomePage(page._id)}
                                                                title="Delete"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="d-flex justify-content-between align-items-center mt-3">
                                    <div>
                                        <span style={{ fontSize: '14px', color: '#6c757d' }}>
                                            Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} entries
                                        </span>
                                    </div>
                                    <nav>
                                        <ul className="pagination pagination-sm mb-0">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    Previous
                                                </button>
                                            </li>
                                            {[...Array(totalPages)].map((_, i) => (
                                                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                    <button
                                                        className="page-link"
                                                        onClick={() => setCurrentPage(i + 1)}
                                                        style={{
                                                            fontSize: '14px',
                                                            backgroundColor: currentPage === i + 1 ? '#17a2b8' : 'white',
                                                            borderColor: currentPage === i + 1 ? '#17a2b8' : '#dee2e6',
                                                            color: currentPage === i + 1 ? 'white' : '#007bff'
                                                        }}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                </li>
                                            ))}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    style={{ fontSize: '14px' }}
                                                >
                                                    Next
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* OurTrack Section */}
                <div className="container-fluid py-4">
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="d-flex justify-content-between align-items-center">
                                <h2 className="h3 mb-0">
                                    <i className="fas fa-chart-line me-2"></i>
                                    Our Track Record
                                </h2>
                                {!showTrackForm && (
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={isTrackEditing ? handleTrackEdit : () => setShowTrackForm(true)}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            {isTrackEditing ? 'Edit Record' : 'Add Record'}
                                        </button>
                                    </div>
                                )}
                                {showTrackForm && (
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={resetTrackForm}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {trackMessage && (
                        <div className="row mb-4">
                            <div className="col-12">
                                <Alert
                                    message={trackMessage}
                                    type={trackMessage.includes('✅') ? 'success' : 'danger'}
                                    onClose={() => setTrackMessage('')}
                                />
                            </div>
                        </div>
                    )}

                    {trackLoading && (
                        <div className="row mb-4">
                            <div className="col-12 text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Track Record Display */}
                    {!showTrackForm && trackData && (
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <div className="card border-success h-100">
                                    <div className="card-body text-center">
                                        <div className="display-4 text-success mb-2">
                                            <i className="fas fa-calendar-alt"></i>
                                        </div>
                                        <h3 className="display-6 fw-bold text-success">
                                            {trackData.yearExp ? trackData.yearExp.toLocaleString() : '0'}
                                        </h3>
                                        <p className="card-text text-muted">Years of Experience</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card border-info h-100">
                                    <div className="card-body text-center">
                                        <div className="display-4 text-info mb-2">
                                            <i className="fas fa-users"></i>
                                        </div>
                                        <h3 className="display-6 fw-bold text-info">
                                            {trackData.totalExpert ? trackData.totalExpert.toLocaleString() : '0'}
                                        </h3>
                                        <p className="card-text text-muted">Total Experts</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card border-warning h-100">
                                    <div className="card-body text-center">
                                        <div className="display-4 text-warning mb-2">
                                            <i className="fas fa-tasks"></i>
                                        </div>
                                        <h3 className="display-6 fw-bold text-warning">
                                            {trackData.planningDone ? trackData.planningDone.toLocaleString() : '0'}
                                        </h3>
                                        <p className="card-text text-muted">Projects Completed</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 mb-3">
                                <div className="card border-danger h-100">
                                    <div className="card-body text-center">
                                        <div className="display-4 text-danger mb-2">
                                            <i className="fas fa-smile"></i>
                                        </div>
                                        <h3 className="display-6 fw-bold text-danger">
                                            {trackData.happyCustomers ? trackData.happyCustomers.toLocaleString() : '0'}
                                        </h3>
                                        <p className="card-text text-muted">Happy Customers</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Form for Creating/Editing Track Record */}
                    {showTrackForm && (
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <div className="card">
                                    <div className="card-header">
                                        <h4 className="card-title mb-0">
                                            <i className="fas fa-chart-line me-2"></i>
                                            {isTrackEditing ? 'Edit Track Record' : 'Add Track Record'}
                                        </h4>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleTrackSubmit}>
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="yearExp" className="form-label">
                                                        <i className="fas fa-calendar-alt me-2"></i>
                                                        Years of Experience *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="yearExp"
                                                        name="yearExp"
                                                        value={trackFormData.yearExp}
                                                        onChange={handleTrackChange}
                                                        min="0"
                                                        required
                                                        placeholder="Enter years of experience"
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="totalExpert" className="form-label">
                                                        <i className="fas fa-users me-2"></i>
                                                        Total Experts *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="totalExpert"
                                                        name="totalExpert"
                                                        value={trackFormData.totalExpert}
                                                        onChange={handleTrackChange}
                                                        min="0"
                                                        required
                                                        placeholder="Enter total number of experts"
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="planningDone" className="form-label">
                                                        <i className="fas fa-tasks me-2"></i>
                                                        Financial Planning Done
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="planningDone"
                                                        name="planningDone"
                                                        value={trackFormData.planningDone}
                                                        onChange={handleTrackChange}
                                                        min="0"
                                                        required
                                                        placeholder="Enter projects completed"
                                                    />
                                                </div>

                                                <div className="col-md-6 mb-3">
                                                    <label htmlFor="happyCustomers" className="form-label">
                                                        <i className="fas fa-smile me-2"></i>
                                                        Happy Customers *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        id="happyCustomers"
                                                        name="happyCustomers"
                                                        value={trackFormData.happyCustomers}
                                                        onChange={handleTrackChange}
                                                        min="0"
                                                        required
                                                        placeholder="Enter number of happy customers"
                                                    />
                                                </div>
                                            </div>

                                            <div className="d-flex justify-content-end gap-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={resetTrackForm}
                                                >
                                                    <i className="fas fa-times me-2"></i>
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    disabled={trackLoading}
                                                >
                                                    {trackLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-save me-2"></i>
                                                            {isTrackEditing ? 'Update' : 'Create'}
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

                {/* Home Services Section */}
                <div className="container-fluid py-4">
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="card shadow-sm">
                                <div className="card-header bg-primary text-white">
                                    <h3 className="card-title mb-0">
                                        <i className="fas fa-home me-2"></i>
                                        Home Services
                                    </h3>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-striped table-hover">
                                            <thead className="table-dark">
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Service Name</th>
                                                    <th scope="col">Description</th>
                                                    <th scope="col">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>1</td>
                                                    <td><strong>What We Offer</strong></td>
                                                    <td>Discover personalized financial solutions crafted to help you achieve
                                                        both personal and business success.</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary me-2">
                                                            <i className="fas fa-edit"></i> Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger">
                                                            <i className="fas fa-trash"></i> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                                {/* <tr>
                                                    <td>2</td>
                                                    <td><strong>Support Services</strong></td>
                                                    <td>24/7 customer support and technical assistance for all your queries</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary me-2">
                                                            <i className="fas fa-edit"></i> Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger">
                                                            <i className="fas fa-trash"></i> Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>3</td>
                                                    <td><strong>Maintenance Services</strong></td>
                                                    <td>Regular maintenance and upkeep services to ensure optimal performance</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-outline-primary me-2">
                                                            <i className="fas fa-edit"></i> Edit
                                                        </button>
                                                        <button className="btn btn-sm btn-outline-danger">
                                                            <i className="fas fa-trash"></i> Delete
                                                        </button>
                                                    </td>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-3">
                                        <button className="btn btn-success">
                                            <i className="fas fa-plus me-2"></i>
                                            Add New Service
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabbing Services Section */}
                <TabbingServices />
            </div>
        </div>
    );
};

// Tabbing Services Component
const TabbingServices = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [commonImage, setCommonImage] = useState('/images/services/default-service.svg');
    const [editFormData, setEditFormData] = useState({
        tabTitle: '',
        contentTitle: '',
        description: '',
        buttonText: '',
        icon: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [commonImagePreview, setCommonImagePreview] = useState(null);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [selectedCommonImageFile, setSelectedCommonImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchingServices, setFetchingServices] = useState(true);

    const [tabbingServices, setTabbingServices] = useState([]);

    // Fetch services from database
    const fetchTabbingServices = async () => {
        try {
            setFetchingServices(true);

            // Fetch services and settings in parallel
            const [servicesResponse, settingsResponse] = await Promise.all([
                servicesAPI.getAll(),
                tabbingServicesSettingsAPI.getSettings().catch(err => {
                    console.warn('Could not load settings:', err);
                    return null;
                })
            ]);

            // Load services
            if (servicesResponse.data && servicesResponse.data.data) {
                // Transform backend data to match frontend structure
                const transformedServices = servicesResponse.data.data.map((service, index) => ({
                    id: service._id || service.id,
                    tabTitle: service.tabTitle || service.title || `Service ${index + 1}`,
                    contentTitle: service.contentTitle || service.title || `Service ${index + 1}`,
                    description: service.description || '',
                    icon: service.image ? getImageUrl(service.image) : '/images/services/default-service.svg',
                    buttonText: service.buttonText || 'Learn More',
                    color: service.color || ['primary', 'success', 'info', 'warning', 'dark', 'danger', 'secondary'][index % 7]
                }));
                setTabbingServices(transformedServices);
                console.log('Loaded services from database:', transformedServices);
            }

            // Load common background image settings
            if (settingsResponse && settingsResponse.data && settingsResponse.data.data) {
                const settings = settingsResponse.data.data;
                if (settings.commonBackgroundImage && settings.commonBackgroundImage.url) {
                    setCommonImage(getImageUrl(settings.commonBackgroundImage.url));
                    console.log('Loaded common background image:', settings.commonBackgroundImage.url);
                }
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            // Fallback to default services if database fetch fails
            setTabbingServices([
                {
                    id: 'temp-1',
                    tabTitle: "Retirement Solutions",
                    contentTitle: "Plan today. Relax tomorrow.",
                    description: "Secure your golden years with a customized retirement plan that ensures financial independence and peace of mind.",
                    icon: "/images/services/web-development.svg",
                    buttonText: "Read More",
                    color: "primary"
                }
            ]);
        } finally {
            setFetchingServices(false);
        }
    };

    // Load services on component mount
    useEffect(() => {
        fetchTabbingServices();
    }, []);

    // Handle editing functions
    const handleEditClick = (index) => {
        setEditingIndex(index);
        const service = tabbingServices[index];
        setEditFormData({
            tabTitle: service.tabTitle,
            contentTitle: service.contentTitle,
            description: service.description,
            buttonText: service.buttonText,
            icon: service.icon || service.image // Use icon if available, fallback to image
        });
        setImagePreview(null);
        setSelectedImageFile(null);
        setIsEditing(true);
    };

    const handleSaveEdit = async () => {
        try {
            setLoading(true);
            const service = tabbingServices[editingIndex];

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('title', editFormData.contentTitle); // Use contentTitle as main title
            formData.append('tabTitle', editFormData.tabTitle);
            formData.append('contentTitle', editFormData.contentTitle);
            formData.append('description', editFormData.description);
            formData.append('buttonText', editFormData.buttonText);

            // Add image if selected
            if (selectedImageFile) {
                formData.append('image', selectedImageFile);
            }

            console.log('Sending form data:', {
                title: editFormData.contentTitle,
                tabTitle: editFormData.tabTitle,
                contentTitle: editFormData.contentTitle,
                description: editFormData.description,
                buttonText: editFormData.buttonText,
                hasImage: !!selectedImageFile
            });

            let response;
            if (service.id && !service.id.toString().startsWith('temp-')) {
                // Update existing service
                response = await servicesAPI.updateWithFile(service.id, formData);
            } else {
                // Create new service
                response = await servicesAPI.createWithFile(formData);
            }

            if (response.data && response.data.data) {
                // Refresh services from database
                await fetchTabbingServices();
                console.log('Service saved successfully:', response.data.data);
                alert('Service updated successfully!');
            }

            handleCancelEdit();
        } catch (error) {
            console.error('Error saving service:', error);
            alert(`Error saving service: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingIndex(null);
        setEditFormData({
            tabTitle: '',
            contentTitle: '',
            description: '',
            buttonText: '',
            icon: ''
        });
        setImagePreview(null);
        setCommonImagePreview(null);
        setSelectedImageFile(null);
        setSelectedCommonImageFile(null);
    };

    const handleInputChange = (field, value) => {
        setEditFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle individual tab image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, or SVG)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image file size should be less than 5MB');
                return;
            }

            setSelectedImageFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                // Update form data with preview for immediate display
                handleInputChange('icon', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle common image change
    const handleCommonImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, or SVG)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image file size should be less than 5MB');
                return;
            }

            setSelectedCommonImageFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setCommonImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Save common image
    const handleSaveCommonImage = async () => {
        if (!selectedCommonImageFile) {
            alert('Please select an image first');
            return;
        }

        try {
            setLoading(true);

            // Create FormData
            const formData = new FormData();
            formData.append('commonBackgroundImage', selectedCommonImageFile);

            // Upload to server
            const response = await tabbingServicesSettingsAPI.updateCommonBackgroundImage(formData);

            if (response.data.success) {
                // Update local state with the new image URL from server
                const newImageUrl = getImageUrl(response.data.data.commonBackgroundImage.url);
                setCommonImage(newImageUrl);
                setCommonImagePreview(null);
                setSelectedCommonImageFile(null);

                console.log('Common image updated successfully:', response.data.data);
                alert('Common background image updated successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to update image');
            }
        } catch (error) {
            console.error('Error saving common image:', error);
            alert('Failed to save common background image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Reset common background image to default
    const handleResetCommonImage = async () => {
        if (!window.confirm('Are you sure you want to reset the common background image to default?')) {
            return;
        }

        try {
            setLoading(true);

            const response = await tabbingServicesSettingsAPI.resetCommonBackgroundImage();

            if (response.data.success) {
                // Update local state with the default image
                setCommonImage('/images/services/default-service.svg');
                setCommonImagePreview(null);
                setSelectedCommonImageFile(null);

                console.log('Common image reset to default');
                alert('Common background image reset to default successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to reset image');
            }
        } catch (error) {
            console.error('Error resetting common image:', error);
            alert('Failed to reset common background image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                            <h3 className="card-title mb-0">
                                <i className="fas fa-layer-group me-2"></i>
                                Tabbing Services
                                {fetchingServices && (
                                    <span className="spinner-border spinner-border-sm ms-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </span>
                                )}
                            </h3>
                            <div>
                                {!isEditing ? (
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-light btn-sm me-2"
                                            onClick={() => fetchTabbingServices()}
                                            disabled={fetchingServices}
                                            title="Refresh services from database"
                                        >
                                            <i className="fas fa-sync-alt me-1"></i>
                                            Refresh
                                        </button>
                                        <button
                                            className="btn btn-light btn-sm"
                                            onClick={() => handleEditClick(activeTab)}
                                            title="Edit current tab"
                                            disabled={fetchingServices || tabbingServices.length === 0}
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Edit Tab
                                        </button>
                                    </div>
                                ) : (
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-light btn-sm"
                                            onClick={handleSaveEdit}
                                            title="Save changes"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-save me-1"></i>
                                                    Save Changes
                                                </>
                                            )}
                                        </button>
                                        <button
                                            className="btn btn-outline-light btn-sm"
                                            onClick={handleCancelEdit}
                                            title="Cancel editing"
                                            disabled={loading}
                                        >
                                            <i className="fas fa-times me-1"></i>
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            {/* Common Image Section */}
                            <div className="mb-4 p-3 border rounded">
                                <div className="row align-items-center">
                                    <div className="col-md-4">
                                        <h6 className="mb-2">
                                            <i className="fas fa-image me-2"></i>
                                            Common Background Image
                                        </h6>
                                        <div className="text-center">
                                            <img
                                                src={commonImagePreview || commonImage}
                                                alt="Common Background"
                                                className="img-fluid rounded"
                                                style={{
                                                    maxWidth: '120px',
                                                    height: '80px',
                                                    objectFit: 'cover',
                                                    border: '2px solid #e9ecef'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = '/images/services/default-service.svg';
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label className="form-label small">Upload New Common Image</label>
                                                <input
                                                    type="file"
                                                    className="form-control form-control-sm"
                                                    accept="image/*"
                                                    onChange={handleCommonImageChange}
                                                />
                                                <small className="text-muted">JPG, PNG, SVG (max 5MB)</small>
                                            </div>
                                            <div className="col-md-6 d-flex align-items-end">
                                                {commonImagePreview && (
                                                    <div>
                                                        <button
                                                            className="btn btn-success btn-sm me-2"
                                                            onClick={handleSaveCommonImage}
                                                            disabled={loading}
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    <span className="spinner-border spinner-border-sm me-1"></span>
                                                                    Saving...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <i className="fas fa-check me-1"></i>
                                                                    Apply
                                                                </>
                                                            )}
                                                        </button>
                                                        <button
                                                            className="btn btn-secondary btn-sm"
                                                            onClick={() => {
                                                                setCommonImagePreview(null);
                                                                setSelectedCommonImageFile(null);
                                                            }}
                                                            disabled={loading}
                                                        >
                                                            <i className="fas fa-times me-1"></i>
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                                {!commonImagePreview && (
                                                    <button
                                                        className="btn btn-outline-danger btn-sm"
                                                        onClick={handleResetCommonImage}
                                                        disabled={loading}
                                                        title="Reset to default image"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-1"></span>
                                                                Resetting...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-undo me-1"></i>
                                                                Reset to Default
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Editing Form */}
                            {isEditing && (
                                <div className="mb-4 p-3 bg-light rounded">
                                    <h5 className="text-primary mb-3">
                                        <i className="fas fa-edit me-2"></i>
                                        Editing: {tabbingServices[editingIndex]?.tabTitle}
                                    </h5>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Tab Title (Short)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editFormData.tabTitle}
                                                onChange={(e) => handleInputChange('tabTitle', e.target.value)}
                                                placeholder="Short title for tab button"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Content Title (Full)</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editFormData.contentTitle}
                                                onChange={(e) => handleInputChange('contentTitle', e.target.value)}
                                                placeholder="Full descriptive title"
                                            />
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Tab Icon/Image</label>
                                            <div className="row align-items-center">
                                                <div className="col-md-2">
                                                    <div className="text-center">
                                                        <img
                                                            src={imagePreview || editFormData.icon || '/images/services/default-service.svg'}
                                                            alt="Tab Icon"
                                                            className="img-fluid rounded"
                                                            style={{
                                                                maxWidth: '50px',
                                                                height: '50px',
                                                                objectFit: 'cover',
                                                                border: '1px solid #dee2e6'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = '/images/services/default-service.svg';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-10">
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        accept="image/*"
                                                        onChange={handleImageChange}
                                                    />
                                                    <small className="text-muted">JPG, PNG, SVG (max 5MB) - Used as tab icon and in content area</small>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 mb-3">
                                            <label className="form-label">Description</label>
                                            <textarea
                                                className="form-control"
                                                rows="3"
                                                value={editFormData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                placeholder="Service description"
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Button Text</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editFormData.buttonText}
                                                onChange={(e) => handleInputChange('buttonText', e.target.value)}
                                                placeholder="Action button text"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Loading State */}
                            {fetchingServices && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading services...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Loading services from database...</p>
                                </div>
                            )}

                            {/* Empty State */}
                            {!fetchingServices && tabbingServices.length === 0 && (
                                <div className="text-center py-5">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <h5 className="text-muted">No Services Found</h5>
                                    <p className="text-muted">No tabbing services are available in the database.</p>
                                    <button
                                        className="btn btn-success"
                                        onClick={() => fetchTabbingServices()}
                                    >
                                        <i className="fas fa-sync-alt me-2"></i>
                                        Retry Loading
                                    </button>
                                </div>
                            )}

                            {/* Tab Navigation */}
                            {!fetchingServices && tabbingServices.length > 0 && (
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <div className="btn-group flex-wrap" role="group" aria-label="Service tabs">
                                            {tabbingServices.map((service, index) => (
                                                <button
                                                    key={service.id}
                                                    type="button"
                                                    className={`btn btn-outline-${service.color} ${activeTab === index ? 'active' : ''} mb-2 d-flex align-items-center`}
                                                    onClick={() => !isEditing && setActiveTab(index)}
                                                    disabled={isEditing}
                                                    style={{
                                                        margin: '2px',
                                                        fontSize: '14px',
                                                        minWidth: '120px',
                                                        opacity: isEditing && index !== activeTab ? 0.5 : 1
                                                    }}
                                                >
                                                    <img
                                                        src={service.icon || '/images/services/default-service.svg'}
                                                        alt=""
                                                        style={{
                                                            width: '16px',
                                                            height: '16px',
                                                            objectFit: 'cover',
                                                            marginRight: '6px',
                                                            borderRadius: '2px'
                                                        }}
                                                        onError={(e) => {
                                                            e.target.src = '/images/services/default-service.svg';
                                                        }}
                                                    />
                                                    {isEditing && editingIndex === index ? editFormData.tabTitle : service.tabTitle}
                                                    {isEditing && editingIndex === index && (
                                                        <small className="ms-1">*</small>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Active Tab Content */}
                            {!fetchingServices && tabbingServices.length > 0 && tabbingServices[activeTab] && (
                                <div className={`row ${isEditing ? 'border border-warning rounded p-3' : ''}`}>
                                    {isEditing && (
                                        <div className="col-12 mb-3">
                                            <div className="alert alert-warning mb-0">
                                                <i className="fas fa-edit me-2"></i>
                                                <strong>Editing Mode:</strong> You are currently editing this tab content. Use the form above to make changes.
                                            </div>
                                        </div>
                                    )}
                                    <div className="col-lg-4 col-md-6 mb-4">
                                        <div className="text-center">
                                            {/* Tab Specific Image */}
                                            <img
                                                src={tabbingServices[activeTab].icon || '/images/services/default-service.svg'}
                                                alt={tabbingServices[activeTab].contentTitle}
                                                className="img-fluid mb-3"
                                                style={{
                                                    maxWidth: '120px',
                                                    height: '120px',
                                                    objectFit: 'cover',
                                                    borderRadius: '15px',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                                    border: '3px solid white'
                                                }}
                                                onError={(e) => {
                                                    e.target.src = '/images/services/default-service.svg';
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-8 col-md-6">
                                        <div className="h-100 d-flex flex-column justify-content-center">
                                            <h4 className={`text-${tabbingServices[activeTab].color} mb-3`}>
                                                <i className="fas fa-star me-2"></i>
                                                {isEditing && editingIndex === activeTab ? editFormData.contentTitle : tabbingServices[activeTab].contentTitle}
                                                {isEditing && editingIndex === activeTab && (
                                                    <small className="text-muted ms-2">(Preview)</small>
                                                )}
                                            </h4>
                                            <p className="lead text-muted mb-4" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                                {isEditing && editingIndex === activeTab ? editFormData.description : tabbingServices[activeTab].description}
                                            </p>
                                            <div>
                                                <button
                                                    className={`btn btn-${tabbingServices[activeTab].color} btn-lg px-4 py-2`}
                                                    style={{
                                                        borderRadius: '25px',
                                                        fontWeight: '600',
                                                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                    }}
                                                    disabled={isEditing}
                                                >
                                                    <i className="fas fa-arrow-right me-2"></i>
                                                    {isEditing && editingIndex === activeTab ? editFormData.buttonText : tabbingServices[activeTab].buttonText}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
