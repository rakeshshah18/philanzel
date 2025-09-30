import React, { useState, useEffect } from 'react';
import { servicesAPI } from '../../services/api';
import ServiceModal from '../../components/ServiceModal';
import './ServicesOverview.css';
import { Modal, Button } from 'react-bootstrap';

const ServicesOverview = () => {
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
        <div className="container-fluid py-4">
            <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: isDarkMode ? '#23272f' : '#f8fafc', border: 'none', boxShadow: isDarkMode ? '0 2px 12px #0006' : '0 2px 12px #e0e7ef' }}>
                <div className="dashboard-card-header px-4 py-3 d-flex justify-content-between align-items-center" style={{ background: isDarkMode ? '#1e293b' : '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                    <h2 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>Services Sections</h2>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-light btn-sm me-2" onClick={handleAddService}>
                            <i className="fas fa-plus me-1"></i> Add New Service
                        </button>
                        <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => setShowEditListModal(true)}
                            disabled={services.length === 0}
                        >
                            <i className="fas fa-edit me-1"></i> Edit Service Name
                        </button>
                    </div>
                </div>
                <div className="dashboard-card-body px-4 py-4">

                    <Modal show={showEditListModal} onHide={() => setShowEditListModal(false)}>
                        <Modal.Header closeButton style={{ background: isDarkMode ? '#1e293b' : '#1565c0', color: '#fff' }}>
                            <Modal.Title>Edit Service Name</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ background: isDarkMode ? '#23272f' : '#f8fafc' }}>
                            {services.length === 0 ? (
                                <div className="text-muted">No services found.</div>
                            ) : (
                                <ul className="list-group">
                                    {services.map(service => (
                                        <li key={service._id} className="list-group-item d-flex justify-content-between align-items-center" style={{ background: isDarkMode ? '#181818' : '#fff', borderRadius: 8, marginBottom: 4 }}>
                                            <span>{service.name}</span>
                                            <div>
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
            </div>
        </div>
    );
};

export default ServicesOverview;
