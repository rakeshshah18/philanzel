import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
const AddSectionToServiceModal = ({ serviceId, show, onClose, onSectionAdded }) => {
    const [sections, setSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (show) fetchSections();
    }, [show]);
    const API_BASE = process.env.NODE_ENV === 'production'
        ? 'https://philanzel-backend.onrender.com/api'
        : 'http://localhost:8000/api';
    const fetchSections = async () => {
        try {
            const res = await fetch(`${API_BASE}/sections`);
            const data = await res.json();
            setSections(data.data || []);
        } catch {
            setSections([]);
        }
    };
    const handleAddSection = async () => {
        if (!selectedSectionId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/services/${serviceId}/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sectionId: selectedSectionId }),
            });
            if (res.ok) {
                onSectionAdded && onSectionAdded();
                onClose();
            } else {
                alert('Failed to add section to service');
            }
        } catch (err) {
            alert('Error adding section to service');
        }
        setLoading(false);
    };
    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Add Section to Service</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <select className="form-select mb-3" value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)}>
                    <option value="">Select Section</option>
                    {sections.map(section => (
                        <option key={section._id} value={section._id}>{section.name}</option>
                    ))}
                </select>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
                <button className="btn btn-primary" onClick={handleAddSection} disabled={loading || !selectedSectionId}>Add Section</button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddSectionToServiceModal;