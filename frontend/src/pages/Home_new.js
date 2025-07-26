import React, { useState, useEffect } from 'react';
import { homePageAPI } from '../services/api';

const Home = () => {
    const [homePages, setHomePages] = useState([]);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
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

    useEffect(() => {
        fetchHomePages();
    }, []);

    const fetchHomePages = async () => {
        setFetchLoading(true);
        try {
            const response = await homePageAPI.getAll();
            if (response.data && response.data.data) {
                setHomePages(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching homepage content:', error);
            setMessage('❌ Failed to fetch homepage content.');
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
        <div className="container-fluid py-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="mb-0">Home</h2>
                <nav>
                    <span className="text-primary">Admin</span>
                    <span className="mx-2">›</span>
                    <span className="text-muted">Home</span>
                </nav>
            </div>

            {/* Action Buttons */}
            <div className="mb-3">
                <button
                    className="btn btn-info me-2"
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
                    className="btn btn-primary"
                    onClick={fetchHomePages}
                    disabled={fetchLoading}
                >
                    {fetchLoading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Success/Error Messages */}
            {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'} mb-3`}>
                    {message}
                </div>
            )}

            {/* Create/Edit Form */}
            {showForm && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="card-title mb-0">
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
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        rows="3"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter description"
                                        required
                                    ></textarea>
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
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Main Content Card */}
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">HOME LIST</h5>
                </div>
                <div className="card-body">
                    {/* Controls */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className="d-flex align-items-center">
                            <span className="me-2">Show</span>
                            <select
                                className="form-select form-select-sm me-2"
                                style={{ width: 'auto' }}
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
                            <span>entries</span>
                        </div>
                        <div>
                            <label className="me-2">Search:</label>
                            <input
                                type="text"
                                className="form-control form-control-sm d-inline-block"
                                style={{ width: '200px' }}
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search..."
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
                                <table className="table table-striped table-dark">
                                    <thead>
                                        <tr>
                                            <th style={{ width: '50px' }}>No</th>
                                            <th style={{ width: '120px' }}>Thumbnail</th>
                                            <th>Title</th>
                                            <th>Category</th>
                                            <th style={{ width: '100px' }}>Status</th>
                                            <th style={{ width: '150px' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentItems.map((page, index) => (
                                            <tr key={page._id}>
                                                <td>{startIndex + index + 1}</td>
                                                <td>
                                                    {page.image?.url ? (
                                                        <img
                                                            src={page.image.url}
                                                            alt={page.image.altText}
                                                            className="img-thumbnail"
                                                            style={{ width: '80px', height: '60px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="bg-light d-flex align-items-center justify-content-center"
                                                            style={{ width: '80px', height: '60px', fontSize: '12px' }}
                                                        >
                                                            No Image
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div style={{ maxWidth: '300px' }}>
                                                        <strong>{page.heading}</strong>
                                                        <br />
                                                        <small className="text-muted">
                                                            {page.description?.length > 80
                                                                ? `${page.description.substring(0, 80)}...`
                                                                : page.description
                                                            }
                                                        </small>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info">Homepage Banner</span>
                                                </td>
                                                <td>
                                                    <span className="badge bg-success">Active</span>
                                                </td>
                                                <td>
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleView(page)}
                                                            title="View Details"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-info btn-sm"
                                                            onClick={() => handleEdit(page)}
                                                            title="Edit"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
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
                                    <span className="text-muted">
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
                                            >
                                                Previous
                                            </button>
                                        </li>
                                        {[...Array(totalPages)].map((_, i) => (
                                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(i + 1)}
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
        </div>
    );
};

export default Home;
