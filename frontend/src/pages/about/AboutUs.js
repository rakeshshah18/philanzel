import React, { useState, useEffect } from 'react';
import Alert from '../../components/Alert';
import { useAuth } from '../../contexts/AuthContext';
import { aboutUsAPI, ourJourneyAPI, ourFounderAPI, aboutWhyChooseUsAPI } from '../../services/api';
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
    const [whyChooseUsData, setWhyChooseUsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Fixed items per page

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
        fetchWhyChooseUsData();
        fetchOurFounderData();
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

    const fetchWhyChooseUsData = async () => {
        try {
            const response = await aboutWhyChooseUsAPI.getAll();
            setWhyChooseUsData(response.data.data || []);
        } catch (error) {
            console.error('Error fetching why choose us data:', error);
            // Don't show error message for why choose us data as it's secondary content
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

    // WhyChooseUs Management Functions
    const [whyChooseUsFormData, setWhyChooseUsFormData] = useState({
        heading: '',
        title: '',
        button: '',
        points: []
    });
    const [whyChooseUsImage, setWhyChooseUsImage] = useState(null);
    const [showWhyChooseUsForm, setShowWhyChooseUsForm] = useState(false);
    const [isEditingWhyChooseUs, setIsEditingWhyChooseUs] = useState(false);
    const [editingWhyChooseUsId, setEditingWhyChooseUsId] = useState(null);
    const [whyChooseUsLoading, setWhyChooseUsLoading] = useState(false);
    const [showPointForm, setShowPointForm] = useState(false);
    const [pointFormData, setPointFormData] = useState('');

    // Our Founder state
    const [ourFounderData, setOurFounderData] = useState([]);
    const [ourFounderFormData, setOurFounderFormData] = useState({
        name: '',
        designation: '',
        description: ''
    });
    const [ourFounderImage, setOurFounderImage] = useState(null);
    const [showOurFounderForm, setShowOurFounderForm] = useState(false);
    const [isEditingOurFounder, setIsEditingOurFounder] = useState(false);
    const [editingOurFounderId, setEditingOurFounderId] = useState(null);
    const [ourFounderLoading, setOurFounderLoading] = useState(false);

    const handleWhyChooseUsChange = (e) => {
        setWhyChooseUsFormData({
            ...whyChooseUsFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleWhyChooseUsImageChange = (e) => {
        setWhyChooseUsImage(e.target.files[0]);
    };

    const addPoint = () => {
        if (pointFormData.trim()) {
            setWhyChooseUsFormData({
                ...whyChooseUsFormData,
                points: [...whyChooseUsFormData.points, pointFormData.trim()]
            });
            setPointFormData('');
            setShowPointForm(false);
        }
    };

    const removePoint = (index) => {
        setWhyChooseUsFormData({
            ...whyChooseUsFormData,
            points: whyChooseUsFormData.points.filter((_, i) => i !== index)
        });
    };

    const handleWhyChooseUsSubmit = async (e) => {
        e.preventDefault();
        setWhyChooseUsLoading(true);

        try {
            const formData = new FormData();
            formData.append('heading', whyChooseUsFormData.heading);
            formData.append('description', whyChooseUsFormData.title); // Backend expects 'description' field

            // Format button as object with text and link
            const buttonObj = {
                text: whyChooseUsFormData.button || 'Get Started',
                link: '#'
            };
            formData.append('button', JSON.stringify(buttonObj));

            // Format points as array of objects with text and icon
            const pointsArray = whyChooseUsFormData.points.map(point => ({
                text: typeof point === 'string' ? point : (point.text || point.title || point.description || ''),
                icon: 'fas fa-check'
            }));
            formData.append('points', JSON.stringify(pointsArray));

            if (whyChooseUsImage) {
                formData.append('image', whyChooseUsImage);
            }

            if (isEditingWhyChooseUs) {
                await aboutWhyChooseUsAPI.update(editingWhyChooseUsId, formData);
                setMessage('✅ Why Choose Us content updated successfully!');
            } else {
                await aboutWhyChooseUsAPI.create(formData);
                setMessage('✅ Why Choose Us content created successfully!');
            }

            fetchWhyChooseUsData();
            resetWhyChooseUsForm();
        } catch (error) {
            console.error('Error saving why choose us content:', error);
            setMessage(error.response?.data?.message || '❌ Failed to save why choose us content.');
        } finally {
            setWhyChooseUsLoading(false);
        }
    };

    const handleEditWhyChooseUs = (item) => {
        setWhyChooseUsFormData({
            heading: item.heading,
            title: item.description || item.title, // Use description from backend
            button: typeof item.button === 'string' ? item.button : (item.button?.text || ''),
            points: item.points ? item.points.map(point =>
                typeof point === 'string' ? point : (point.text || point.title || point.description || '')
            ) : []
        });
        setIsEditingWhyChooseUs(true);
        setEditingWhyChooseUsId(item._id);
        setShowWhyChooseUsForm(true);
    };

    const handleDeleteWhyChooseUs = async (id) => {
        if (window.confirm('Are you sure you want to delete this Why Choose Us content?')) {
            try {
                await aboutWhyChooseUsAPI.delete(id);
                setMessage('✅ Why Choose Us content deleted successfully!');
                fetchWhyChooseUsData();
            } catch (error) {
                console.error('Error deleting why choose us content:', error);
                setMessage('❌ Failed to delete why choose us content.');
            }
        }
    };

    const resetWhyChooseUsForm = () => {
        setWhyChooseUsFormData({
            heading: '',
            title: '',
            button: '',
            points: []
        });
        setWhyChooseUsImage(null);
        setPointFormData('');
        setShowWhyChooseUsForm(false);
        setShowPointForm(false);
        setIsEditingWhyChooseUs(false);
        setEditingWhyChooseUsId(null);
    };

    // Our Founder Functions
    const fetchOurFounderData = async () => {
        try {
            const response = await ourFounderAPI.getAll();
            setOurFounderData(response.data.data);
        } catch (error) {
            console.error('Error fetching our founder data:', error);
            setMessage('❌ Failed to fetch our founder data.');
        }
    };

    const handleOurFounderChange = (e) => {
        setOurFounderFormData({
            ...ourFounderFormData,
            [e.target.name]: e.target.value
        });
    };

    const handleOurFounderImageChange = (e) => {
        const file = e.target.files[0];
        setOurFounderImage(file);
    };

    const handleOurFounderSubmit = async (e) => {
        e.preventDefault();
        setOurFounderLoading(true);

        try {
            const formData = new FormData();
            formData.append('name', ourFounderFormData.name);
            formData.append('designation', ourFounderFormData.designation);
            formData.append('description', ourFounderFormData.description);

            if (ourFounderImage) {
                formData.append('image', ourFounderImage);
            }

            if (isEditingOurFounder) {
                await ourFounderAPI.update(editingOurFounderId, formData);
                setMessage('✅ Our founder content updated successfully!');
            } else {
                await ourFounderAPI.create(formData);
                setMessage('✅ Our founder content created successfully!');
            }

            fetchOurFounderData();
            resetOurFounderForm();
        } catch (error) {
            console.error('Error saving our founder content:', error);
            setMessage(error.response?.data?.message || '❌ Failed to save our founder content.');
        } finally {
            setOurFounderLoading(false);
        }
    };

    const handleEditOurFounder = (item) => {
        setOurFounderFormData({
            name: item.name,
            designation: item.designation,
            description: item.description
        });
        setIsEditingOurFounder(true);
        setEditingOurFounderId(item._id);
        setShowOurFounderForm(true);
    };

    const handleDeleteOurFounder = async (id) => {
        if (window.confirm('Are you sure you want to delete this our founder content?')) {
            try {
                await ourFounderAPI.delete(id);
                setMessage('✅ Our founder content deleted successfully!');
                fetchOurFounderData();
            } catch (error) {
                console.error('Error deleting our founder content:', error);
                setMessage('❌ Failed to delete our founder content.');
            }
        }
    };

    const resetOurFounderForm = () => {
        setOurFounderFormData({
            name: '',
            designation: '',
            description: ''
        });
        setOurFounderImage(null);
        setShowOurFounderForm(false);
        setIsEditingOurFounder(false);
        setEditingOurFounderId(null);
    };

    // Pagination logic
    const totalPages = Math.ceil(aboutPages.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = aboutPages.slice(startIndex, endIndex);

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
                                                                <i className="bi bi-pencil-square"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-outline-danger"
                                                                onClick={() => handleDelete(item._id)}
                                                                title="Delete"
                                                            >
                                                                <i className="bi bi-trash"></i>
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
                                    <div className="d-flex justify-content-end align-items-center mt-3">
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
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger"
                                                        onClick={() => handleDeleteJourney(journey._id)}
                                                        title="Delete Journey"
                                                    >
                                                        <i className="bi bi-trash"></i>
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

            {/* Why Choose Us Section */}
            {whyChooseUsData.length > 0 && (
                <div className="card mb-4 mt-4">
                    <div className="card-header">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="card-title mb-0">
                                    <i className="fas fa-star me-2"></i>
                                    Why Choose Us
                                </h4>
                            </div>
                            {isAuthenticated && (
                                <div className="btn-group">
                                    <button
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => setShowWhyChooseUsForm(true)}
                                        title="Add New Why Choose Us Content"
                                    >
                                        <i className="fas fa-plus me-1"></i>
                                        Add Content
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {whyChooseUsData.map((item, index) => (
                                <div key={item._id} className="col-12 mb-4">
                                    <div className="card border-warning">
                                        <div className="card-body">
                                            <div className="row align-items-center">
                                                {item.image && (
                                                    <div className="col-md-4 mb-3 mb-md-0">
                                                        <img
                                                            src={(() => {
                                                                const url = typeof item.image === 'string' ? item.image : item.image.url;
                                                                return url && url.startsWith('/uploads/images/')
                                                                    ? `http://localhost:8000${url}`
                                                                    : `http://localhost:3000${url}`;
                                                            })()}
                                                            alt={item.heading}
                                                            className="img-fluid rounded"
                                                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                )}
                                                <div className={item.image ? 'col-md-8' : 'col-12'}>
                                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                                        <div>
                                                            <h3 className="text-warning mb-2">{item.heading}</h3>
                                                            <div className="text-muted mb-3" dangerouslySetInnerHTML={{ __html: item.description || item.title || '' }}></div>
                                                        </div>
                                                        {isAuthenticated && (
                                                            <div className="btn-group">
                                                                <button
                                                                    className="btn btn-outline-warning btn-sm"
                                                                    onClick={() => handleEditWhyChooseUs(item)}
                                                                    title="Edit"
                                                                >
                                                                    <i className="bi bi-pencil-square"></i>
                                                                </button>
                                                                <button
                                                                    className="btn btn-outline-danger btn-sm"
                                                                    onClick={() => handleDeleteWhyChooseUs(item._id)}
                                                                    title="Delete"
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {item.points && item.points.length > 0 && (
                                                        <div className="mb-3">
                                                            <ul className="list-unstyled">
                                                                {item.points.map((point, pointIndex) => (
                                                                    <li key={pointIndex} className="mb-2">
                                                                        <i className="fas fa-check-circle text-success me-2"></i>
                                                                        {typeof point === 'string' ? point : (point.text || point.title || point.description || '')}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {item.button && (
                                                        <button className="btn btn-warning">
                                                            {typeof item.button === 'string' ? item.button : (item.button.text || '')}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {whyChooseUsData.length === 0 && (
                <div className="card mb-4 mt-4">
                    <div className="card-header">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="card-title mb-0">
                                <i className="fas fa-star me-2"></i>
                                Why Choose Us
                            </h4>
                            {isAuthenticated && (
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => setShowWhyChooseUsForm(true)}
                                    title="Add Why Choose Us Content"
                                >
                                    <i className="fas fa-plus me-1"></i>
                                    Add Content
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="card-body text-center">
                        <div className="py-4">
                            <i className="fas fa-star display-1 mb-3 text-warning"></i>
                            <h5>No Why Choose Us Content Yet</h5>
                            <p>Add content to showcase why customers should choose your services.</p>
                            {isAuthenticated && (
                                <button
                                    className="btn btn-warning"
                                    onClick={() => setShowWhyChooseUsForm(true)}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Add Why Choose Us Content
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Why Choose Us Form */}
            {showWhyChooseUsForm && (
                <div className="card mb-4 mt-4">
                    <div className="card-header">
                        <h5 className="card-title mb-0">
                            {isEditingWhyChooseUs ? 'Edit Why Choose Us Content' : 'Add New Why Choose Us Content'}
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleWhyChooseUsSubmit}>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="whyChooseUsHeading" className="form-label">Heading *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="whyChooseUsHeading"
                                        name="heading"
                                        value={whyChooseUsFormData.heading}
                                        onChange={handleWhyChooseUsChange}
                                        placeholder="Enter main heading (e.g., 'Why Choose Us')"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="whyChooseUsTitle" className="form-label">Title *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="whyChooseUsTitle"
                                        name="title"
                                        value={whyChooseUsFormData.title}
                                        onChange={handleWhyChooseUsChange}
                                        placeholder="Enter subtitle or description"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="whyChooseUsButton" className="form-label">Button Text</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="whyChooseUsButton"
                                        name="button"
                                        value={typeof whyChooseUsFormData.button === 'string' ? whyChooseUsFormData.button : (whyChooseUsFormData.button?.text || '')}
                                        onChange={handleWhyChooseUsChange}
                                        placeholder="Enter button text (optional)"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="whyChooseUsImage" className="form-label">Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="whyChooseUsImage"
                                        accept="image/*"
                                        onChange={handleWhyChooseUsImageChange}
                                    />
                                    <small className="form-text text-muted">
                                        Upload an image to represent why customers should choose you
                                    </small>
                                </div>
                            </div>

                            {/* Points Section */}
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="mb-0">Key Points</h6>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={() => setShowPointForm(!showPointForm)}
                                        >
                                            <i className="fas fa-plus me-1"></i>
                                            Add Point
                                        </button>
                                    </div>

                                    {/* Add Point Form */}
                                    {showPointForm && (
                                        <div className="card mb-3">
                                            <div className="card-body">
                                                <div className="row">
                                                    <div className="col-12 mb-2">
                                                        <label className="form-label">Point *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={pointFormData}
                                                            onChange={(e) => setPointFormData(e.target.value)}
                                                            placeholder="Enter a key point"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-success"
                                                        onClick={addPoint}
                                                    >
                                                        Add Point
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-secondary"
                                                        onClick={() => setShowPointForm(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Display Added Points */}
                                    {whyChooseUsFormData.points.length > 0 && (
                                        <div className="row">
                                            {whyChooseUsFormData.points.map((point, index) => (
                                                <div key={index} className="col-md-6 col-lg-4 mb-3">
                                                    <div className="card border-success">
                                                        <div className="card-body">
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <span className="text-success">
                                                                    <i className="fas fa-check-circle me-2"></i>
                                                                    {typeof point === 'string' ? point : (point.text || point.title || point.description || '')}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm btn-outline-danger ms-2"
                                                                    onClick={() => removePoint(index)}
                                                                    title="Remove point"
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>
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
                                    disabled={whyChooseUsLoading}
                                >
                                    {whyChooseUsLoading ? 'Saving...' : (isEditingWhyChooseUs ? 'Update' : 'Create')}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetWhyChooseUsForm}
                                    disabled={whyChooseUsLoading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Our Founder Section */}
            <div className="card mb-4 mt-4">
                <div className="card-header">
                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="card-title mb-0">
                            <i className="fas fa-user-tie me-2 text-primary"></i>
                            Our Founder
                        </h4>
                        {isAuthenticated && (
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => setShowOurFounderForm(true)}
                                title="Add New Our Founder Content"
                            >
                                <i className="fas fa-plus me-2"></i>
                                Add Content
                            </button>
                        )}
                    </div>
                </div>
                <div className="card-body">
                    {ourFounderData.length > 0 ? (
                        <div className="row">
                            {ourFounderData.map((founder) => (
                                <div key={founder._id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100 border-0 shadow-sm">
                                        <div className="position-relative">
                                            <img
                                                src={founder.image?.url ? getImageUrl(founder.image.url) : '/api/placeholder/300/300'}
                                                alt={founder.image?.altText || founder.name}
                                                className="card-img-top"
                                                style={{ height: '250px', objectFit: 'cover' }}
                                            />
                                            {isAuthenticated && (
                                                <div className="position-absolute top-0 end-0 m-2">
                                                    <div className="btn-group" role="group">
                                                        <button
                                                            className="btn btn-sm btn-outline-light"
                                                            onClick={() => handleEditOurFounder(founder)}
                                                            title="Edit"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-light text-danger"
                                                            onClick={() => handleDeleteOurFounder(founder._id)}
                                                            title="Delete"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-body text-center">
                                            <h5 className="card-title text-primary">{founder.name}</h5>
                                            <p className="text-muted mb-2">
                                                <i className="fas fa-briefcase me-1"></i>
                                                {founder.designation}
                                            </p>
                                            <div
                                                className="card-text text-muted small"
                                                dangerouslySetInnerHTML={{ __html: founder.description }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-5">
                            <i className="fas fa-user-tie fa-3x text-muted mb-3"></i>
                            <h5>No Our Founder Content Yet</h5>
                            <p className="text-muted">Share information about your founder to build trust and connection.</p>
                            {isAuthenticated && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => setShowOurFounderForm(true)}
                                >
                                    <i className="fas fa-plus me-2"></i>
                                    Add Our Founder Content
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Our Founder Form */}
            {showOurFounderForm && (
                <div className="card mb-4 mt-4">
                    <div className="card-header">
                        <h5 className="card-title mb-0">
                            {isEditingOurFounder ? 'Edit Our Founder Content' : 'Add New Our Founder Content'}
                        </h5>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleOurFounderSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="ourFounderName" className="form-label">Name *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ourFounderName"
                                        name="name"
                                        value={ourFounderFormData.name}
                                        onChange={handleOurFounderChange}
                                        placeholder="Enter founder's name"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="ourFounderDesignation" className="form-label">Designation *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="ourFounderDesignation"
                                        name="designation"
                                        value={ourFounderFormData.designation}
                                        onChange={handleOurFounderChange}
                                        placeholder="Enter designation (e.g., Founder & CEO)"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="ourFounderDescription" className="form-label">Description *</label>
                                    <ReactQuill
                                        theme="snow"
                                        value={ourFounderFormData.description}
                                        onChange={(value) => setOurFounderFormData({
                                            ...ourFounderFormData,
                                            description: value
                                        })}
                                        placeholder="Enter founder's background, vision, or message"
                                        style={{ height: '200px', marginBottom: '50px' }}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12 mb-3">
                                    <label htmlFor="ourFounderImage" className="form-label">Founder Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="ourFounderImage"
                                        accept="image/*"
                                        onChange={handleOurFounderImageChange}
                                    />
                                    <small className="form-text text-muted">
                                        Upload a professional photo of the founder
                                    </small>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={ourFounderLoading}
                                >
                                    {ourFounderLoading ? 'Saving...' : (isEditingOurFounder ? 'Update' : 'Create')}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={resetOurFounderForm}
                                    disabled={ourFounderLoading}
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