
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const API_URL = 'http://localhost:8000/api/sections';

const SERVICE_PAGES = [
    'Retirement Solutions',
    'Mutual Fund Distribution',
    'Insurance',
    'Alternative Investment Fund (AIF)',
    'Health Insurance',
    'Portfolio Management Services (PMS)',
    'PE FUND',
    'Financial Planning'
];

const AboutServiceSection = () => {
    const { isAuthenticated } = useAuth();
    const token = localStorage.getItem('adminToken');
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [formData, setFormData] = useState({ image: '', heading: '', description: '' });
    const [showAddToModal, setShowAddToModal] = useState(false);
    const [selectedSection, setSelectedSection] = useState(null);
    const [selectedService, setSelectedService] = useState('');

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setSections(res.data.data || []);
        } catch {
            setSections([]);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (section) => {
        setEditingSection(section);
        setFormData({ image: section.image || '', heading: section.heading, description: section.description });
        setShowModal(true);
    };

    const handleAddTo = (section) => {
        setSelectedSection(section);
        setSelectedService('');
        setShowAddToModal(true);
    };

    const handleAddToSubmit = async (e) => {
        e.preventDefault();
        if (!selectedService) {
            alert('Please select a service page.');
            return;
        }
        const slug = selectedService.replace(/\s+/g, '-').toLowerCase();
        try {
            // API call to associate section with service
            await axios.post(`/api/services/${slug}/add-section`, {
                sectionId: selectedSection._id
            });
            setShowAddToModal(false);
            alert('Section added to ' + selectedService);
        } catch (err) {
            alert('Failed to add section: ' + (err?.response?.data?.message || err.message));
        }
    };

    const handleDelete = async (id) => {
        if (!isAuthenticated) {
            alert('You must be logged in as admin to delete sections.');
            return;
        }
        if (window.confirm('Delete this section?')) {
            try {
                await axios.delete(`${API_URL}/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchSections();
            } catch (err) {
                alert('Failed to delete section: ' + (err?.response?.data?.message || err.message));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert('You must be logged in as admin to update sections.');
            return;
        }
        try {
            await axios.put(`${API_URL}/${editingSection._id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            fetchSections();
        } catch (err) {
            alert('Failed to update section: ' + (err?.response?.data?.message || err.message));
        }
    };


    return (
        <div className="about-service-section">
            {loading ? <div>Loading...</div> : (
                <ul className="list-group">
                    {sections.map(section => (
                        <li key={section._id} className="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                {section.name && <div><strong>Section Name:</strong> {section.name}</div>}
                                <strong>{section.heading}</strong>
                                <p>{section.description}</p>
                                {section.image && <img src={section.image} alt="Section" style={{ maxWidth: 100 }} />}
                            </div>
                            <div className="d-flex gap-2">
                                <Button variant="outline-primary" size="sm" onClick={() => handleEdit(section)}>Edit</Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(section._id)}><i className="bi bi-trash"></i></Button>
                                <Button variant="outline-success" size="sm" onClick={() => handleAddTo(section)}>Add To Service Page</Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <Modal show={showAddToModal} onHide={() => setShowAddToModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Add Section To Service Page
                        {selectedSection && selectedSection.name && (
                            <span className="ms-2 text-primary">({selectedSection.name})</span>
                        )}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedSection && selectedSection.name && (
                        <div className="mb-2"><strong>Section Name:</strong> {selectedSection.name}</div>
                    )}
                    <Form onSubmit={handleAddToSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Select Service Page</Form.Label>
                            <Form.Select value={selectedService} onChange={e => setSelectedService(e.target.value)} required>
                                <option value="">-- Select --</option>
                                {SERVICE_PAGES.map(page => (
                                    <option key={page} value={page}>{page}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button type="submit" variant="primary">Add</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Section</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label>Heading</label>
                            <input type="text" className="form-control" name="heading" value={formData.heading} onChange={e => setFormData({ ...formData, heading: e.target.value })} required />
                        </div>
                        <div className="mb-3">
                            <label>Description</label>
                            <textarea className="form-control" name="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="mb-3">
                            <label>Image URL</label>
                            <input type="text" className="form-control" name="image" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                        </div>
                        <Button type="submit" variant="primary">Update</Button>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AboutServiceSection;
