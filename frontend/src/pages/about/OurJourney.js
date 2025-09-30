import React, { useState, useEffect } from 'react';
import Alert from '../../components/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { ourJourneyAPI } from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const OurJourney = () => {
    const { isAuthenticated } = useAuth();
    const [journeyData, setJourneyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCardForm, setShowCardForm] = useState(false);
    const [cardFormData, setCardFormData] = useState({
        year: '',
        heading: '',
        description: ''
    });
    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        cards: []
    });
    useEffect(() => {
        fetchJourneyData();
    }, []);
    const fetchJourneyData = async () => {
        setFetchLoading(true);
        try {
            const response = await ourJourneyAPI.getAll();
            setJourneyData(response.data.data || []);
        } catch (error) {
            console.error('Error fetching our journey data:', error);
            setMessage('Failed to fetch our journey content.');
        } finally {
            setFetchLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
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
            setMessage('Year, heading, and description are required for cards.');
            return;
        }
        const newCard = {
            ...cardFormData,
            order: formData.cards.length
        };
        setFormData(prev => ({
            ...prev,
            cards: [...prev.cards, newCard]
        }));
        setCardFormData({
            year: '',
            heading: '',
            description: ''
        });
        setShowCardForm(false);
        setMessage('Card added successfully!');
    };
    const removeCard = (index) => {
        setFormData(prev => ({
            ...prev,
            cards: prev.cards.filter((_, i) => i !== index)
        }));
        setMessage('Card removed successfully!');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        if (!formData.heading.trim()) {
            setMessage('Heading is required.');
            setLoading(false);
            return;
        }
        if (!formData.description.trim() || formData.description === '<p><br></p>') {
            setMessage('Description is required.');
            setLoading(false);
            return;
        }
        try {
            const submitData = {
                heading: formData.heading,
                description: formData.description,
                cards: formData.cards
            };
            let response;
            if (isEditing) {
                response = await ourJourneyAPI.update(editingId, submitData);
                setMessage('Our Journey content updated successfully!');
            } else {
                response = await ourJourneyAPI.create(submitData);
                setMessage('Our Journey content created successfully!');
            }
            fetchJourneyData();
            resetForm();
        } catch (error) {
            console.error('Error saving our journey content:', error);
            setMessage(error.response?.data?.message || 'Failed to save our journey content.');
        } finally {
            setLoading(false);
        }
    };
    const handleEdit = (item) => {
        setFormData({
            heading: item.heading,
            description: item.description,
            cards: item.cards || []
        });
        setIsEditing(true);
        setEditingId(item._id);
        setShowForm(true);
    };
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this journey content?')) {
            try {
                await ourJourneyAPI.delete(id);
                setMessage('Journey content deleted successfully!');
                fetchJourneyData();
            } catch (error) {
                console.error('Error deleting journey content:', error);
                setMessage('Failed to delete journey content.');
            }
        }
    };
    const resetForm = () => {
        setFormData({
            heading: '',
            description: '',
            cards: []
        });
        setCardFormData({
            year: '',
            heading: '',
            description: ''
        });
        setShowForm(false);
        setShowCardForm(false);
        setIsEditing(false);
        setEditingId(null);
        setMessage('');
    };
    const filteredItems = journeyData.filter(journey =>
        journey.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        journey.cards?.some(card =>
            card.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            card.year.toLowerCase().includes(searchTerm.toLowerCase())
        )
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
                            <i className="fas fa-road me-2"></i>
                            Our Journey
                        </h1>
                        {isAuthenticated && (
                            <div className="btn-group">
                                {!showForm && (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setShowForm(true)}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Add Journey Content
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
                            {isEditing ? 'Edit Journey Content' : 'Add New Journey Content'}
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="heading" className="form-label">Section Heading *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="heading"
                                        name="heading"
                                        value={formData.heading}
                                        onChange={handleChange}
                                        placeholder="Enter section heading (e.g., 'Our Journey')"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="description" className="form-label">Section Description *</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(value) => setFormData({ ...formData, description: value })}
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
                                    {formData.cards.length > 0 && (
                                        <div className="row">
                                            {formData.cards.map((card, index) => (
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

            {/* Our Journey Content Display */}
            {!showForm && (
                <div className="card shadow-sm border-warning">
                    <div className="card-header bg-warning text-dark">
                        <h4 className="mb-0">
                            <i className="fas fa-road me-2"></i>
                            OUR JOURNEY CONTENT
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
                                {currentItems.map((journey) => (
                                    <div key={journey._id} className="card mb-4">
                                        <div className="card-header d-flex justify-content-between align-items-center">
                                            <h5 className="mb-0">{journey.heading}</h5>
                                            {isAuthenticated && (
                                                <div className="btn-group btn-group-sm">
                                                    <button
                                                        className="btn btn-outline-primary"
                                                        onClick={() => handleEdit(journey)}
                                                        title="Edit"
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDelete(journey._id)}
                                                        title="Delete"
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-body">
                                            <div
                                                className="mb-3"
                                                dangerouslySetInnerHTML={{ __html: journey.description }}
                                            />

                                            {/* Journey Cards */}
                                            {journey.cards && journey.cards.length > 0 && (
                                                <div className="row">
                                                    {journey.cards
                                                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                                                        .map((card, index) => (
                                                            <div key={index} className="col-md-6 col-lg-4 mb-3">
                                                                <div className="card border-primary h-100">
                                                                    <div className="card-body">
                                                                        <span className="badge bg-primary mb-2">{card.year}</span>
                                                                        <h6 className="card-title">{card.heading}</h6>
                                                                        <p className="card-text">{card.description}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

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
                                    <i className="fas fa-road display-1 mb-3"></i>
                                    <h3>No Journey Content Found</h3>
                                    <p>Add your first journey content to get started.</p>
                                    {isAuthenticated && (
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => setShowForm(true)}
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
            )}
        </div>
    );
};

export default OurJourney;
