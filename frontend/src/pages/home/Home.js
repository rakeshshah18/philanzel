import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../../components/Alert';
import { homePageAPI, ourTrackAPI, servicesAPI, tabbingServicesSettingsAPI, helpedIndustriesAPI, whyChooseUsAPI, ourAssociationAPI, homeFAQsAPI } from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    const baseUrl = process.env.NODE_ENV === 'production'
        ? 'https://philanzel-backend.vercel.app'
        : 'http://localhost:8000';
    if (imageUrl.startsWith('/uploads/')) {
        return `${baseUrl}${imageUrl}`;
    }
    if (imageUrl.startsWith('/images/')) {
        return `${baseUrl}${imageUrl}`;
    }
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
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.body.classList.contains('dark-mode'));
        };
        checkDarkMode();
        const observer = new MutationObserver(() => {
            checkDarkMode();
        });
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['class']
        });
        return () => observer.disconnect();
    }, []);
    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        button: { text: '', link: '' },
        image: { file: null, altText: '' }
    });
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
    const [homeServices, setHomeServices] = useState([
        {
            id: 1,
            serviceName: 'What We Offer',
            description: 'Discover personalized financial solutions crafted to help you achieve both personal and business success.'
        }
    ]);
    const [editingHomeService, setEditingHomeService] = useState(null);
    const [homeServiceFormData, setHomeServiceFormData] = useState({
        serviceName: '',
        description: ''
    });
    const { isAuthenticated, loading: authLoading } = useAuth();
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            const initializeData = async () => {
                try {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    await fetchHomePages();
                    setTimeout(() => {
                        fetchTrackData();
                    }, 300);
                } catch (error) {
                    console.error('Error initializing data:', error);
                }
            };
            initializeData();
        }
    }, [authLoading, isAuthenticated]);
    const fetchHomePages = async () => {
        setFetchLoading(true);
        try {
            const response = await homePageAPI.getAll();
            if (response.data && response.data.data) {
                setHomePages(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching homepage content:', error);
            console.error('Error details:', {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message
            });
            setMessage(`Failed to fetch homepage content. ${error.response?.data?.message || error.message}`);
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
                setMessage('Banner updated successfully!');
            } else {
                await homePageAPI.createWithFile(submitData);
                setMessage('Banner created successfully!');
            }
            resetForm();
            fetchHomePages();
            setShowForm(false);
        } catch (error) {
            setMessage('Failed to save banner. Please try again.');
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
            setMessage('Banner deleted successfully!');
        } catch (error) {
            setMessage('Failed to delete banner.');
        }
    };
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
            if (error.response?.status !== 404 && error.response?.status !== 0) {
                setTrackMessage('Failed to fetch track record.');
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
                setTrackMessage('Track record updated successfully!');
            } else {
                response = await ourTrackAPI.create(submitData);
                setTrackMessage('Track record created successfully!');
                setIsTrackEditing(true);
            }
            setTrackData(response.data.data);
            setShowTrackForm(false);
            resetTrackForm();
        } catch (error) {
            console.error('Error saving track data:', error);
            setTrackMessage(error.response?.data?.message || 'Failed to save track record.');
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
    const handleEditHomeService = (service) => {
        setHomeServiceFormData({
            serviceName: service.serviceName,
            description: service.description
        });
        setEditingHomeService(service.id);
    };
    const handleSaveHomeService = () => {
        setHomeServices(prev =>
            prev.map(service =>
                service.id === editingHomeService
                    ? { ...service, ...homeServiceFormData }
                    : service
            )
        );
        setEditingHomeService(null);
        setHomeServiceFormData({ serviceName: '', description: '' });
    };
    const handleCancelHomeServiceEdit = () => {
        setEditingHomeService(null);
        setHomeServiceFormData({ serviceName: '', description: '' });
    };
    const handleDeleteHomeService = (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            setHomeServices(prev => prev.filter(service => service.id !== id));
        }
    };
    const handleAddHomeService = () => {
        const newId = Math.max(...homeServices.map(s => s.id)) + 1;
        const newService = {
            id: newId,
            serviceName: 'New Service',
            description: 'Enter service description here...'
        };
        setHomeServices(prev => [...prev, newService]);
        setEditingHomeService(newId);
        setHomeServiceFormData({
            serviceName: newService.serviceName,
            description: newService.description
        });
    };
    const [sliderIndex, setSliderIndex] = useState(0);
    const sliderRef = useRef(null);
    useEffect(() => {
        if (!homePages.length) return;
        const interval = setInterval(() => {
            setSliderIndex(prev => (prev + 1) % homePages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [homePages.length]);
    const goToSlide = idx => setSliderIndex(idx);
    const prevSlide = () => setSliderIndex(idx => idx === 0 ? homePages.length - 1 : idx - 1);
    const nextSlide = () => setSliderIndex(idx => (idx + 1) % homePages.length);
    return (
        <div style={{
            backgroundColor: isDarkMode ? '#121212' : '#f8f9fa',
            minHeight: '100vh',
            color: isDarkMode ? '#ffffff' : 'inherit'
        }}>
            <div className="container-fluid px-4 py-3">
                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h2 className="mb-0" style={{ color: isDarkMode ? '#ffffff' : '#333' }}>Home</h2>
                    <nav style={{ fontSize: '14px' }}>
                        <span style={{ color: isDarkMode ? '#0dcaf0' : '#17a2b8' }}>Admin</span>
                        <span className="mx-2" style={{ color: isDarkMode ? '#adb5bd' : '#6c757d' }}>›</span>
                        <span style={{ color: isDarkMode ? '#adb5bd' : '#6c757d' }}>Home</span>
                    </nav>
                </div>
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
                    <div className="card mb-4" style={{ border: isDarkMode ? '1px solid #444' : '1px solid #dee2e6' }}>
                        <div className="card-header" style={{
                            backgroundColor: isDarkMode ? '#2a2a2a' : '#fff',
                            borderBottom: isDarkMode ? '1px solid #444' : '1px solid #dee2e6',
                            color: isDarkMode ? '#ffffff' : 'inherit'
                        }}>
                            <h5 className="card-title mb-0" style={{ color: isDarkMode ? '#ffffff' : '#333' }}>
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

                {/* Custom Home Slider */}
                {homePages.length > 0 && (
                    <div className="custom-slider" style={{ position: 'relative', maxWidth: 900, margin: '0 auto 2rem', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', background: '#fff' }}>
                       <div style={{ position: 'absolute', top: 24, left: 32, display: 'flex', gap: 10, zIndex: 2 }}>
                            <button
                                className="btn btn-info"
                                style={{ fontWeight: 500, fontSize: 18, borderRadius: 6, padding: '6px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title={isEditing ? 'Cancel' : 'Add New'}
                                onClick={() => { if (isEditing) { handleCancelEdit(); } else { setShowForm(!showForm); } }}
                            >
                                {isEditing ? <i className="bi bi-x-lg"></i> : <i className="bi bi-plus-lg"></i>}
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ fontWeight: 500, fontSize: 18, borderRadius: 6, padding: '6px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                title="Refresh"
                                onClick={fetchHomePages}
                                disabled={fetchLoading}
                            >
                                {fetchLoading ? <i className="bi bi-arrow-repeat"></i> : <i className="bi bi-arrow-clockwise"></i>}
                            </button>
                        </div>
                        <div style={{ display: 'flex', transition: 'transform 2.6s cubic-bezier(.4,0,.2,1)', transform: `translateX(-${sliderIndex * 100}%)` }} ref={sliderRef}>
                            {homePages.map((slide, idx) => (
                                <div key={slide._id || idx} style={{ minWidth: '100%', boxSizing: 'border-box', padding: 0, position: 'relative', height: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f7fa' }}>
                                    <div style={{ position: 'absolute', top: 24, right: 32, display: 'flex', gap: 10, zIndex: 2 }}>
                                        <button
                                            style={{ background: '#17a2b8', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 15, cursor: 'pointer' }}
                                            onClick={() => handleEdit(slide)}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </button>
                                        <button
                                            style={{ background: '#dc3545', color: 'white', border: 'none', borderRadius: 6, padding: '6px 14px', fontSize: 15, cursor: 'pointer' }}
                                            onClick={() => deleteHomePage(slide._id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', width: '90%', height: '80%', background: 'rgba(255,255,255,0.95)', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'relative', alignItems: 'center', justifyContent: 'flex-start', margin: '0 auto' }}>
                                        {/* Image on left */}
                                        <div style={{ flex: '0 0 240px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                            {slide.image?.url && (
                                                <img src={getImageUrl(slide.image.url)} alt={slide.image?.altText || slide.heading} style={{ maxHeight: 220, maxWidth: 220, objectFit: 'cover', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
                                            )}
                                        </div>
                                        {/* Content on right */}
                                        <div style={{ flex: 1, padding: '2rem 2rem 1rem 2rem', minWidth: 0 }}>
                                            <h2 style={{ margin: '0 0 12px 0', fontWeight: 700, color: '#1565c0', fontSize: 28 }}>{slide.heading}</h2>
                                            <div style={{ margin: '0.5rem 0 0', color: '#333', fontSize: 18 }} dangerouslySetInnerHTML={{ __html: slide.description }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Navigation Arrows */}
                        <button onClick={prevSlide} style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', fontSize: 22, color: '#1565c0', zIndex: 2 }}>&lt;</button>
                        <button onClick={nextSlide} style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)', background: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', fontSize: 22, color: '#1565c0', zIndex: 2 }}>&gt;</button>
                        {/* Dots */}
                        <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center' }}>
                            {homePages.map((_, idx) => (
                                <span key={idx} onClick={() => goToSlide(idx)} style={{ display: 'inline-block', width: 12, height: 12, margin: '0 6px', borderRadius: '50%', background: sliderIndex === idx ? '#1565c0' : '#bbdefb', cursor: 'pointer', transition: 'background 0.2s' }} />
                            ))}
                        </div>
                    </div>
                )}

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
                        <div className="row g-4 dashboard-track-row">
                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="dashboard-card h-100" style={{ background: isDarkMode ? '#1e293b' : '#e3fcec', border: 'none', borderRadius: 16, boxShadow: isDarkMode ? '0 2px 12px #0006' : '0 2px 12px #b2f2e6' }}>
                                    <div className="dashboard-card-body text-center py-4">
                                        <div className="dashboard-icon mb-2" style={{ fontSize: 44, color: '#22c55e' }}>
                                            <i className="fas fa-calendar-alt"></i>
                                        </div>
                                        <div className="dashboard-value fw-bold" style={{ fontSize: 32, color: '#22c55e' }}>
                                            {trackData.yearExp ? trackData.yearExp.toLocaleString() : '0'}
                                        </div>
                                        <div className="dashboard-label text-muted mt-1">Years of Experience</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="dashboard-card h-100" style={{ background: isDarkMode ? '#1e293b' : '#e0f2fe', border: 'none', borderRadius: 16, boxShadow: isDarkMode ? '0 2px 12px #0006' : '0 2px 12px #bae6fd' }}>
                                    <div className="dashboard-card-body text-center py-4">
                                        <div className="dashboard-icon mb-2" style={{ fontSize: 44, color: '#0ea5e9' }}>
                                            <i className="fas fa-users"></i>
                                        </div>
                                        <div className="dashboard-value fw-bold" style={{ fontSize: 32, color: '#0ea5e9' }}>
                                            {trackData.totalExpert ? trackData.totalExpert.toLocaleString() : '0'}
                                        </div>
                                        <div className="dashboard-label text-muted mt-1">Total Experts</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="dashboard-card h-100" style={{ background: isDarkMode ? '#1e293b' : '#fff7e6', border: 'none', borderRadius: 16, boxShadow: isDarkMode ? '0 2px 12px #0006' : '0 2px 12px #ffe7ba' }}>
                                    <div className="dashboard-card-body text-center py-4">
                                        <div className="dashboard-icon mb-2" style={{ fontSize: 44, color: '#f59e42' }}>
                                            <i className="fas fa-tasks"></i>
                                        </div>
                                        <div className="dashboard-value fw-bold" style={{ fontSize: 32, color: '#f59e42' }}>
                                            {trackData.planningDone ? trackData.planningDone.toLocaleString() : '0'}
                                        </div>
                                        <div className="dashboard-label text-muted mt-1">Projects Completed</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-sm-6 col-lg-3">
                                <div className="dashboard-card h-100" style={{ background: isDarkMode ? '#1e293b' : '#ffe4e6', border: 'none', borderRadius: 16, boxShadow: isDarkMode ? '0 2px 12px #0006' : '0 2px 12px #fecdd3' }}>
                                    <div className="dashboard-card-body text-center py-4">
                                        <div className="dashboard-icon mb-2" style={{ fontSize: 44, color: '#ef4444' }}>
                                            <i className="fas fa-smile"></i>
                                        </div>
                                        <div className="dashboard-value fw-bold" style={{ fontSize: 32, color: '#ef4444' }}>
                                            {trackData.happyCustomers ? trackData.happyCustomers.toLocaleString() : '0'}
                                        </div>
                                        <div className="dashboard-label text-muted mt-1">Happy Customers</div>
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
                            <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: isDarkMode ? '#23272f' : '#f8fafc', border: 'none', boxShadow: isDarkMode ? '0 2px 12px #0006' : '0 2px 12px #e0e7ef' }}>
                                <div className="dashboard-card-header px-4 py-3" style={{ background: isDarkMode ? '#1e293b' : '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                                    <h4 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
                                        <i className="fas fa-home me-2"></i>
                                        Home Services
                                    </h4>
                                </div>
                                <div className="dashboard-card-body px-4 py-4">
                                    <div className="table-responsive">
                                        <table className="table table-borderless align-middle dashboard-table">
                                            <thead style={{ background: isDarkMode ? '#334155' : '#e3eafc' }}>
                                                <tr>
                                                    <th style={{ width: 40, color: isDarkMode ? '#fff' : '#333' }}>#</th>
                                                    <th style={{ color: isDarkMode ? '#fff' : '#333' }}>Service Name</th>
                                                    <th style={{ color: isDarkMode ? '#fff' : '#333' }}>Description</th>
                                                    <th style={{ color: isDarkMode ? '#fff' : '#333' }}>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {homeServices.map((service, index) => (
                                                    <tr key={service.id} style={{ background: isDarkMode ? (index % 2 === 0 ? '#23272f' : '#1e293b') : (index % 2 === 0 ? '#f8fafc' : '#e3eafc') }}>
                                                        <td style={{ fontWeight: 600, color: '#1565c0' }}>{index + 1}</td>
                                                        <td>
                                                            {editingHomeService === service.id ? (
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={homeServiceFormData.serviceName}
                                                                    onChange={(e) => setHomeServiceFormData(prev => ({
                                                                        ...prev,
                                                                        serviceName: e.target.value
                                                                    }))}
                                                                />
                                                            ) : (
                                                                <span style={{ fontWeight: 600, color: isDarkMode ? '#fff' : '#222' }}>{service.serviceName}</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingHomeService === service.id ? (
                                                                <div style={{ minHeight: '120px' }}>
                                                                    <ReactQuill
                                                                        theme="snow"
                                                                        value={homeServiceFormData.description}
                                                                        onChange={(value) => setHomeServiceFormData(prev => ({
                                                                            ...prev,
                                                                            description: value
                                                                        }))}
                                                                        modules={{
                                                                            toolbar: [
                                                                                [{ 'header': [1, 2, false] }],
                                                                                ['bold', 'italic', 'underline'],
                                                                                ['link'],
                                                                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                                ['clean']
                                                                            ]
                                                                        }}
                                                                        formats={[
                                                                            'header',
                                                                            'bold', 'italic', 'underline',
                                                                            'link',
                                                                            'list', 'bullet'
                                                                        ]}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div style={{ color: isDarkMode ? '#cbd5e1' : '#444' }} dangerouslySetInnerHTML={{ __html: service.description }} />
                                                            )}
                                                        </td>
                                                        <td>
                                                            {editingHomeService === service.id ? (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-success me-2"
                                                                        onClick={handleSaveHomeService}
                                                                    >
                                                                        <i className="fas fa-save"></i> Save
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-secondary"
                                                                        onClick={handleCancelHomeServiceEdit}
                                                                    >
                                                                        <i className="fas fa-times"></i> Cancel
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary me-2"
                                                                        onClick={() => handleEditHomeService(service)}
                                                                    >
                                                                        <i className="fas fa-edit"></i> Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => handleDeleteHomeService(service.id)}
                                                                    >
                                                                        <i className="bi bi-trash"></i> Delete
                                                                    </button>
                                                                </>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-3 text-end">
                                        <button
                                            className="btn btn-success px-4 py-2"
                                            style={{ borderRadius: 8, fontWeight: 600, fontSize: 16 }}
                                            onClick={handleAddHomeService}
                                        >
                                            <i className="fas fa-plus me-2"></i>
                                            Add New Service
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <TabbingServices />
                <HelpedIndustries />
                <WhyChooseUs />
                <OurAssociation />
                <HomeFAQs />
            </div>
        </div>
    );
};
const TabbingServices = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [commonImage, setCommonImage] = useState('/images/services/default-service.svg');
    const [commonImageDescription, setCommonImageDescription] = useState('Transform your financial future with our comprehensive services');
    const [commonImageButton, setCommonImageButton] = useState({
        text: 'Get Started',
        link: '#'
    });
    const [editingCommonSection, setEditingCommonSection] = useState(false);
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
    const fetchTabbingServices = async () => {
        try {
            setFetchingServices(true);
            const [servicesResponse, settingsResponse] = await Promise.all([
                servicesAPI.getAll(),
                tabbingServicesSettingsAPI.getSettings().catch(err => {
                    console.warn('Could not load settings:', err);
                    return null;
                })
            ]);

            // Load services
            if (servicesResponse.data && servicesResponse.data.data) {
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
            }
            if (settingsResponse && settingsResponse.data && settingsResponse.data.data) {
                const settings = settingsResponse.data.data;
                if (settings.commonBackgroundImage && settings.commonBackgroundImage.url) {
                    setCommonImage(getImageUrl(settings.commonBackgroundImage.url));
                }
                if (settings.commonImageDescription) {
                    setCommonImageDescription(settings.commonImageDescription);
                }
                if (settings.commonImageButton) {
                    setCommonImageButton({
                        text: settings.commonImageButton.text || 'Get Started',
                        link: settings.commonImageButton.link || '#'
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching services:', error);
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
    useEffect(() => {
        fetchTabbingServices();
    }, []);
    const handleEditClick = (index) => {
        setEditingIndex(index);
        const service = tabbingServices[index];
        setEditFormData({
            tabTitle: service.tabTitle,
            contentTitle: service.contentTitle,
            description: service.description,
            buttonText: service.buttonText,
            icon: service.icon || service.image
        });
        setImagePreview(null);
        setSelectedImageFile(null);
        setIsEditing(true);
    };
    const handleSaveEdit = async () => {
        try {
            setLoading(true);
            const service = tabbingServices[editingIndex];
            const formData = new FormData();
            formData.append('title', editFormData.contentTitle);
            formData.append('tabTitle', editFormData.tabTitle);
            formData.append('contentTitle', editFormData.contentTitle);
            formData.append('description', editFormData.description);
            formData.append('buttonText', editFormData.buttonText);
            if (selectedImageFile) {
                formData.append('image', selectedImageFile);
            }
            let response;
            if (service.id && !service.id.toString().startsWith('temp-')) {
                response = await servicesAPI.updateWithFile(service.id, formData);
            } else {
                response = await servicesAPI.createWithFile(formData);
            }
            if (response.data && response.data.data) {
                await fetchTabbingServices();
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
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
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
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
                handleInputChange('icon', e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleCommonImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, or SVG)');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Image file size should be less than 5MB');
                return;
            }
            setSelectedCommonImageFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setCommonImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleSaveCommonImage = async () => {
        if (!selectedCommonImageFile) {
            alert('Please select an image first');
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('commonBackgroundImage', selectedCommonImageFile);
            const response = await tabbingServicesSettingsAPI.updateCommonBackgroundImage(formData);
            if (response.data.success) {
                const newImageUrl = getImageUrl(response.data.data.commonBackgroundImage.url);
                setCommonImage(newImageUrl);
                setCommonImagePreview(null);
                setSelectedCommonImageFile(null);
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
    const handleResetCommonImage = async () => {
        if (!window.confirm('Are you sure you want to reset the common background image to default?')) {
            return;
        }
        try {
            setLoading(true);
            const response = await tabbingServicesSettingsAPI.resetCommonBackgroundImage();
            if (response.data.success) {
                setCommonImage('/images/services/default-service.svg');
                setCommonImagePreview(null);
                setSelectedCommonImageFile(null);
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
    const handleAddNewTab = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('title', 'New Service');
            formData.append('tabTitle', 'New Tab');
            formData.append('contentTitle', 'New Service');
            formData.append('description', 'This is a new service description. Click edit to customize it.');
            formData.append('buttonText', 'Learn More');
            formData.append('color', 'primary');
            const response = await servicesAPI.createWithFile(formData);
            if (response.data && response.data.data) {
                await fetchTabbingServices();
                alert('New tab created successfully!');
            }
        } catch (error) {
            console.error('Error creating new tab:', error);
            alert(`Error creating new tab: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteTab = async (index) => {
        if (!window.confirm('Are you sure you want to delete this tab? This action cannot be undone.')) {
            return;
        }
        try {
            setLoading(true);
            const service = tabbingServices[index];
            if (service.id && !service.id.toString().startsWith('temp-')) {
                const response = await servicesAPI.delete(service.id);
                if (editingIndex === index) {
                    handleCancelEdit();
                }
                await fetchTabbingServices();
                const remainingServices = tabbingServices.length - 1;
                if (activeTab >= remainingServices) {
                    setActiveTab(Math.max(0, remainingServices - 1));
                } else if (activeTab > index) {
                    setActiveTab(activeTab - 1);
                }
                alert('Tab deleted successfully!');
            } else {
                console.log('Removing temp service from local state');
                const updatedServices = tabbingServices.filter((_, i) => i !== index);
                setTabbingServices(updatedServices);
                if (activeTab >= updatedServices.length) {
                    setActiveTab(Math.max(0, updatedServices.length - 1));
                } else if (activeTab > index) {
                    setActiveTab(activeTab - 1);
                }
                alert('Tab removed successfully!');
            }
        } catch (error) {
            console.error('Error deleting tab:', error);
            alert(`Error deleting tab: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleEditCommonSection = () => {
        setEditingCommonSection(true);
    };
    const handleSaveCommonSection = async () => {
        try {
            setLoading(true);
            const response = await tabbingServicesSettingsAPI.updateCommonSettings({
                description: commonImageDescription,
                buttonText: commonImageButton.text,
                buttonLink: commonImageButton.link
            });
            if (response.data.success) {
                setEditingCommonSection(false);
                console.log('Common section updated successfully');
                alert('Common section settings updated successfully!');
            } else {
                throw new Error(response.data.message || 'Failed to update settings');
            }
        } catch (error) {
            console.error('Error saving common section:', error);
            alert('Failed to save common section settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const handleCancelCommonSection = () => {
        setEditingCommonSection(false);
        fetchTabbingServices();
    };
    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                        <div className="dashboard-card-header px-4 py-3 d-flex justify-content-between align-items-center" style={{ background: '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                            <h4 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
                                <i className="fas fa-layer-group me-2"></i>
                                Tabbing Services
                                {fetchingServices && (
                                    <span className="spinner-border spinner-border-sm ms-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </span>
                                )}
                            </h4>
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
                        <div className="dashboard-card-body px-4 py-4">
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
                            <div className="mb-4 p-3 border rounded">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h6 className="mb-0">
                                        <i className="fas fa-text-height me-2"></i>
                                        Common Section Content
                                    </h6>
                                    {!editingCommonSection && (
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={handleEditCommonSection}
                                            disabled={loading}
                                        >
                                            <i className="fas fa-edit me-1"></i>
                                            Edit
                                        </button>
                                    )}
                                </div>
                                {!editingCommonSection ? (
                                    <div className="row">
                                        <div className="col-md-8">
                                            <div className="mb-2">
                                                <small className="text-muted">Description:</small>
                                                <div className="p-2 bg-light rounded">
                                                    <div dangerouslySetInnerHTML={{ __html: commonImageDescription }} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-2">
                                                <small className="text-muted">Button:</small>
                                                <div className="p-2 bg-light rounded">
                                                    <strong>Text:</strong> {commonImageButton.text}<br />
                                                    <strong>Link:</strong> {commonImageButton.link}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="row mb-3">
                                            <div className="col-md-8">
                                                <label className="form-label small">Description</label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={commonImageDescription}
                                                    onChange={(value) => setCommonImageDescription(value)}
                                                    placeholder="Enter description for the common section"
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': [1, 2, false] }],
                                                            ['bold', 'italic', 'underline'],
                                                            ['link'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['clean']
                                                        ]
                                                    }}
                                                    formats={[
                                                        'header',
                                                        'bold', 'italic', 'underline',
                                                        'link',
                                                        'list', 'bullet'
                                                    ]}
                                                    style={{ minHeight: '120px' }}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small">Button Text</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm mb-2"
                                                    value={commonImageButton.text}
                                                    onChange={(e) => setCommonImageButton(prev => ({ ...prev, text: e.target.value }))}
                                                    placeholder="Button text"
                                                />
                                                <label className="form-label small">Button Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    value={commonImageButton.link}
                                                    onChange={(e) => setCommonImageButton(prev => ({ ...prev, link: e.target.value }))}
                                                    placeholder="Button link (e.g., #contact, /about)"
                                                />
                                            </div>
                                        </div>
                                        <div className="d-flex gap-2">
                                            <button
                                                className="btn btn-success btn-sm"
                                                onClick={handleSaveCommonSection}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-1"></span>
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
                                                className="btn btn-secondary btn-sm"
                                                onClick={handleCancelCommonSection}
                                                disabled={loading}
                                            >
                                                <i className="fas fa-times me-1"></i>
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
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
                                            <ReactQuill
                                                theme="snow"
                                                value={editFormData.description}
                                                onChange={(value) => handleInputChange('description', value)}
                                                placeholder="Service description"
                                                modules={{
                                                    toolbar: [
                                                        [{ 'header': [1, 2, false] }],
                                                        ['bold', 'italic', 'underline'],
                                                        ['link'],
                                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                        ['clean']
                                                    ]
                                                }}
                                                formats={[
                                                    'header',
                                                    'bold', 'italic', 'underline',
                                                    'link',
                                                    'list', 'bullet'
                                                ]}
                                                style={{ minHeight: '120px' }}
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
                            {fetchingServices && (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-success" role="status">
                                        <span className="visually-hidden">Loading services...</span>
                                    </div>
                                    <p className="mt-3 text-muted">Loading services from database...</p>
                                </div>
                            )}
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
                            {!fetchingServices && tabbingServices.length > 0 && (
                                <div className="row mb-4">
                                    <div className="col-12">
                                        <div className="d-flex flex-wrap align-items-center gap-2">
                                            {tabbingServices.map((service, index) => (
                                                <div key={service.id} className="position-relative">
                                                    <button
                                                        type="button"
                                                        className={`btn btn-outline-${service.color} ${activeTab === index ? 'active' : ''} d-flex align-items-center justify-content-between`}
                                                        onClick={() => !isEditing && setActiveTab(index)}
                                                        disabled={isEditing}
                                                        style={{
                                                            fontSize: '14px',
                                                            minWidth: '140px',
                                                            padding: '8px 12px',
                                                            opacity: isEditing && index !== activeTab ? 0.5 : 1
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center">
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
                                                            <span>
                                                                {isEditing && editingIndex === index ? editFormData.tabTitle : service.tabTitle}
                                                                {isEditing && editingIndex === index && (
                                                                    <small className="ms-1">*</small>
                                                                )}
                                                            </span>
                                                        </div>
                                                        {tabbingServices.length > 1 && !isEditing && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm ms-2 p-0"
                                                                style={{
                                                                    width: '18px',
                                                                    height: '18px',
                                                                    fontSize: '12px',
                                                                    color: '#dc3545',
                                                                    background: 'transparent',
                                                                    border: 'none',
                                                                    borderRadius: '3px',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center'
                                                                }}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteTab(index);
                                                                }}
                                                                title="Delete tab"
                                                                onMouseEnter={(e) => {
                                                                    e.target.style.backgroundColor = '#f8d7da';
                                                                }}
                                                                onMouseLeave={(e) => {
                                                                    e.target.style.backgroundColor = 'transparent';
                                                                }}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                            {!isEditing && (
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-primary btn-sm d-flex align-items-center"
                                                    onClick={handleAddNewTab}
                                                    disabled={loading}
                                                    style={{
                                                        fontSize: '12px',
                                                        minWidth: '100px'
                                                    }}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            Adding...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-plus me-1"></i>
                                                            Add Tab
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                                {isEditing && editingIndex === activeTab ? (
                                                    <div dangerouslySetInnerHTML={{ __html: editFormData.description }} />
                                                ) : (
                                                    <div dangerouslySetInnerHTML={{ __html: tabbingServices[activeTab].description }} />
                                                )}
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
const HelpedIndustries = () => {
    const [helpedIndustries, setHelpedIndustries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        industries: [{ name: '', icon: '' }]
    });
    const [addingIndustryTo, setAddingIndustryTo] = useState(null);
    const [newIndustry, setNewIndustry] = useState({ name: '', icon: '' });
    const [showIndustryForm, setShowIndustryForm] = useState(false);

    useEffect(() => {
        fetchHelpedIndustries();
    }, []);
    const fetchHelpedIndustries = async () => {
        try {
            setLoading(true);
            const response = await helpedIndustriesAPI.getAll();
            if (response.data && response.data.data) {
                setHelpedIndustries(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching helped industries:', error);
            setMessage(`❌ Failed to fetch helped industries. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleChange = (e, index = null, field = null) => {
        const { name, value } = e.target;
        if (field === 'industry') {
            const updatedIndustries = [...formData.industries];
            updatedIndustries[index][name] = value;
            setFormData(prev => ({
                ...prev,
                industries: updatedIndustries
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const handleAddIndustry = () => {
        setFormData(prev => ({
            ...prev,
            industries: [...prev.industries, { name: '', icon: '' }]
        }));
    };
    const handleRemoveIndustry = (index) => {
        setFormData(prev => ({
            ...prev,
            industries: prev.industries.filter((_, i) => i !== index)
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            const validIndustries = formData.industries.filter(
                industry => industry.name.trim() && industry.icon.trim()
            );
            if (validIndustries.length === 0) {
                setMessage('Please add at least one industry with name and icon.');
                return;
            }
            const submitData = {
                ...formData,
                industries: validIndustries
            };
            let response;
            if (isEditing) {
                response = await helpedIndustriesAPI.update(editingId, submitData);
                setMessage('Helped industries updated successfully!');
            } else {
                response = await helpedIndustriesAPI.create(submitData);
                setMessage('Helped industries created successfully!');
            }
            await fetchHelpedIndustries();
            resetForm();
        } catch (error) {
            console.error('Error saving helped industries:', error);
            setMessage(`Failed to save helped industries. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleEdit = (item) => {
        setFormData({
            heading: item.heading,
            description: item.description,
            industries: [...item.industries]
        });
        setIsEditing(true);
        setEditingId(item._id);
        setShowForm(true);
        setMessage('');
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this helped industries entry?')) {
            return;
        }
        try {
            setLoading(true);
            await helpedIndustriesAPI.delete(id);
            setMessage('Helped industries deleted successfully!');
            await fetchHelpedIndustries();
        } catch (error) {
            console.error('Error deleting helped industries:', error);
            setMessage(`Failed to delete helped industries. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteIndustry = async (itemId, industryIndex) => {
        if (!window.confirm('Are you sure you want to delete this industry?')) {
            return;
        }
        try {
            setLoading(true);
            const item = helpedIndustries.find(h => h._id === itemId);
            if (!item) {
                setMessage('Item not found');
                return;
            }
            const updatedIndustries = item.industries.filter((_, index) => index !== industryIndex);
            if (updatedIndustries.length === 0) {
                setMessage('Cannot delete the last industry. At least one industry is required.');
                return;
            }
            const updateData = {
                heading: item.heading,
                description: item.description,
                industries: updatedIndustries
            };
            await helpedIndustriesAPI.update(itemId, updateData);
            setMessage('Industry deleted successfully!');
            await fetchHelpedIndustries();
        } catch (error) {
            console.error('Error deleting industry:', error);
            setMessage(`Failed to delete industry. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleAddIndustryToEntry = async (itemId) => {
        if (!newIndustry.name.trim() || !newIndustry.icon.trim()) {
            setMessage('Please fill in both industry name and icon');
            return;
        }
        try {
            setLoading(true);
            const item = helpedIndustries.find(h => h._id === itemId);
            if (!item) {
                setMessage('Item not found');
                return;
            }
            const updatedIndustries = [...item.industries, { ...newIndustry }];
            const updateData = {
                heading: item.heading,
                description: item.description,
                industries: updatedIndustries
            };
            await helpedIndustriesAPI.update(itemId, updateData);
            setMessage('Industry added successfully!');
            setNewIndustry({ name: '', icon: '' });
            setShowIndustryForm(false);
            setAddingIndustryTo(null);
            await fetchHelpedIndustries();
        } catch (error) {
            console.error('Error adding industry:', error);
            setMessage(`Failed to add industry. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const resetForm = () => {
        setFormData({
            heading: '',
            description: '',
            industries: [{ name: '', icon: '' }]
        });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
        setMessage('');
        setAddingIndustryTo(null);
        setNewIndustry({ name: '', icon: '' });
        setShowIndustryForm(false);
    };
    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col-12">
                    <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                        <div className="dashboard-card-header px-4 py-3" style={{ background: '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                            <h4 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
                                <i className="fas fa-industry me-2"></i>
                                Helped Industries
                            </h4>
                        </div>
                        <div className="dashboard-card-body px-4 py-4">
                            {message && (
                                <Alert
                                    message={message}
                                    onClose={() => setMessage('')}
                                />
                            )}
                            {showForm && (
                                <div className="mb-4">
                                    <div className="dashboard-card border-primary" style={{ borderRadius: 14, background: '#e3fcec' }}>
                                        <div className="dashboard-card-header px-3 py-2" style={{ background: '#22c55e', color: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                                            <h5 className="mb-0">
                                                {isEditing ? 'Edit Helped Industries' : 'Add New Helped Industries'}
                                            </h5>
                                        </div>
                                        <div className="dashboard-card-body px-3 py-3">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row mb-3">
                                                    <div className="col-md-6">
                                                        <label className="form-label">Heading *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="heading"
                                                            value={formData.heading}
                                                            onChange={handleChange}
                                                            placeholder="Enter heading"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label">Description *</label>
                                                        <ReactQuill
                                                            theme="snow"
                                                            value={formData.description}
                                                            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                                            placeholder="Enter description"
                                                            modules={{
                                                                toolbar: [
                                                                    [{ 'header': [1, 2, false] }],
                                                                    ['bold', 'italic', 'underline'],
                                                                    ['link'],
                                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                    ['clean']
                                                                ]
                                                            }}
                                                            formats={[
                                                                'header',
                                                                'bold', 'italic', 'underline',
                                                                'link',
                                                                'list', 'bullet'
                                                            ]}
                                                            style={{ minHeight: '120px' }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">Industries *</label>
                                                    {formData.industries.map((industry, index) => (
                                                        <div key={index} className="row mb-2 align-items-end">
                                                            <div className="col-md-5">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="name"
                                                                    value={industry.name}
                                                                    onChange={(e) => handleChange(e, index, 'industry')}
                                                                    placeholder="Industry name"
                                                                />
                                                            </div>
                                                            <div className="col-md-5">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    name="icon"
                                                                    value={industry.icon}
                                                                    onChange={(e) => handleChange(e, index, 'industry')}
                                                                    placeholder="FontAwesome icon class (e.g., fas fa-building)"
                                                                />
                                                            </div>
                                                            <div className="col-md-2">
                                                                {formData.industries.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-danger btn-sm"
                                                                        onClick={() => handleRemoveIndustry(index)}
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-info btn-sm mt-2"
                                                        onClick={handleAddIndustry}
                                                    >
                                                        <i className="fas fa-plus me-1"></i> Add Industry
                                                    </button>
                                                </div>

                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-save me-2"></i>
                                                                {isEditing ? 'Update' : 'Create'}
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={resetForm}
                                                    >
                                                        <i className="fas fa-times me-2"></i>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {!showForm && (
                                <div className="mb-3">
                                    <button
                                        className="btn btn-info"
                                        onClick={() => setShowForm(true)}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Add New Helped Industries
                                    </button>
                                </div>
                            )}
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-info" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : helpedIndustries.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No helped industries found. Click "Add New" to create one.</p>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {helpedIndustries.map((item) => (
                                        <div key={item._id} className="col-12 mb-2">
                                            <div className="dashboard-card border-primary" style={{ borderRadius: 14, background: '#e0f2fe', border: 'none', boxShadow: '0 2px 12px #bae6fd' }}>
                                                <div className="dashboard-card-header px-3 py-2 d-flex justify-content-between align-items-center" style={{ background: '#0ea5e9', color: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                                                    <h5 className="mb-0">{item.heading}</h5>
                                                    <div>
                                                        <button
                                                            className="btn btn-outline-primary btn-sm me-2"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <i className="fas fa-edit"></i> Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDelete(item._id)}
                                                        >
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="dashboard-card-body px-3 py-3">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <h6 className="text-muted">Description:</h6>
                                                                <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                                <h6 className="text-muted mb-0">Industries:</h6>
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => {
                                                                        setAddingIndustryTo(item._id);
                                                                        setShowIndustryForm(true);
                                                                    }}
                                                                >
                                                                    <i className="fas fa-plus"></i> Add Industry
                                                                </button>
                                                            </div>
                                                            {showIndustryForm && addingIndustryTo === item._id && (
                                                                <div className="dashboard-card border-success mb-3" style={{ background: '#fff', borderRadius: 10 }}>
                                                                    <div className="dashboard-card-body p-3">
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    placeholder="Industry Name"
                                                                                    value={newIndustry.name}
                                                                                    onChange={(e) => setNewIndustry({ ...newIndustry, name: e.target.value })}
                                                                                />
                                                                            </div>
                                                                            <div className="col-md-6">
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    placeholder="Icon Class (e.g., fas fa-industry)"
                                                                                    value={newIndustry.icon}
                                                                                    onChange={(e) => setNewIndustry({ ...newIndustry, icon: e.target.value })}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        <div className="mt-2 d-flex gap-2">
                                                                            <button
                                                                                className="btn btn-success btn-sm"
                                                                                onClick={() => handleAddIndustryToEntry(item._id)}
                                                                            >
                                                                                <i className="fas fa-check"></i> Add
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-secondary btn-sm"
                                                                                onClick={() => {
                                                                                    setShowIndustryForm(false);
                                                                                    setAddingIndustryTo(null);
                                                                                    setNewIndustry({ name: '', icon: '' });
                                                                                }}
                                                                            >
                                                                                <i className="fas fa-times"></i> Cancel
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                            {/* Industries Grid */}
                                                            <div className="row g-3">
                                                                {item.industries.map((industry, index) => (
                                                                    <div key={index} className="col-md-4 col-sm-6 mb-2">
                                                                        <div className="dashboard-card text-center p-3 position-relative" style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #bae6fd' }}>
                                                                            <button
                                                                                type="button"
                                                                                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                                                                style={{ fontSize: '10px', padding: '2px 4px' }}
                                                                                onClick={() => handleDeleteIndustry(item._id, index)}
                                                                                title="Delete this industry"
                                                                            >
                                                                                <i className="bi bi-trash"></i>
                                                                            </button>
                                                                            <div style={{ fontSize: 36, color: '#0ea5e9', marginBottom: 8 }}>
                                                                                <i className={`${industry.icon}`}></i>
                                                                            </div>
                                                                            <h6 className="small" style={{ fontWeight: 600, color: '#1565c0' }}>{industry.name}</h6>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Why Choose Us Component
const WhyChooseUs = () => {
    const [whyChooseUs, setWhyChooseUs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        points: [{ text: '', icon: 'fas fa-check' }],
        button: { text: 'Get Started', link: '#' },
        image: null
    });
    useEffect(() => {
        fetchWhyChooseUs();
    }, []);
    const fetchWhyChooseUs = async () => {
        try {
            setLoading(true);
            const response = await whyChooseUsAPI.getAll();
            setWhyChooseUs(response.data.data || []);
        } catch (error) {
            console.error('Error fetching why choose us:', error);
            setMessage(`Failed to fetch why choose us entries. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.heading.trim() || !formData.description.trim()) {
            setMessage('Please fill in all required fields');
            return;
        }
        try {
            setLoading(true);
            const submitFormData = new FormData();
            submitFormData.append('heading', formData.heading);
            submitFormData.append('description', formData.description);
            submitFormData.append('points', JSON.stringify(formData.points));
            submitFormData.append('button', JSON.stringify(formData.button));

            if (formData.image) {
                submitFormData.append('image', formData.image);
            }
            if (isEditing) {
                await whyChooseUsAPI.update(editingId, submitFormData);
                setMessage('Why choose us entry updated successfully!');
            } else {
                await whyChooseUsAPI.create(submitFormData);
                setMessage('Why choose us entry created successfully!');
            }
            resetForm();
            await fetchWhyChooseUs();
        } catch (error) {
            console.error('Error saving why choose us entry:', error);
            setMessage(`Failed to save why choose us entry. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleEdit = (item) => {
        setFormData({
            heading: item.heading,
            description: item.description,
            points: item.points,
            button: item.button,
            image: null
        });
        setIsEditing(true);
        setEditingId(item._id);
        setShowForm(true);
        setMessage('');
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this why choose us entry?')) {
            return;
        }
        try {
            setLoading(true);
            await whyChooseUsAPI.delete(id);
            setMessage('Why choose us entry deleted successfully!');
            await fetchWhyChooseUs();
        } catch (error) {
            console.error('Error deleting why choose us entry:', error);
            setMessage(`Failed to delete why choose us entry. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const addPoint = () => {
        setFormData({
            ...formData,
            points: [...formData.points, { text: '', icon: 'fas fa-check' }]
        });
    };
    const removePoint = (index) => {
        if (formData.points.length > 1) {
            setFormData({
                ...formData,
                points: formData.points.filter((_, i) => i !== index)
            });
        }
    };
    const updatePoint = (index, field, value) => {
        const updatedPoints = [...formData.points];
        updatedPoints[index][field] = value;
        setFormData({
            ...formData,
            points: updatedPoints
        });
    };
    const resetForm = () => {
        setFormData({
            heading: '',
            description: '',
            points: [{ text: '', icon: 'fas fa-check' }],
            button: { text: 'Get Started', link: '#' },
            image: null
        });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
        setMessage('');
    };
    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                        <div className="dashboard-card-header px-4 py-3 d-flex justify-content-between align-items-center" style={{ background: '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                            <h4 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
                                <i className="fas fa-star me-2"></i>
                                Why Choose Us Management
                            </h4>
                            <button
                                className="btn btn-light btn-sm"
                                onClick={() => setShowForm(!showForm)}
                            >
                                <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'} me-1`}></i>
                                {showForm ? 'Cancel' : 'Add New'}
                            </button>
                        </div>

                        <div className="dashboard-card-body px-4 py-4">
                            {/* Alert Messages */}
                            {message && (
                                <Alert
                                    type={message.includes('✅') ? 'success' : 'danger'}
                                    message={message}
                                    onClose={() => setMessage('')}
                                />
                            )}
                            {/* Add/Edit Form */}
                            {showForm && (
                                <div className="card border-primary mb-4">
                                    <div className="card-header bg-light">
                                        <h5 className="mb-0">
                                            {isEditing ? 'Edit Why Choose Us Entry' : 'Add New Why Choose Us Entry'}
                                        </h5>
                                    </div>
                                    <div className="card-body">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Heading *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.heading}
                                                            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Image</label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            accept="image/*"
                                                            onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Description *</label>
                                                <ReactQuill
                                                    value={formData.description}
                                                    onChange={(value) => setFormData({ ...formData, description: value })}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': [1, 2, 3, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['link'],
                                                            ['clean']
                                                        ],
                                                    }}
                                                />
                                            </div>

                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                    <label className="form-label mb-0">Key Points</label>
                                                    <button type="button" className="btn btn-success btn-sm" onClick={addPoint}>
                                                        <i className="fas fa-plus"></i> Add Point
                                                    </button>
                                                </div>
                                                {formData.points.map((point, index) => (
                                                    <div key={index} className="row mb-2">
                                                        <div className="col-md-8">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Point text"
                                                                value={point.text}
                                                                onChange={(e) => updatePoint(index, 'text', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-3">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="Icon class"
                                                                value={point.icon}
                                                                onChange={(e) => updatePoint(index, 'icon', e.target.value)}
                                                            />
                                                        </div>
                                                        <div className="col-md-1">
                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => removePoint(index)}
                                                                disabled={formData.points.length === 1}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Button Text</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.button.text}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                button: { ...formData.button, text: e.target.value }
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Button Link</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.button.link}
                                                            onChange={(e) => setFormData({
                                                                ...formData,
                                                                button: { ...formData.button, link: e.target.value }
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="d-flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-save me-1"></i>
                                                            {isEditing ? 'Update' : 'Create'}
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={resetForm}
                                                >
                                                    <i className="fas fa-times me-1"></i>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                            {/* Data Display */}
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-info" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : whyChooseUs.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No why choose us entries found. Click "Add New" to create one.</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {whyChooseUs.map((item) => (
                                        <div key={item._id} className="col-12 mb-4">
                                            <div className="card border-primary">
                                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                                    <h5 className="mb-0">{item.heading}</h5>
                                                    <div>
                                                        <button
                                                            className="btn btn-outline-primary btn-sm me-2"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <i className="fas fa-edit"></i> Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDelete(item._id)}
                                                        >
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <div className="row">
                                                        {/* Left side - Image and Description */}
                                                        <div className="col-md-6">
                                                            {item.image && item.image.url && (
                                                                <div className="mb-3">
                                                                    <img
                                                                        src={getImageUrl(item.image.url)}
                                                                        alt={item.heading}
                                                                        className="img-fluid rounded"
                                                                        style={{ maxHeight: '200px', width: '100%', objectFit: 'cover' }}
                                                                    />
                                                                </div>
                                                            )}
                                                            <div className="mb-3">
                                                                <h6 className="text-muted">Description:</h6>
                                                                <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                                            </div>
                                                        </div>

                                                        {/* Right side - Points and Button */}
                                                        <div className="col-md-6">
                                                            <h6 className="text-muted mb-3">Key Points:</h6>
                                                            <div className="mb-3">
                                                                {item.points.map((point, index) => (
                                                                    <div key={index} className="d-flex align-items-center mb-2">
                                                                        <i className={`${point.icon} text-success me-2`}></i>
                                                                        <span>{point.text}</span>
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            {item.button && item.button.text && (
                                                                <div className="mt-3">
                                                                    <a
                                                                        href={item.button.link}
                                                                        className="btn btn-primary"
                                                                        target={item.button.link.startsWith('http') ? '_blank' : '_self'}
                                                                        rel={item.button.link.startsWith('http') ? 'noopener noreferrer' : ''}
                                                                    >
                                                                        {item.button.text}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OurAssociation = () => {
    const [ourAssociation, setOurAssociation] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        button: { text: 'Learn More', link: '#' },
        rowOne: [{ url: '', alt: '', originalName: '', filename: '' }],
        rowTwo: [{ url: '', alt: '', originalName: '', filename: '' }],
        rowThree: [{ url: '', alt: '', originalName: '', filename: '' }],
        rowOneFiles: [],
        rowTwoFiles: [],
        rowThreeFiles: []
    });
    useEffect(() => {
        fetchOurAssociation();
    }, []);
    const fetchOurAssociation = async () => {
        try {
            setLoading(true);
            const response = await ourAssociationAPI.getAll();
            setOurAssociation(response.data.data || []);
        } catch (error) {
            console.error('Error fetching our association:', error);
            setMessage(`Failed to fetch our association entries. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.heading.trim() || !formData.description.trim()) {
            setMessage('Please fill in all required fields');
            return;
        }
        try {
            setLoading(true);
            const submitFormData = new FormData();
            submitFormData.append('heading', formData.heading);
            submitFormData.append('description', formData.description);
            submitFormData.append('button', JSON.stringify(formData.button));
            // Add row data
            submitFormData.append('rowOneData', JSON.stringify(formData.rowOne));
            submitFormData.append('rowTwoData', JSON.stringify(formData.rowTwo));
            submitFormData.append('rowThreeData', JSON.stringify(formData.rowThree));
            // Add files for each row
            formData.rowOneFiles.forEach((file, index) => {
                if (file) submitFormData.append(`rowOne_${index}`, file);
            });
            formData.rowTwoFiles.forEach((file, index) => {
                if (file) submitFormData.append(`rowTwo_${index}`, file);
            });
            formData.rowThreeFiles.forEach((file, index) => {
                if (file) submitFormData.append(`rowThree_${index}`, file);
            });
            if (isEditing) {
                await ourAssociationAPI.update(editingId, submitFormData);
                setMessage('Our association entry updated successfully!');
            } else {
                await ourAssociationAPI.create(submitFormData);
                setMessage('Our association entry created successfully!');
            }
            resetForm();
            await fetchOurAssociation();
        } catch (error) {
            console.error('Error saving our association entry:', error);
            setMessage(`Failed to save our association entry. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleEdit = (item) => {
        setFormData({
            heading: item.heading,
            description: item.description,
            button: item.button,
            rowOne: item.rowOne || [],
            rowTwo: item.rowTwo || [],
            rowThree: item.rowThree || [],
            rowOneFiles: [],
            rowTwoFiles: [],
            rowThreeFiles: []
        });
        setIsEditing(true);
        setEditingId(item._id);
        setShowForm(true);
        setMessage('');
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this our association entry?')) {
            return;
        }
        try {
            setLoading(true);
            await ourAssociationAPI.delete(id);
            setMessage('Our association entry deleted successfully!');
            await fetchOurAssociation();
        } catch (error) {
            console.error('Error deleting our association entry:', error);
            setMessage(`Failed to delete our association entry. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const addImageToRow = (rowName) => {
        setFormData({
            ...formData,
            [rowName]: [...formData[rowName], { url: '', alt: '', originalName: '', filename: '' }]
        });
    };
    const removeImageFromRow = (rowName, index) => {
        const updatedRow = formData[rowName].filter((_, i) => i !== index);
        const updatedFiles = formData[`${rowName}Files`].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [rowName]: updatedRow,
            [`${rowName}Files`]: updatedFiles
        });
    };
    const updateImageInRow = (rowName, index, field, value) => {
        const updatedRow = [...formData[rowName]];
        updatedRow[index][field] = value;
        setFormData({
            ...formData,
            [rowName]: updatedRow
        });
    };
    const handleFileChange = (rowName, index, file) => {
        const updatedFiles = [...formData[`${rowName}Files`]];
        updatedFiles[index] = file;
        setFormData({
            ...formData,
            [`${rowName}Files`]: updatedFiles
        });
    };
    const resetForm = () => {
        setFormData({
            heading: '',
            description: '',
            button: { text: 'Learn More', link: '#' },
            rowOne: [{ url: '', alt: '', originalName: '', filename: '' }],
            rowTwo: [{ url: '', alt: '', originalName: '', filename: '' }],
            rowThree: [{ url: '', alt: '', originalName: '', filename: '' }],
            rowOneFiles: [],
            rowTwoFiles: [],
            rowThreeFiles: []
        });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
        setMessage('');
    };
    const renderRowSection = (rowName, rowTitle, rowData, rowFiles) => (
        <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label mb-0">{rowTitle}</label>
                <button
                    type="button"
                    className="btn btn-success btn-sm"
                    onClick={() => addImageToRow(rowName)}
                    disabled={rowData.length >= 5}
                >
                    <i className="fas fa-plus"></i> Add Image
                </button>
            </div>
            {rowData.map((image, index) => (
                <div key={index} className="row mb-2 align-items-center">
                    <div className="col-md-4">
                        <input
                            type="file"
                            className="form-control form-control-sm"
                            accept="image/*"
                            onChange={(e) => handleFileChange(rowName, index, e.target.files[0])}
                        />
                    </div>
                    <div className="col-md-4">
                        <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Alt text"
                            value={image.alt}
                            onChange={(e) => updateImageInRow(rowName, index, 'alt', e.target.value)}
                        />
                    </div>
                    <div className="col-md-3">
                        {image.url && (
                            <img
                                src={getImageUrl(image.url)}
                                alt={image.alt}
                                className="img-thumbnail"
                                style={{ height: '40px', width: '40px', objectFit: 'cover' }}
                            />
                        )}
                    </div>
                    <div className="col-md-1">
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeImageFromRow(rowName, index)}
                            disabled={rowData.length === 1}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                        <div className="dashboard-card-header px-4 py-3" style={{ background: '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                            <h4 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
                                <i className="fas fa-handshake me-2"></i>
                                Our Association
                            </h4>
                        </div>

                        <div className="dashboard-card-body px-4 py-4">
                            {message && (
                                <Alert
                                    type={message.includes('✅') ? 'success' : 'danger'}
                                    message={message}
                                    onClose={() => setMessage('')}
                                />
                            )}
                            {showForm && (
                                <div className="dashboard-card border-primary mb-4" style={{ borderRadius: 14, background: '#e3fcec' }}>
                                    <div className="dashboard-card-header px-3 py-2" style={{ background: '#22c55e', color: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                                        <h5 className="mb-0">
                                            {isEditing ? 'Edit Our Association Entry' : 'Add New Our Association Entry'}
                                        </h5>
                                    </div>
                                    <div className="dashboard-card-body px-3 py-3">
                                        <form onSubmit={handleSubmit}>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="mb-3">
                                                        <label className="form-label">Heading *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={formData.heading}
                                                            onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">Button Text</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.button.text}
                                                                    onChange={(e) => setFormData({
                                                                        ...formData,
                                                                        button: { ...formData.button, text: e.target.value }
                                                                    })}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="mb-3">
                                                                <label className="form-label">Button Link</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    value={formData.button.link}
                                                                    onChange={(e) => setFormData({
                                                                        ...formData,
                                                                        button: { ...formData.button, link: e.target.value }
                                                                    })}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">Description *</label>
                                                <ReactQuill
                                                    value={formData.description}
                                                    onChange={(value) => setFormData({ ...formData, description: value })}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': [1, 2, 3, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['link'],
                                                            ['clean']
                                                        ],
                                                    }}
                                                />
                                            </div>

                                            {renderRowSection('rowOne', 'Row 1 Images (4-5 images)', formData.rowOne, formData.rowOneFiles)}
                                            {renderRowSection('rowTwo', 'Row 2 Images (4-5 images)', formData.rowTwo, formData.rowTwoFiles)}
                                            {renderRowSection('rowThree', 'Row 3 Images (4-5 images)', formData.rowThree, formData.rowThreeFiles)}

                                            <div className="d-flex gap-2">
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <i className="fas fa-save me-1"></i>
                                                            {isEditing ? 'Update' : 'Create'}
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={resetForm}
                                                >
                                                    <i className="fas fa-times me-1"></i>
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : ourAssociation.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No our association entries found. Click "Add New" to create one.</p>
                                </div>
                            ) : (
                                <div className="row g-4">
                                    {ourAssociation.map((item) => (
                                        <div key={item._id} className="col-12 mb-2">
                                            <div className="dashboard-card border-primary" style={{ borderRadius: 14, background: '#e0f2fe', border: 'none', boxShadow: '0 2px 12px #bae6fd' }}>
                                                <div className="dashboard-card-header px-3 py-2 d-flex justify-content-between align-items-center" style={{ background: '#0ea5e9', color: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                                                    <h5 className="mb-0">{item.heading}</h5>
                                                    <div>
                                                        <button
                                                            className="btn btn-outline-primary btn-sm me-2"
                                                            onClick={() => handleEdit(item)}
                                                        >
                                                            <i className="fas fa-edit"></i> Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() => handleDelete(item._id)}
                                                        >
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="dashboard-card-body px-3 py-3">
                                                    <div className="row">
                                                        <div className="col-md-4">
                                                            <div className="mb-3">
                                                                <h6 className="text-muted">Description:</h6>
                                                                <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                                            </div>

                                                            {item.button && item.button.text && (
                                                                <div className="mt-3">
                                                                    <a
                                                                        href={item.button.link}
                                                                        className="btn btn-primary"
                                                                        target={item.button.link.startsWith('http') ? '_blank' : '_self'}
                                                                        rel={item.button.link.startsWith('http') ? 'noopener noreferrer' : ''}
                                                                    >
                                                                        {item.button.text}
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="col-md-8">
                                                            <h6 className="text-muted mb-3">Association Images:</h6>

                                                            {item.rowOne && item.rowOne.length > 0 && (
                                                                <div className="mb-3">
                                                                    <small className="text-muted">Images :</small>
                                                                    <div className="d-flex flex-wrap gap-3 mt-1">
                                                                        {item.rowOne.map((image, index) => (
                                                                            <div key={index} className="dashboard-card p-2 d-flex align-items-center justify-content-center" style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #bae6fd', width: 90, height: 90 }}>
                                                                                <img
                                                                                    src={getImageUrl(image.url)}
                                                                                    alt={image.alt || `Association ${index + 1}`}
                                                                                    style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: 8 }}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Row 2 */}
                                                            {item.rowTwo && item.rowTwo.length > 0 && (
                                                                <div className="mb-3">
                                                                    <small className="text-muted">Images :</small>
                                                                    <div className="d-flex flex-wrap gap-3 mt-1">
                                                                        {item.rowTwo.map((image, index) => (
                                                                            <div key={index} className="dashboard-card p-2 d-flex align-items-center justify-content-center" style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #bae6fd', width: 90, height: 90 }}>
                                                                                <img
                                                                                    src={getImageUrl(image.url)}
                                                                                    alt={image.alt || `Association ${index + 1}`}
                                                                                    style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: 8 }}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Row 3 */}
                                                            {item.rowThree && item.rowThree.length > 0 && (
                                                                <div className="mb-3">
                                                                    <small className="text-muted">Images :</small>
                                                                    <div className="d-flex flex-wrap gap-3 mt-1">
                                                                        {item.rowThree.map((image, index) => (
                                                                            <div key={index} className="dashboard-card p-2 d-flex align-items-center justify-content-center" style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #bae6fd', width: 90, height: 90 }}>
                                                                                <img
                                                                                    src={getImageUrl(image.url)}
                                                                                    alt={image.alt || `Association ${index + 1}`}
                                                                                    style={{ height: '60px', width: '60px', objectFit: 'cover', borderRadius: 8 }}
                                                                                />
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Home FAQs Component
const HomeFAQs = () => {
    const [faqSections, setFaqSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [formData, setFormData] = useState({
        heading: '',
        description: '',
        faqs: [{ question: '', answer: '' }]
    });
    useEffect(() => {
        fetchFAQs();
    }, []);
    const fetchFAQs = async () => {
        try {
            setLoading(true);
            const response = await homeFAQsAPI.getAll();
            setFaqSections(response.data.data || []);
        } catch (error) {
            console.error('Error fetching FAQ sections:', error);
            setMessage(`Failed to fetch FAQ sections. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.heading.trim() || !formData.description.trim()) {
            setMessage('Please fill in heading and description');
            return;
        }
        const validFAQs = formData.faqs.filter(faq => faq.question.trim() && faq.answer.trim());
        if (validFAQs.length === 0) {
            setMessage('Please add at least one question and answer');
            return;
        }
        try {
            setLoading(true);
            const submitData = {
                heading: formData.heading,
                description: formData.description,
                faqs: validFAQs
            };

            if (isEditing) {
                await homeFAQsAPI.update(editingId, submitData);
                setMessage('FAQ section updated successfully!');
            } else {
                await homeFAQsAPI.create(submitData);
                setMessage('FAQ section created successfully!');
            }
            resetForm();
            await fetchFAQs();
        } catch (error) {
            console.error('Error saving FAQ section:', error);
            setMessage(`Failed to save FAQ section. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const handleEdit = (faqSection) => {
        setFormData({
            heading: faqSection.heading,
            description: faqSection.description,
            faqs: faqSection.faqs || [{ question: '', answer: '' }]
        });
        setIsEditing(true);
        setEditingId(faqSection._id);
        setShowForm(true);
        setMessage('');
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this FAQ section?')) {
            return;
        }
        try {
            setLoading(true);
            await homeFAQsAPI.delete(id);
            setMessage('FAQ section deleted successfully!');
            await fetchFAQs();
        } catch (error) {
            console.error('Error deleting FAQ section:', error);
            setMessage(`Failed to delete FAQ section. ${error.response?.data?.message || error.message}`);
        } finally {
            setLoading(false);
        }
    };
    const resetForm = () => {
        setFormData({
            heading: '',
            description: '',
            faqs: [{ question: '', answer: '' }]
        });
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
        setMessage('');
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleFAQChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            faqs: prev.faqs.map((faq, i) =>
                i === index ? { ...faq, [field]: value } : faq
            )
        }));
    };
    const addFAQ = () => {
        setFormData(prev => ({
            ...prev,
            faqs: [...prev.faqs, { question: '', answer: '' }]
        }));
    };
    const removeFAQ = (index) => {
        if (formData.faqs.length > 1) {
            setFormData(prev => ({
                ...prev,
                faqs: prev.faqs.filter((_, i) => i !== index)
            }));
        }
    };
    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                        <div className="dashboard-card-header px-4 py-3" style={{ background: '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                            <h4 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
                                <i className="fas fa-question-circle me-2"></i>
                                Home FAQs
                            </h4>
                        </div>
                        <div className="dashboard-card-body px-4 py-4">
                            {message && (
                                <Alert
                                    message={message}
                                    type={message.startsWith('✅') ? 'success' : 'danger'}
                                    onClose={() => setMessage('')}
                                />
                            )}
                            {showForm && (
                                <div className="mb-4">
                                    <div className="card border-primary">
                                        <div className="card-header bg-light">
                                            <h5 className="mb-0">
                                                {isEditing ? '✏️ Edit FAQ Section' : '➕ Add New FAQ Section'}
                                            </h5>
                                        </div>
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit}>
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="heading" className="form-label">Section Heading *</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="heading"
                                                            name="heading"
                                                            value={formData.heading}
                                                            onChange={handleInputChange}
                                                            required
                                                            placeholder="Enter FAQ section heading"
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label htmlFor="description" className="form-label">Section Description *</label>
                                                        <ReactQuill
                                                            value={formData.description}
                                                            onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                                                            placeholder="Enter FAQ section description"
                                                            modules={{
                                                                toolbar: [
                                                                    [{ 'header': [1, 2, 3, false] }],
                                                                    ['bold', 'italic', 'underline', 'strike'],
                                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                    ['link'],
                                                                    ['clean']
                                                                ],
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <label className="form-label mb-0">Questions and Answers *</label>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={addFAQ}
                                                        >
                                                            <i className="fas fa-plus me-1"></i>
                                                            Add FAQ
                                                        </button>
                                                    </div>
                                                    {formData.faqs.map((faq, index) => (
                                                        <div key={index} className="border rounded p-3 mb-3">
                                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                                <h6 className="mb-0">FAQ {index + 1}</h6>
                                                                {formData.faqs.length > 1 && (
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => removeFAQ(index)}
                                                                    >
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="mb-2">
                                                                <label className="form-label">Question *</label>
                                                                <textarea
                                                                    className="form-control"
                                                                    rows="2"
                                                                    value={faq.question}
                                                                    onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                                                                    required
                                                                    placeholder="Enter the question"
                                                                    maxLength="200"
                                                                />
                                                                <small className="form-text text-muted">
                                                                    {faq.question.length}/200 characters
                                                                </small>
                                                            </div>
                                                            <div>
                                                                <label className="form-label">Answer *</label>
                                                                <ReactQuill
                                                                    value={faq.answer}
                                                                    onChange={(value) => handleFAQChange(index, 'answer', value)}
                                                                    placeholder="Enter the answer"
                                                                    modules={{
                                                                        toolbar: [
                                                                            [{ 'header': [1, 2, 3, false] }],
                                                                            ['bold', 'italic', 'underline', 'strike'],
                                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                            ['link'],
                                                                            ['clean']
                                                                        ],
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        type="submit"
                                                        className="btn btn-primary"
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <i className="fas fa-save me-2"></i>
                                                                {isEditing ? 'Update' : 'Create'}
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary"
                                                        onClick={resetForm}
                                                        disabled={loading}
                                                    >
                                                        <i className="fas fa-times me-2"></i>
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add New Button */}
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => setShowForm(!showForm)}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-plus me-2"></i>
                                        Add New FAQ Section
                                    </button>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary"
                                        onClick={fetchFAQs}
                                        disabled={loading}
                                    >
                                        <i className="fas fa-refresh me-2"></i>
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {/* FAQ Sections List */}
                            {loading ? (
                                <div className="text-center py-5">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <p className="mt-2 text-muted">Loading FAQ sections...</p>
                                </div>
                            ) : faqSections.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-question-circle fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No FAQ sections found. Click "Add New FAQ Section" to create one.</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {faqSections.map((section) => (
                                        <div key={section._id} className="col-12 mb-4">
                                            <div className="card border-primary">
                                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                                    <h5 className="mb-0">{section.heading}</h5>
                                                    <div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                            onClick={() => handleEdit(section)}
                                                            title="Edit FAQ Section"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDelete(section._id)}
                                                            title="Delete FAQ Section"
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="card-body">
                                                    <p className="text-muted mb-4">{section.description}</p>
                                                    <div className="row">
                                                        {section.faqs && section.faqs.map((faq, index) => (
                                                            <div key={index} className="col-12 mb-3">
                                                                <div className="border-start border-primary border-3 ps-3">
                                                                    <h6 className="fw-bold text-primary mb-2">
                                                                        <i className="fas fa-question me-2"></i>
                                                                        {faq.question}
                                                                    </h6>
                                                                    <p className="mb-0">{faq.answer}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
