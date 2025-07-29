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
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [editMode, setEditMode] = useState(false);
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

    const handleEditServices = () => {
        try {
            setEditMode(!editMode);
            if (editMode) {
                showAlert('Edit mode disabled', 'info');
            } else {
                showAlert('Edit mode enabled - click on any service to edit', 'info');
            }
        } catch (error) {
            console.error('Error toggling edit mode:', error);
            showAlert('Failed to toggle edit mode', 'danger');
        }
    };

    const handleEditService = (service, index) => {
        if (!editMode) return;

        setEditingService({ ...service, index });
        setIsEdit(true);
        setShowModal(true);
    };

    const handleDeleteService = async (serviceId) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            await servicesAPI.delete(serviceId);
            setServices(services.filter(service => service._id !== serviceId));
            showAlert('Service deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting service:', error);
            showAlert('Failed to delete service', 'danger');
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
            } else {
                // Editing dynamic service
                setServices(services.map(service =>
                    service._id === newService._id ? { ...service, ...newService } : service
                ));
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
    return (
        <div className="container-fluid py-4">
            <div className="row mb-4">
                <div className="col-12 d-flex justify-content-between align-items-center">
                    <div>
                        <h1 className="h2 mb-0">
                            <i className="fas fa-eye me-2"></i>
                            Services Overview
                        </h1>
                        <p className="text-muted">Comprehensive overview of all our services</p>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className={`btn ${editMode ? 'btn-warning' : 'btn-outline-secondary'}`}
                            onClick={handleEditServices}
                        >
                            <i className={`fas ${editMode ? 'fa-times' : 'fa-edit'} me-2`}></i>
                            {editMode ? 'Cancel Edit' : 'Edit Services'}
                        </button>
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
            <div className="card-body">
                            
                            {editMode && (
                                <div className="alert alert-info">
                                    <i className="fas fa-info-circle me-2"></i>
                                    <strong>Edit Mode Active:</strong> Click on any service card to edit its details.
                                </div>
                            )}
                        </div>

            {loading ? (
                <div className="row">
                    <div className="col-12 text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2">Loading services...</p>
                    </div>
                </div>
            ) : (
                <div className="row">
                    {services.map((service, index) => (
                        <div key={service.id} className="col-md-6 col-lg-3 mb-4">
                            <div
                                className={`card h-100 border-left-${service.color} shadow-sm ${editMode ? 'hover-card service-card-edit' : ''}`}
                                style={{
                                    cursor: editMode ? 'pointer' : 'default'
                                }}
                                onClick={() => handleEditService(service, index)}
                            >
                                <div className="card-body text-center position-relative">
                                    {editMode && (
                                        <div className="edit-mode-indicator">
                                            <i className="fas fa-edit text-warning"></i>
                                        </div>
                                    )}
                                    <div className={`text-${service.color} mb-3`}>
                                        <i className={`${service.icon} fa-3x`}></i>
                                    </div>
                                    <h5 className="card-title">{service.name}</h5>
                                    <p className="card-text text-muted">{service.description}</p>
                                    {!editMode && (
                                        <a href={`/service-${index + 1}`} className={`btn btn-outline-${service.color} btn-sm`}>
                                            Learn More
                                        </a>
                                    )}
                                    {editMode && (
                                        <span className={`badge bg-${service.color}`}>
                                            Click to Edit
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
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
