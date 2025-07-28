import React, { useState, useEffect } from 'react';
import Alert from '../../components/Alert';
import { homePageAPI, ourTrackAPI } from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Home = () => {
    const [homePages, setHomePages] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [trackMessage, setTrackMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Helper function to get full image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return null;

        // If it's already a full URL, return as is
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }

        // If it's a relative URL, prepend the base URL
        const baseUrl = process.env.NODE_ENV === 'production'
            ? ''
            : 'http://localhost:8000';

        return `${baseUrl}${imageUrl.startsWith('/') ? imageUrl : '/' + imageUrl}`;
    };

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
            </div>
        </div>
    );
};

export default Home;
