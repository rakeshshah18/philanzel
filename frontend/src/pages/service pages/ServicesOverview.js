import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../../services/api';
import ServiceModal from '../../components/ServiceModal';
import './ServicesOverview.css';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const ServicesOverview = () => {
    // Dark mode detection
    const [isDarkMode, setIsDarkMode] = useState(false);
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDarkMode(document.body.classList.contains('dark-mode'));
        };
        checkDarkMode();
        const observer = new MutationObserver(() => checkDarkMode());
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [showEditListModal, setShowEditListModal] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await servicesAPI.getAll();
            if (response.data.data && response.data.data.length > 0) {
                setServices(response.data.data);
            } else {
                setServices([]);
            }
        } catch (error) {
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddService = () => {
        setEditingService(null);
        setIsEdit(false);
        setShowModal(true);
    };

    const handleServiceAdded = () => {
        fetchServices();
        setShowModal(false);
    };

    const handleDeleteService = async (serviceId) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                await servicesAPI.delete(serviceId);
                fetchServices();
            } catch {
                alert('Failed to delete service.');
            }
        }
    };

    return (
        <div className="services-overview-container">
            <h2 className="mb-4">Services Sections</h2>
            <div className="d-flex align-items-center mb-3">
                <button className="btn btn-primary me-2" onClick={handleAddService}>
                    Add New Service
                </button>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEditListModal(true)}
                    disabled={services.length === 0}
                >
                    Edit Service Name
                </button>
            </div>

            <Modal show={showEditListModal} onHide={() => setShowEditListModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Service Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {services.length === 0 ? (
                        <div className="text-muted">No services found.</div>
                    ) : (
                        <ul className="list-group">
                            {services.map(service => (
                                <li key={service._id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>{service.name}</span>
                                    <div style={{ background: isDarkMode ? '#181818' : '#f4f8fc', minHeight: '100vh' }}>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => {
                                                setEditingService(service);
                                                setIsEdit(true);
                                                setShowModal(true);
                                                setShowEditListModal(false);
                                            }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleDeleteService(service._id)}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </Modal.Body>
            </Modal>

            {loading ? (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading services...</p>
                </div>
            ) : (
                services.length === 0 && (
                    <div className="text-center text-muted">No services found.</div>
                )
            )}
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
