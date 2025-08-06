import React, { useState, useEffect } from 'react';
import Alert from '../../components/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { aboutUsAPI, ourJourneyAPI } from '../../services/api';
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

const AboutUs = () => {
    const { isAuthenticated } = useAuth();
    const [aboutPages, setAboutPages] = useState([]);
    const [journeyData, setJourneyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    // Our Journey form state
    const [showJourneyForm, setShowJourneyForm] = useState(false);
    const [isEditingJourney, setIsEditingJourney] = useState(false);
    const [editingJourneyId, setEditingJourneyId] = useState(null);
    const [journeyLoading, setJourneyLoading] = useState(false);

    // Journey card management
    const [showCardForm, setShowCardForm] = useState(false);
    const [cardFormData, setCardFormData] = useState({
        year: '',
        heading: '',
        description: ''
    });

    const [journeyFormData, setJourneyFormData] = useState({
        heading: '',
        description: '',
        cards: []
    });

    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        button: {
            text: '',
            link: ''
        },
        image: {
            file: null,
            altText: ''
        }
    });

    useEffect(() => {
        fetchAboutData();
        fetchJourneyData();
    }, []);

    const fetchAboutData = async () => {
        setFetchLoading(true);
        try {
            const response = await aboutUsAPI.getAll();
            setAboutPages(response.data.data || []);
        } catch (error) {
            console.error('Error fetching about us data:', error);
            setMessage('❌ Failed to fetch about us content.');
        } finally {
            setFetchLoading(false);
        }
    };

    const fetchJourneyData = async () => {
        try {
            const response = await ourJourneyAPI.getAll();
            setJourneyData(response.data.data || []);
        } catch (error) {
            console.error('Error fetching our journey data:', error);
            // Don't show error message for journey data as it's secondary content
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

        // Validate required fields
        if (!formData.heading.trim()) {
            setMessage('❌ Title is required.');
            setLoading(false);
            return;
        }

        if (!formData.description.trim() || formData.description === '<p><br></p>') {
            setMessage('❌ Description is required.');
            setLoading(false);
            return;
        }



        try {
            const submitData = new FormData();
            submitData.append('heading', formData.heading);
            submitData.append('description', formData.description);
            submitData.append('button[text]', formData.button.text);
            submitData.append('button[link]', formData.button.link);
            submitData.append('image[altText]', formData.heading); // Use heading as alt text

            if (formData.image.file) {
                submitData.append('image', formData.image.file);
            }

            let response;
            if (isEditing) {
                response = await aboutUsAPI.update(editingId, submitData);
                setMessage('✅ About Us content updated successfully!');
            } else {
                response = await aboutUsAPI.create(submitData);
                setMessage('✅ About Us content created successfully!');
            }

            fetchAboutData();
            resetForm();
        } catch (error) {
            console.error('Error saving about us content:', error);
            setMessage(error.response?.data?.message || '❌ Failed to save about us content.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            heading: item.heading,
            description: item.description,
            button: {
                text: item.button?.text || '',
                link: item.button?.link || ''
            },
            image: {
                file: null,
                altText: item.heading || '' // Use heading as alt text when editing
            }
        });
        setIsEditing(true);
        setEditingId(item._id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this content?')) {
            try {
                await aboutUsAPI.delete(id);
                setMessage('✅ Content deleted successfully!');
                fetchAboutData();
            } catch (error) {
                console.error('Error deleting content:', error);
                setMessage('❌ Failed to delete content.');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            heading: '',
            description: '',
            button: {
                text: '',
                link: ''
            },
            image: {
                file: null,
                altText: ''
            }
        });
        setShowForm(false);
        setIsEditing(false);
        setEditingId(null);
        setMessage('');
    };

    // Our Journey Management Functions
    const handleJourneyChange = (e) => {
        const { name, value } = e.target;
        setJourneyFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;
        setCardFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addCard = () => {
        if (!cardFormData.year || !cardFormData.heading || !cardFormData.description) {
            setMessage('❌ Year, heading, and description are required for cards.');
            return;
        }

        const newCard = {
            ...cardFormData,
            order: journeyFormData.cards.length
        };

        setJourneyFormData(prev => ({
            ...prev,
            cards: [...prev.cards, newCard]
        }));

        // Reset card form
        setCardFormData({
            year: '',
            heading: '',
            description: ''
        });
        setShowCardForm(false);
        setMessage('✅ Card added successfully!');
    };

    const removeCard = (index) => {
        setJourneyFormData(prev => ({
            ...prev,
            cards: prev.cards.filter((_, i) => i !== index)
        }));
        setMessage('✅ Card removed successfully!');
    };

    const handleJourneySubmit = async (e) => {
        e.preventDefault();
        setJourneyLoading(true);
        setMessage('');

        // Validate required fields
        if (!journeyFormData.heading.trim()) {
            setMessage('❌ Journey heading is required.');
            setJourneyLoading(false);
            return;
        }

        if (!journeyFormData.description.trim() || journeyFormData.description === '<p><br></p>') {
            setMessage('❌ Journey description is required.');
            setJourneyLoading(false);
            return;
        }

        try {
            const submitData = {
                heading: journeyFormData.heading,
                description: journeyFormData.description,
                cards: journeyFormData.cards
            };

            let response;
            if (isEditingJourney) {
                response = await ourJourneyAPI.update(editingJourneyId, submitData);
                setMessage('✅ Our Journey content updated successfully!');
            } else {
                response = await ourJourneyAPI.create(submitData);
                setMessage('✅ Our Journey content created successfully!');
            }

            fetchJourneyData();
            resetJourneyForm();
        } catch (error) {
            console.error('Error saving our journey content:', error);
            setMessage(error.response?.data?.message || '❌ Failed to save our journey content.');
        } finally {
            setJourneyLoading(false);
        }
    };

    const handleEditJourney = (journey) => {
        setJourneyFormData({
            heading: journey.heading,
            description: journey.description,
            cards: journey.cards || []
        });
        setIsEditingJourney(true);
        setEditingJourneyId(journey._id);
        setShowJourneyForm(true);
    };

    const handleDeleteJourney = async (id) => {
        if (window.confirm('Are you sure you want to delete this journey content?')) {
            try {
                await ourJourneyAPI.delete(id);
                setMessage('✅ Journey content deleted successfully!');
                fetchJourneyData();
            } catch (error) {
                console.error('Error deleting journey content:', error);
                setMessage('❌ Failed to delete journey content.');
            }
        }
    };

    const resetJourneyForm = () => {
        setJourneyFormData({
            heading: '',
            description: '',
            cards: []
        });
        setCardFormData({
            year: '',
            heading: '',
            description: ''
        });
        setShowJourneyForm(false);
        setShowCardForm(false);
        setIsEditingJourney(false);
        setEditingJourneyId(null);
    };

    // Filter and pagination logic
    const filteredItems = aboutPages.filter(page =>
        page.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredItems.slice(startIndex, endIndex);

    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="h2 mb-0">
                            <i className="fas fa-info-circle me-2"></i>
                            About Us Content
                        </h1>
                        {isAuthenticated && (
                            <div className="btn-group">
                                {!showForm && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowForm(true)}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Add About Content
                                    </button>
                                )}
                                {showForm && (
                                    <button
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        <i className="fas fa-times me-2"></i>
                                        Cancel
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {message && (
                <div className="row mb-4">
                    <div className="col-12">
                        <Alert
                            message={message}
                            type={message.includes('✅') ? 'success' : 'danger'}
                            onClose={() => setMessage('')}
                        />
                    </div>
                </div>
            )}

            {fetchLoading && (
                <div className="row mb-4">
                    <div className="col-12 text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Create/Edit Form */}
            {showForm && (
                <div className="card mb-4">
                    <div className="card-header">
                        <h5 className="card-title mb-0">
                            {isEditing ? 'Edit About Content' : 'Add New About Content'}
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
                                        placeholder="Enter description (required)"
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
                                    {(!formData.description || formData.description.trim() === '' || formData.description === '<p><br></p>') && (
                                        <div className="text-danger small mt-1">
                                            Description is required
                                        </div>
                                    )}
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

            {/* About Us Content Display */}
            {!showForm && (
                <div className="card shadow-sm border-info">
                    <div className="card-header bg-info text-white">
                        <h4 className="mb-0">
                            <i className="fas fa-info-circle me-2"></i>
                            ABOUT US CONTENT
                        </h4>
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
                            <div className="d-flex align-items-center">
                                <label className="me-2">Search:</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    style={{ width: '200px' }}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search content..."
                                />
                            </div>
                        </div>

                        {/* Content List */}
                        {currentItems.length > 0 ? (
                            <>
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Image</th>
                                                <th>Title</th>
                                                <th>Description</th>
                                                <th>Button</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentItems.map((item) => (
                                                <tr key={item._id}>
                                                    <td>
                                                        {item.image?.url ? (
                                                            <img
                                                                src={getImageUrl(item.image.url)}
                                                                alt={item.image.altText}
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    objectFit: 'cover',
                                                                    borderRadius: '4px'
                                                                }}
                                                            />
                                                        ) : (
                                                            <div
                                                                style={{
                                                                    width: '60px',
                                                                    height: '60px',
                                                                    backgroundColor: '#f8f9fa',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    borderRadius: '4px'
                                                                }}
                                                            >
                                                                <i className="fas fa-image text-muted"></i>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <strong>{item.heading}</strong>
                                                    </td>
                                                    <td>
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: item.description.length > 100
                                                                    ? item.description.substring(0, 100) + '...'
                                                                    : item.description
                                                            }}
                                                        />
                                                    </td>
                                                    <td>
                                                        {item.button?.text && (
                                                            <span className="badge bg-primary">
                                                                {item.button.text}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <div className="btn-group btn-group-sm">
                                                            <button
                                                                className="btn btn-outline-primary"
                                                                onClick={() => handleEdit(item)}
                                                                title="Edit"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => handleDelete(item._id)}
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
                                {totalPages > 1 && (
                                    <div className="d-flex justify-content-between align-items-center mt-3">
                                        <div>
                                            Showing {startIndex + 1} to {Math.min(endIndex, filteredItems.length)} of {filteredItems.length} entries
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
                                                {[...Array(totalPages)].map((_, index) => (
                                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => setCurrentPage(index + 1)}
                                                        >
                                                            {index + 1}
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
                                )}
                            </>
                        ) : (
                            <div className="text-center py-5">
                                <div className="text-muted">
                                    <i className="fas fa-info-circle display-1 mb-3"></i>
                                    <h3>No About Us Content Found</h3>
                                    <p>Add your first about us content to get started.</p>
                                    {isAuthenticated && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setShowForm(true)}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            Add About Content
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Our Journey Section */}
            {!showForm && (
                <div className="mt-5">
                    <div className="card shadow-sm border-info mb-4">
                        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">
                                <i className="fas fa-road me-2"></i>
                                Our Journey
                            </h4>
                            {isAuthenticated && (
                                <button
                                    className="btn btn-light btn-sm"
                                    onClick={() => setShowJourneyForm(true)}
                                    title="Manage Our Journey Content"
                                >
                                    <i className="fas fa-cog me-1"></i>
                                    Manage
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            {journeyData.length > 0 ? (
                                journeyData.map((journey) => (
                                    <div key={journey._id}>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <div
                                                className="flex-grow-1"
                                                dangerouslySetInnerHTML={{ __html: journey.description }}
                                            />
                                            {isAuthenticated && (
                                                <div className="btn-group btn-group-sm ms-3">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleEditJourney(journey)}
                                                        title="Edit Journey"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDeleteJourney(journey._id)}
                                                        title="Delete Journey"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Journey Cards */}
                                        {journey.cards && journey.cards.length > 0 && (
                                            <div className="row">
                                                {journey.cards
                                                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                                                    .map((card, index) => (
                                                        <div key={index} className="col-md-6 col-lg-4 mb-3">
                                                            <div className="card border-info h-100 shadow-sm">
                                                                <div className="card-body">
                                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                                        <span className="badge bg-info fs-6">{card.year}</span>
                                                                    </div>
                                                                    <h5 className="card-title text-info">{card.heading}</h5>
                                                                    <p className="card-text">{card.description}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-5">
                                    <div className="text-light">
                                        <i className="fas fa-road display-1 mb-3 text-info"></i>
                                        <h5>No Journey Content Yet</h5>
                                        <p>Our journey story will be displayed here once content is added.</p>
                                        {isAuthenticated && (
                                            <button
                                                className="btn btn-info"
                                                onClick={() => setShowJourneyForm(true)}
                                            >
                                                <i className="fas fa-plus me-2"></i>
                                                Add Journey Content
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Our Journey Form */}
            {showJourneyForm && (
                <div className="card mb-4 mt-4">
                    <div className="card-header">
                        <h5 className="card-title mb-0">
                            {isEditingJourney ? 'Edit Journey Content' : 'Add New Journey Content'}
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleJourneySubmit}>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="journeyHeading" className="form-label">Section Heading *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="journeyHeading"
                                        name="heading"
                                        value={journeyFormData.heading}
                                        onChange={handleJourneyChange}
                                        placeholder="Enter section heading (e.g., 'Our Journey')"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="journeyDescription" className="form-label">Section Description *</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={journeyFormData.description}
                                        onChange={(value) => setJourneyFormData({ ...journeyFormData, description: value })}
                                        placeholder="Enter section description"
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
                                        style={{
                                            minHeight: '120px'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Cards Section */}
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">Journey Cards/Milestones</h6>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setShowCardForm(!showCardForm)}
                                        >
                                            <i className="fas fa-plus me-1"></i>
                                            Add Card
                                        </button>
                                    </div>

                                    {/* Add Card Form */}
                                    {showCardForm && (
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-md-3 mb-2">
                                                        <label className="form-label">Year *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="year"
                                                            value={cardFormData.year}
                                                            onChange={handleCardChange}
                                                            placeholder="2024"
                                                        />
                                                    </div>
                                                    <div className="col-md-9 mb-2">
                                                        <label className="form-label">Card Heading *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="heading"
                                                            value={cardFormData.heading}
                                                            onChange={handleCardChange}
                                                            placeholder="Milestone title"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-12 mb-2">
                                                        <label className="form-label">Card Description *</label>
                                                        <textarea
                                                            className="form-control"
                                                            name="description"
                                                            value={cardFormData.description}
                                                            onChange={handleCardChange}
                                                            rows="3"
                                                            placeholder="Describe this milestone"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success"
                                                        onClick={addCard}
                                                    >
                                                        Add Card
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => setShowCardForm(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Display Added Cards */}
                                    {journeyFormData.cards.length > 0 && (
                                        <div className="row">
                                            {journeyFormData.cards.map((card, index) => (
                                                <div key={index} className="col-md-6 col-lg-4 mb-3">
                                                    <div className="card border-primary">
                                                        <div className="card-body">
                                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                                <span className="badge bg-primary">{card.year}</span>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    onClick={() => removeCard(index)}
                                                                    title="Remove card"
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>
                                                            <h6 className="card-title">{card.heading}</h6>
                                                            <p className="card-text small">{card.description}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={journeyLoading}
                                >
                                    {journeyLoading ? 'Saving...' : (isEditingJourney ? 'Update' : 'Create')}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetJourneyForm}
                                    disabled={journeyLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutUs;