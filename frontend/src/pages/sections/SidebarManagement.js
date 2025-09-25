import React, { useState, useEffect, useCallback } from 'react';
import { sidebarAPI } from '../../services/api';

const SidebarManagement = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [sidebarItems, setSidebarItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'single',
        route: '',
        dropdownItems: [],
        order: 0,
        isActive: true
    });
    const [newDropdownItem, setNewDropdownItem] = useState({ name: '', route: '' });

    // Dark mode detection
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.body.classList.contains('dark-mode'));
        };
        checkDarkMode();
        const observer = new MutationObserver(() => checkDarkMode());
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        setTimeout(() => setAlert({ show: false, type: '', message: '' }), 5000);
    };

    const fetchSidebarItems = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);
            const response = await sidebarAPI.getAll();

            // The API returns { success: true, data: [...] }
            // Axios wraps response in .data, so response.data = { success: true, data: [...] }
            // We need response.data.data to get the actual array
            const items = response.data.data || [];

            setSidebarItems(Array.isArray(items) ? items : []);
        } catch (error) {
            console.error('Error fetching sidebar items:', error);
            let errorMessage = 'Failed to fetch sidebar items';

            if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
                errorMessage = 'Cannot connect to server. Please make sure the backend is running on http://localhost:8000';
            } else if (error.response?.status === 404) {
                errorMessage = 'Sidebar API endpoint not found. Please check if backend routes are properly configured.';
            } else if (error.response?.status === 401) {
                errorMessage = 'Unauthorized access. Please check your authentication.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSidebarItems();
    }, [fetchSidebarItems]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);

            const submitData = {
                ...formData,
                order: parseInt(formData.order) || 0
            };

            if (showEditModal && selectedItem) {
                await sidebarAPI.update(selectedItem._id, submitData);
                showAlert('success', 'Sidebar item updated successfully');
            } else {
                await sidebarAPI.create(submitData);
                showAlert('success', 'Sidebar item created successfully');
            }

            resetForm();
            setShowAddModal(false);
            setShowEditModal(false);
            fetchSidebarItems();
        } catch (error) {
            showAlert('danger', `Failed to ${showEditModal ? 'update' : 'create'} sidebar item`);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setFormData({
            name: item.name,
            type: item.type,
            route: item.route || '',
            dropdownItems: item.dropdownItems || [],
            order: item.order,
            isActive: item.isActive
        });
        setShowEditModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sidebar item?')) {
            try {
                setDeleting(id);
                await sidebarAPI.delete(id);
                showAlert('success', 'Sidebar item deleted successfully');
                fetchSidebarItems();
            } catch (error) {
                showAlert('danger', 'Failed to delete sidebar item');
            } finally {
                setDeleting(null);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'single',
            route: '',
            dropdownItems: [],
            order: 0,
            isActive: true
        });
        setNewDropdownItem({ name: '', route: '' });
        setSelectedItem(null);
    };

    const handleAddDropdownItem = () => {
        if (newDropdownItem.name && newDropdownItem.route) {
            setFormData(prev => ({
                ...prev,
                dropdownItems: [...prev.dropdownItems, { ...newDropdownItem }]
            }));
            setNewDropdownItem({ name: '', route: '' });
        }
    };

    const handleRemoveDropdownItem = (index) => {
        setFormData(prev => ({
            ...prev,
            dropdownItems: prev.dropdownItems.filter((_, i) => i !== index)
        }));
    };

    const handleReorder = async (newOrder) => {
        try {
            await sidebarAPI.reorder(newOrder);
            showAlert('success', 'Sidebar items reordered successfully');
            fetchSidebarItems();
        } catch (error) {
            showAlert('danger', 'Failed to reorder sidebar items');
        }
    };

    if (error) {
        return (
            <div className="container-fluid py-4">
                <div className="alert alert-danger" role="alert">
                    <h4 className="alert-heading">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Error Loading Sidebar Management
                    </h4>
                    <p>{error}</p>
                    <button
                        className="btn btn-outline-danger"
                        onClick={() => {
                            setError(null);
                            fetchSidebarItems();
                        }}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading sidebar management...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            {/* Alert */}
            {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setAlert({ show: false, type: '', message: '' })}
                    ></button>
                </div>
            )}

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className={isDarkMode ? 'text-light' : 'text-dark'}>
                    <i className="bi bi-list-ul me-2"></i>
                    Sidebar Management
                </h2>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowAddModal(true)}
                >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Sidebar Item
                </button>
            </div>

            {/* Sidebar Items Table */}
            <div className={`card ${isDarkMode ? 'bg-dark text-light' : ''}`}>
                <div className="card-body">
                    {(!Array.isArray(sidebarItems) || sidebarItems.length === 0) ? (
                        <div className="text-center py-5">
                            <i className="bi bi-inbox display-1 text-muted"></i>
                            <h4 className="mt-3 text-muted">No sidebar items found</h4>
                            <p className="text-muted">Create your first sidebar item to get started.</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowAddModal(true)}
                            >
                                <i className="bi bi-plus-circle me-2"></i>
                                Add First Item
                            </button>
                        </div>
                    ) : (
                        <div className="row">
                            {(Array.isArray(sidebarItems) ? sidebarItems : [])
                                .sort((a, b) => a.order - b.order)
                                .map((item) => (
                                    <div key={item._id} className="col-lg-6 col-xl-4 mb-4">
                                        <div
                                            className={`card h-100 ${isDarkMode ? 'bg-dark text-light border-secondary' : 'bg-white border-light'}`}
                                            style={{
                                                transition: 'all 0.3s ease',
                                                borderRadius: '16px',
                                                border: isDarkMode ? '1px solid #404040' : '1px solid #e9ecef',
                                                boxShadow: isDarkMode
                                                    ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
                                                    : '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)',
                                                cursor: 'default'
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.transform = 'translateY(-8px)';
                                                e.currentTarget.style.boxShadow = isDarkMode
                                                    ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 8px rgba(0, 0, 0, 0.3)'
                                                    : '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = isDarkMode
                                                    ? '0 4px 20px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2)'
                                                    : '0 4px 20px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04)';
                                            }}
                                        >
                                            <div
                                                className="card-header d-flex justify-content-between align-items-center"
                                                style={{
                                                    background: isDarkMode
                                                        ? 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)'
                                                        : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                                    border: 'none',
                                                    borderRadius: '16px 16px 0 0',
                                                    padding: '1rem 1.25rem'
                                                }}
                                            >
                                                <div className="d-flex align-items-center">
                                                    <span
                                                        className="badge me-2"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                                                            color: 'white',
                                                            padding: '0.5rem 0.75rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        #{item.order}
                                                    </span>
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                                                            color: 'white',
                                                            padding: '0.5rem 0.75rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        <i className={`bi ${item.type === 'single' ? 'bi-file-text' : 'bi-list'} me-1`}></i>
                                                        {item.type}
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center gap-2">
                                                    <span
                                                        className="badge"
                                                        style={{
                                                            background: item.isActive
                                                                ? 'linear-gradient(135deg, #198754 0%, #146c43 100%)'
                                                                : 'linear-gradient(135deg, #ffc107 0%, #ffb302 100%)',
                                                            color: item.isActive ? 'white' : '#000',
                                                            padding: '0.5rem 0.75rem',
                                                            borderRadius: '8px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        <i className={`bi ${item.isActive ? 'bi-check-circle' : 'bi-pause-circle'} me-1`}></i>
                                                        {item.isActive ? 'Active' : 'Inactive'}
                                                    </span>

                                                    {/* Action Buttons */}
                                                    <div className="d-flex gap-1">
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => handleEdit(item)}
                                                            title="Edit"
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                padding: '0',
                                                                borderRadius: '8px',
                                                                background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                                                                border: 'none',
                                                                color: 'white',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'all 0.3s ease'
                                                            }}
                                                            onMouseEnter={e => {
                                                                e.target.style.transform = 'scale(1.1)';
                                                                e.target.style.background = 'linear-gradient(135deg, #0b5ed7 0%, #084298 100%)';
                                                            }}
                                                            onMouseLeave={e => {
                                                                e.target.style.transform = 'scale(1)';
                                                                e.target.style.background = 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)';
                                                            }}
                                                        >
                                                            <i className="bi bi-pencil" style={{ fontSize: '0.875rem' }}></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => handleDelete(item._id)}
                                                            disabled={deleting === item._id}
                                                            title="Delete"
                                                            style={{
                                                                width: '32px',
                                                                height: '32px',
                                                                padding: '0',
                                                                borderRadius: '8px',
                                                                background: deleting === item._id
                                                                    ? 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
                                                                    : 'linear-gradient(135deg, #dc3545 0%, #b02a37 100%)',
                                                                border: 'none',
                                                                color: 'white',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                transition: 'all 0.3s ease',
                                                                cursor: deleting === item._id ? 'not-allowed' : 'pointer'
                                                            }}
                                                            onMouseEnter={e => {
                                                                if (deleting !== item._id) {
                                                                    e.target.style.transform = 'scale(1.1)';
                                                                    e.target.style.background = 'linear-gradient(135deg, #b02a37 0%, #842029 100%)';
                                                                }
                                                            }}
                                                            onMouseLeave={e => {
                                                                if (deleting !== item._id) {
                                                                    e.target.style.transform = 'scale(1)';
                                                                    e.target.style.background = 'linear-gradient(135deg, #dc3545 0%, #b02a37 100%)';
                                                                }
                                                            }}
                                                        >
                                                            {deleting === item._id ? (
                                                                <div
                                                                    className="spinner-border"
                                                                    role="status"
                                                                    style={{
                                                                        width: '12px',
                                                                        height: '12px',
                                                                        borderWidth: '2px'
                                                                    }}
                                                                ></div>
                                                            ) : (
                                                                <i className="bi bi-trash" style={{ fontSize: '0.875rem' }}></i>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                className="card-body"
                                                style={{
                                                    padding: '1.5rem 1.25rem',
                                                    background: isDarkMode
                                                        ? 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)'
                                                        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
                                                }}
                                            >
                                                <div className="d-flex align-items-center mb-3">
                                                    <div
                                                        style={{
                                                            display: 'inline-flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            width: '48px',
                                                            height: '48px',
                                                            borderRadius: '12px',
                                                            background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                                                            marginRight: '12px',
                                                            boxShadow: '0 4px 12px rgba(13, 110, 253, 0.25)'
                                                        }}
                                                    >
                                                        <i className={`bi ${item.type === 'single' ? 'bi-file-text' : 'bi-list-ul'} text-white`}></i>
                                                    </div>
                                                    <h5
                                                        className="card-title mb-0"
                                                        style={{
                                                            fontSize: '1.25rem',
                                                            fontWeight: '600',
                                                            color: isDarkMode ? '#ffffff' : '#212529'
                                                        }}
                                                    >
                                                        {item.name}
                                                    </h5>
                                                </div>

                                                {/* Route for single items */}
                                                {item.route && (
                                                    <div
                                                        className="mb-3"
                                                        style={{
                                                            padding: '1rem',
                                                            borderRadius: '10px',
                                                            background: isDarkMode
                                                                ? 'rgba(255, 255, 255, 0.05)'
                                                                : 'rgba(0, 0, 0, 0.03)',
                                                            border: isDarkMode
                                                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                                                : '1px solid rgba(0, 0, 0, 0.05)'
                                                        }}
                                                    >
                                                        <small
                                                            className="d-block mb-2"
                                                            style={{
                                                                color: isDarkMode ? '#9ca3af' : '#6c757d',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '600',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}
                                                        >
                                                            <i className="bi bi-link-45deg me-1"></i>
                                                            Route
                                                        </small>
                                                        <code
                                                            style={{
                                                                background: isDarkMode
                                                                    ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
                                                                    : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                                                                color: isDarkMode ? '#0ea5e9' : '#0369a1',
                                                                padding: '0.5rem 0.75rem',
                                                                borderRadius: '6px',
                                                                fontSize: '0.875rem',
                                                                fontWeight: '500',
                                                                border: isDarkMode
                                                                    ? '1px solid rgba(14, 165, 233, 0.2)'
                                                                    : '1px solid rgba(3, 105, 161, 0.1)',
                                                                display: 'inline-block',
                                                                fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
                                                            }}
                                                        >
                                                            {item.route}
                                                        </code>
                                                    </div>
                                                )}

                                                {/* Dropdown items */}
                                                {item.type === 'dropdown' && item.dropdownItems?.length > 0 && (
                                                    <div
                                                        className="mb-3"
                                                        style={{
                                                            padding: '1rem',
                                                            borderRadius: '10px',
                                                            background: isDarkMode
                                                                ? 'rgba(255, 255, 255, 0.05)'
                                                                : 'rgba(0, 0, 0, 0.03)',
                                                            border: isDarkMode
                                                                ? '1px solid rgba(255, 255, 255, 0.1)'
                                                                : '1px solid rgba(0, 0, 0, 0.05)'
                                                        }}
                                                    >
                                                        <small
                                                            className="d-block mb-3"
                                                            style={{
                                                                color: isDarkMode ? '#9ca3af' : '#6c757d',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '600',
                                                                textTransform: 'uppercase',
                                                                letterSpacing: '0.5px'
                                                            }}
                                                        >
                                                            <i className="bi bi-list-ul me-1"></i>
                                                            Dropdown Items ({item.dropdownItems.length})
                                                        </small>
                                                        <div className="d-flex flex-column gap-2">
                                                            {item.dropdownItems.slice(0, 3).map((dropdownItem, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="d-flex align-items-center"
                                                                    style={{
                                                                        padding: '0.75rem',
                                                                        borderRadius: '8px',
                                                                        background: isDarkMode
                                                                            ? 'rgba(255, 255, 255, 0.03)'
                                                                            : 'rgba(0, 0, 0, 0.02)',
                                                                        border: isDarkMode
                                                                            ? '1px solid rgba(255, 255, 255, 0.05)'
                                                                            : '1px solid rgba(0, 0, 0, 0.03)',
                                                                        transition: 'all 0.3s ease'
                                                                    }}
                                                                >
                                                                    <div
                                                                        style={{
                                                                            width: '24px',
                                                                            height: '24px',
                                                                            borderRadius: '6px',
                                                                            background: 'linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            marginRight: '12px'
                                                                        }}
                                                                    >
                                                                        <i
                                                                            className="bi bi-arrow-return-right"
                                                                            style={{
                                                                                fontSize: '0.75rem',
                                                                                color: 'white'
                                                                            }}
                                                                        ></i>
                                                                    </div>
                                                                    <div className="flex-grow-1">
                                                                        <div
                                                                            style={{
                                                                                fontSize: '0.875rem',
                                                                                fontWeight: '500',
                                                                                color: isDarkMode ? '#e5e7eb' : '#374151',
                                                                                marginBottom: '2px'
                                                                            }}
                                                                        >
                                                                            {dropdownItem.name}
                                                                        </div>
                                                                        <code
                                                                            style={{
                                                                                fontSize: '0.75rem',
                                                                                color: isDarkMode ? '#9ca3af' : '#6c757d',
                                                                                background: 'transparent',
                                                                                padding: '0'
                                                                            }}
                                                                        >
                                                                            {dropdownItem.route}
                                                                        </code>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            {item.dropdownItems.length > 3 && (
                                                                <div
                                                                    style={{
                                                                        padding: '0.5rem 0.75rem',
                                                                        textAlign: 'center',
                                                                        color: isDarkMode ? '#9ca3af' : '#6c757d',
                                                                        fontSize: '0.75rem',
                                                                        fontStyle: 'italic'
                                                                    }}
                                                                >
                                                                    <i className="bi bi-three-dots me-1"></i>
                                                                    and {item.dropdownItems.length - 3} more items
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Empty dropdown */}
                                                {item.type === 'dropdown' && (!item.dropdownItems || item.dropdownItems.length === 0) && (
                                                    <div
                                                        className="mb-3"
                                                        style={{
                                                            padding: '1rem',
                                                            borderRadius: '10px',
                                                            background: isDarkMode
                                                                ? 'rgba(234, 179, 8, 0.1)'
                                                                : 'rgba(255, 193, 7, 0.1)',
                                                            border: isDarkMode
                                                                ? '1px solid rgba(234, 179, 8, 0.2)'
                                                                : '1px solid rgba(255, 193, 7, 0.2)'
                                                        }}
                                                    >
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                style={{
                                                                    width: '32px',
                                                                    height: '32px',
                                                                    borderRadius: '8px',
                                                                    background: isDarkMode
                                                                        ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
                                                                        : 'linear-gradient(135deg, #ffc107 0%, #ffb302 100%)',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    marginRight: '12px'
                                                                }}
                                                            >
                                                                <i
                                                                    className="bi bi-exclamation-triangle text-white"
                                                                    style={{ fontSize: '0.875rem' }}
                                                                ></i>
                                                            </div>
                                                            <small
                                                                style={{
                                                                    color: isDarkMode ? '#eab308' : '#b45309',
                                                                    fontSize: '0.875rem',
                                                                    fontWeight: '500'
                                                                }}
                                                            >
                                                                No dropdown items configured
                                                            </small>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {(showAddModal || showEditModal) && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className={`modal-content ${isDarkMode ? 'bg-dark text-light' : ''}`}>
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className={`bi ${showEditModal ? 'bi-pencil' : 'bi-plus-circle'} me-2`}></i>
                                    {showEditModal ? 'Edit Sidebar Item' : 'Add New Sidebar Item'}
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        setShowEditModal(false);
                                        resetForm();
                                    }}
                                ></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {/* Basic Fields */}
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="bi bi-tag me-1"></i>
                                                    Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                                    required
                                                    placeholder="Enter sidebar item name"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="bi bi-list me-1"></i>
                                                    Type *
                                                </label>
                                                <select
                                                    className="form-select"
                                                    value={formData.type}
                                                    onChange={(e) => {
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            type: e.target.value,
                                                            route: e.target.value === 'dropdown' ? '' : prev.route,
                                                            dropdownItems: e.target.value === 'single' ? [] : prev.dropdownItems
                                                        }));
                                                    }}
                                                >
                                                    <option value="single">Single Page</option>
                                                    <option value="dropdown">Dropdown Menu</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Route (for single type) */}
                                    {formData.type === 'single' && (
                                        <div className="mb-3">
                                            <label className="form-label">
                                                <i className="bi bi-link me-1"></i>
                                                Route *
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={formData.route}
                                                onChange={(e) => setFormData(prev => ({ ...prev, route: e.target.value }))}
                                                required
                                                placeholder="/example-page"
                                            />
                                            <div className="form-text">
                                                Enter the route path (e.g., /services, /about)
                                            </div>
                                        </div>
                                    )}

                                    {/* Dropdown Items (for dropdown type) */}
                                    {formData.type === 'dropdown' && (
                                        <div className="mb-3">
                                            <label className="form-label">
                                                <i className="bi bi-list-ul me-1"></i>
                                                Dropdown Items
                                            </label>

                                            {/* Existing dropdown items */}
                                            {formData.dropdownItems.length > 0 && (
                                                <div className="mb-3">
                                                    {formData.dropdownItems.map((item, index) => (
                                                        <div key={index} className="d-flex align-items-center mb-2 p-2 border rounded">
                                                            <div className="flex-grow-1">
                                                                <strong>{item.name}</strong>
                                                                <small className="text-muted d-block">{item.route}</small>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-danger"
                                                                onClick={() => handleRemoveDropdownItem(index)}
                                                            >
                                                                <i className="bi bi-x"></i>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Add new dropdown item */}
                                            <div className="border rounded p-3 bg-light">
                                                <h6 className="text-dark">Add Dropdown Item</h6>
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Item name"
                                                            value={newDropdownItem.name}
                                                            onChange={(e) => setNewDropdownItem(prev => ({ ...prev, name: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="input-group">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder="/route"
                                                                value={newDropdownItem.route}
                                                                onChange={(e) => setNewDropdownItem(prev => ({ ...prev, route: e.target.value }))}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-outline-primary"
                                                                onClick={handleAddDropdownItem}
                                                                disabled={!newDropdownItem.name || !newDropdownItem.route}
                                                            >
                                                                <i className="bi bi-plus"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Order and Status */}
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="bi bi-arrow-up-down me-1"></i>
                                                    Display Order
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={formData.order}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, order: e.target.value }))}
                                                    min="0"
                                                />
                                                <div className="form-text">
                                                    Lower numbers appear first
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    <i className="bi bi-toggle-on me-1"></i>
                                                    Status
                                                </label>
                                                <div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={formData.isActive}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                                    />
                                                    <label className="form-check-label">
                                                        {formData.isActive ? 'Active' : 'Inactive'}
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowAddModal(false);
                                            setShowEditModal(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                {showEditModal ? 'Updating...' : 'Creating...'}
                                            </>
                                        ) : (
                                            showEditModal ? 'Update' : 'Create'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SidebarManagement;