import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import ServiceModal from '../components/ServiceModal';
import './ServicesOverview.css';

const ServicesOverview = () => {
    const [services, setServices] = useState([
        { id: 'service-1', name: 'Service 1', icon: 'fas fa-wrench', color: 'primary', description: 'Technical maintenance and support solutions' },
        { id: 'service-2', name: 'Service 2', icon: 'fas fa-tools', color: 'success', description: 'Advanced tooling and equipment services' },
        { id: 'service-3', name: 'Service 3', icon: 'fas fa-laptop-code', color: 'info', description: 'Software development and coding solutions' },
        { id: 'service-4', name: 'Service 4', icon: 'fas fa-mobile-alt', color: 'warning', description: 'Mobile application development services' },
        { id: 'service-5', name: 'Service 5', icon: 'fas fa-database', color: 'secondary', description: 'Database management and optimization' },
        { id: 'service-6', name: 'Service 6', icon: 'fas fa-cloud', color: 'dark', description: 'Cloud infrastructure and deployment' },
        { id: 'service-7', name: 'Service 7', icon: 'fas fa-shield-alt', color: 'danger', description: 'Security and protection solutions' },
        { id: 'service-8', name: 'Service 8', icon: 'fas fa-chart-line', color: 'primary', description: 'Analytics and business intelligence' }
    ]);
    const [loading, setLoading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editingInlineId, setEditingInlineId] = useState(null);
    const [editingValues, setEditingValues] = useState({});
    const { showAlert } = useAuth();

    // Default static services for display
    const staticServices = [
        { id: 'static-1', name: 'Service 1', icon: 'fas fa-wrench', color: 'primary', description: 'Technical maintenance and support solutions' },
        { id: 'static-2', name: 'Service 2', icon: 'fas fa-tools', color: 'success', description: 'Advanced tooling and equipment services' },
        { id: 'static-3', name: 'Service 3', icon: 'fas fa-laptop-code', color: 'info', description: 'Software development and coding solutions' },
        { id: 'static-4', name: 'Service 4', icon: 'fas fa-mobile-alt', color: 'warning', description: 'Mobile application development services' },
        { id: 'static-5', name: 'Service 5', icon: 'fas fa-database', color: 'secondary', description: 'Database management and optimization' },
        { id: 'static-6', name: 'Service 6', icon: 'fas fa-cloud', color: 'dark', description: 'Cloud infrastructure and deployment' },
        { id: 'static-7', name: 'Service 7', icon: 'fas fa-shield-alt', color: 'danger', description: 'Security and protection solutions' },
        { id: 'static-8', name: 'Service 8', icon: 'fas fa-chart-line', color: 'primary', description: 'Analytics and business intelligence' }
    ];

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await servicesAPI.getAll();
            if (response.data.data && response.data.data.length > 0) {
                // Update services with data from backend if available
                const updatedServices = services.map((service, index) => {
                    const backendService = response.data.data[index];
                    return backendService ? { ...service, name: backendService.name, _id: backendService._id } : service;
                });
                setServices(updatedServices);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            // Don't show alert for initial load failure, just use default services
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = () => {
        setEditingService(null);
        setIsEdit(false);
        setShowModal(true);
    };

    const handleEditService = (service, index) => {
        setEditingInlineId(service.id || service._id);
        setEditingValues({
            name: service.name,
            description: service.description
        });
        showAlert(`Editing "${service.name || `Service ${index + 1}`}" inline`, 'info');
    };

    const handleSaveInlineEdit = async (service, index) => {
        try {
            const updatedService = {
                ...service,
                name: editingValues.name,
                description: editingValues.description
            };

            // Update the services array
            const updatedServices = [...services];
            updatedServices[index] = updatedService;
            setServices(updatedServices);

            // If it's a backend service, update via API
            if (service._id && !service._id.includes('-')) {
                try {
                    await servicesAPI.update(service._id, {
                        name: editingValues.name,
                        description: editingValues.description
                    });
                    showAlert(`Service "${editingValues.name}" updated successfully!`, 'success');
                } catch (error) {
                    console.error('API update failed:', error);
                    showAlert(`Service updated locally (API update failed)`, 'warning');
                }
            } else {
                showAlert(`Service "${editingValues.name}" updated locally!`, 'success');
            }

            setEditingInlineId(null);
            setEditingValues({});
        } catch (error) {
            console.error('Error saving service:', error);
            showAlert('Failed to save changes', 'danger');
        }
    };

    const handleCancelInlineEdit = () => {
        setEditingInlineId(null);
        setEditingValues({});
        showAlert('Editing cancelled', 'info');
    };

    const handleInputChange = (field, value) => {
        setEditingValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDeleteConfirmation = (service, index) => {
        // Create a more detailed confirmation dialog
        const serviceName = service.name || `Service ${index + 1}`;
        const confirmMessage = `Are you sure you want to delete "${serviceName}"?\n\nThis action cannot be undone.`;

        if (window.confirm(confirmMessage)) {
            handleDeleteService(service._id || service.id, index);
        }
    };

    const handleDeleteService = async (serviceId, index) => {
        try {
            setDeletingId(serviceId || `service-${index}`);

            // If service has _id, it's from backend - call API
            if (serviceId && serviceId.includes('-') === false) {
                await servicesAPI.delete(serviceId);
                setServices(services.filter(service => service._id !== serviceId));
                showAlert(`Service deleted successfully from database!`, 'success');
            } else {
                // If it's a static service, remove from local state
                const serviceName = services[index]?.name || `Service ${index + 1}`;
                setServices(services.filter((service, idx) => idx !== index));
                showAlert(`"${serviceName}" removed from display!`, 'success');
            }

        } catch (error) {
            console.error('Error deleting service:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete service. Please try again.';
            showAlert(errorMessage, 'danger');
        } finally {
            setDeletingId(null);
        }
    };

    const handleServiceAdded = (newService) => {
        if (isEdit && editingService) {
            if (editingService.index !== undefined) {
                // Editing existing service
                const updatedServices = [...services];
                updatedServices[editingService.index] = {
                    ...updatedServices[editingService.index],
                    name: newService.name,
                    _id: newService._id
                };
                setServices(updatedServices);
                showAlert(`Service "${newService.name}" updated successfully!`, 'success');
            } else {
                // Editing dynamic service
                setServices(services.map(service =>
                    service._id === newService._id ? { ...service, ...newService } : service
                ));
                showAlert(`Service "${newService.name}" updated successfully!`, 'success');
            }
        } else {
            // Adding new service
            const newServiceWithDisplay = {
                id: `service-${services.length + 1}`,
                name: newService.name,
                icon: getServiceIcon(services.length),
                color: getServiceColor(services.length),
                description: 'Custom service solution',
                _id: newService._id
            };
            setServices([...services, newServiceWithDisplay]);
            showAlert(`New service "${newService.name}" added successfully!`, 'success');
        }
    };

    const getServiceIcon = (index) => {
        const icons = [
            'fas fa-cog', 'fas fa-gear', 'fas fa-server', 'fas fa-code',
            'fas fa-paint-brush', 'fas fa-bullhorn', 'fas fa-users', 'fas fa-handshake'
        ];
        return icons[index % icons.length];
    };

    const getServiceColor = (index) => {
        const colors = ['primary', 'success', 'info', 'warning', 'secondary', 'dark', 'danger'];
        return colors[index % colors.length];
    };

    const createServiceUrl = (serviceName) => {
        // Convert service name to URL-friendly format
        return serviceName
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .trim('-'); // Remove leading/trailing hyphens
    };
    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="h2 mb-0">
                            <i className="fas fa-table me-2"></i>
                            Services Overview
                        </h1>
                        <p className="text-muted">Comprehensive table view of all our services</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-primary"
                            onClick={handleAddService}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Add New Service
                        </button>
                    </div>
                </div>
            </div>

            {/* Services Portfolio Section */}
            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading services...</p>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-hover table-striped">
                                <thead className="table-dark">
                                    <tr>
                                        <th scope="col" style={{ width: '5%' }}>#</th>
                                        <th scope="col" style={{ width: '10%' }}>Icon</th>
                                        <th scope="col" style={{ width: '25%' }}>Service Name</th>
                                        <th scope="col" style={{ width: '35%' }}>Description</th>
                                        <th scope="col" style={{ width: '15%' }}>Read More</th>
                                        <th scope="col" style={{ width: '10%' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {services.map((service, index) => {
                                        const isEditing = editingInlineId === (service.id || service._id);
                                        return (
                                            <tr key={service.id} className={isEditing ? 'table-warning' : ''}>
                                                <th scope="row">{index + 1}</th>
                                                <td className="text-center">
                                                    <div className={`text-${service.color}`}>
                                                        <i className={`${service.icon} fa-2x`}></i>
                                                    </div>
                                                </td>

                                                {/* Service Name - Editable */}
                                                <td>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            className="form-control form-control-sm"
                                                            value={editingValues.name || ''}
                                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                                            placeholder="Service Name"
                                                        />
                                                    ) : (
                                                        <strong className={`text-${service.color}`}>
                                                            {service.name}
                                                        </strong>
                                                    )}
                                                </td>

                                                {/* Description - Editable */}
                                                <td>
                                                    {isEditing ? (
                                                        <textarea
                                                            className="form-control form-control-sm"
                                                            value={editingValues.description || ''}
                                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                                            placeholder="Service Description"
                                                            rows="2"
                                                        />
                                                    ) : (
                                                        <span className="text-muted">
                                                            {service.description}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Buttons Column - Read More Link */}
                                                <td>
                                                    <a
                                                        href={`/services/${createServiceUrl(service.name)}`}
                                                        className={`btn btn-outline-${service.color} btn-sm`}
                                                        title={`Read more about ${service.name}`}
                                                    >
                                                        <i className="fas fa-book-open me-1"></i>
                                                        Read More
                                                    </a>
                                                </td>

                                                {/* Actions Column */}
                                                <td>
                                                    {isEditing ? (
                                                        <div className="btn-group" role="group">
                                                            <button
                                                                className="btn btn-success btn-sm"
                                                                onClick={() => handleSaveInlineEdit(service, index)}
                                                                title="Save Changes"
                                                            >
                                                                <i className="fas fa-check"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-secondary btn-sm"
                                                                onClick={handleCancelInlineEdit}
                                                                title="Cancel Edit"
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="btn-group" role="group">
                                                            <button
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() => handleEditService(service, index)}
                                                                title="Edit Service"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteConfirmation(service, index);
                                                                }}
                                                                title="Delete Service"
                                                                disabled={deletingId === (service._id || service.id)}
                                                            >
                                                                {deletingId === (service._id || service.id) ? (
                                                                    <i className="fas fa-spinner fa-spin"></i>
                                                                ) : (
                                                                    <i className="fas fa-trash"></i>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {services.length === 0 && (
                            <div className="text-center py-5">
                                <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                                <h5 className="text-muted">No Services Available</h5>
                                <p className="text-muted">Click "Add New Service" to get started.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}



            {/* Service Modal */}
            <ServiceModal
                show={showModal}
                onHide={() => setShowModal(false)}
                onServiceAdded={handleServiceAdded}
                service={editingService}
                isEdit={isEdit}
            />
        </div>
    );
};

export default ServicesOverview;
