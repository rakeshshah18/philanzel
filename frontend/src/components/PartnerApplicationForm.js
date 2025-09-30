import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import api from '../services/api';
function PartnerApplicationForm({ show, onHide }) {
    const [formData, setFormData] = useState({
        serviceName: '',
        personName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const showAlert = (message, variant = 'success') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/user/partner-applications', formData);
            showAlert('Partnership application submitted successfully! We will review your application and get back to you soon.');
            setFormData({
                serviceName: '',
                personName: '',
                email: '',
                phone: '',
                message: ''
            });
            setTimeout(() => {
                onHide();
            }, 2000);
        } catch (error) {
            console.error('Error submitting application:', error);
            const errorMessage = error.response?.data?.message || 'Error submitting application. Please try again.';
            showAlert(errorMessage, 'danger');
        } finally {
            setLoading(false);
        }
    };
    const resetForm = () => {
        setFormData({
            serviceName: '',
            personName: '',
            email: '',
            phone: '',
            message: ''
        });
        setAlert({ show: false, message: '', variant: 'success' });
    };
    const handleModalHide = () => {
        resetForm();
        onHide();
    };
    return (
        <Modal show={show} onHide={handleModalHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Partnership Application</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {alert.show && (
                    <Alert variant={alert.variant} className="mb-4">
                        {alert.message}
                    </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Service/Business Type *</Form.Label>
                        <Form.Control
                            type="text"
                            name="serviceName"
                            value={formData.serviceName}
                            onChange={handleInputChange}
                            placeholder="e.g., Digital Marketing, Web Development, Consulting"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Contact Person Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="personName"
                            value={formData.personName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address *</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number *</Form.Label>
                        <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter your phone number"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Partnership Proposal/Message *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell us about your business, what services you offer, and how you'd like to partner with us..."
                            required
                        />
                        <Form.Text className="text-muted">
                            Please provide details about your business and partnership ideas.
                        </Form.Text>
                    </Form.Group>
                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleModalHide} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default PartnerApplicationForm;