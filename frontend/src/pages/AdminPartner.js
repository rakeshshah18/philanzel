import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Tab, Table, Button, Form, Alert } from 'react-bootstrap';
import api from '../services/api';

function AdminPartner() {
    const [activeTab, setActiveTab] = useState('content');

    // Content Management State
    const [partnerPost, setPartnerPost] = useState({
        heading: '',
        thought: '',
        description: ''
    });
    const [postId, setPostId] = useState(null);

    // Applications State
    const [applications, setApplications] = useState([]);

    // Alert State
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPartnerPost();
        fetchApplications();
    }, []);

    const showAlert = (message, variant = 'success') => {
        setAlert({ show: true, message, variant });
        setTimeout(() => setAlert({ show: false, message: '', variant: 'success' }), 3000);
    };

    const fetchPartnerPost = async () => {
        try {
            const response = await api.get('/partner-posts');
            console.log('Partner posts response:', response.data);
            if (response.data && response.data.data && response.data.data.length > 0) {
                const post = response.data.data[0];
                setPartnerPost({
                    heading: post.heading || '',
                    thought: post.thought || '',
                    description: post.description || ''
                });
                setPostId(post._id);
            }
        } catch (error) {
            console.error('Error fetching partner post:', error);
        }
    };

    const fetchApplications = async () => {
        try {
            const response = await api.get('/user/partner-applications');
            console.log('Partner applications response:', response.data);
            setApplications(response.data?.data || response.data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setApplications([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPartnerPost(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const requestData = {
                heading: partnerPost.heading,
                thought: partnerPost.thought,
                description: partnerPost.description
            };

            console.log('Submitting partner post:', requestData);

            let response;
            if (postId) {
                response = await api.put(`/admin/partner-posts/${postId}`, requestData);
            } else {
                response = await api.post('/admin/partner-posts', requestData);
            }

            console.log('Response received:', response.data);

            if (response.data && response.data.data) {
                const savedData = response.data.data;
                setPartnerPost({
                    heading: savedData.heading || '',
                    thought: savedData.thought || '',
                    description: savedData.description || ''
                });
                setPostId(savedData._id);
                showAlert('Partner content updated successfully!');
            }
        } catch (error) {
            console.error('Error saving partner post:', error);
            console.error('Error details:', error.response?.data);
            showAlert('Error saving partner content. Please try again.', 'danger');
        } finally {
            setLoading(false);
        }
    };

    const updateApplicationStatus = async (applicationId, newStatus) => {
        try {
            await api.put(`/user/partner-applications/${applicationId}/status`, {
                status: newStatus
            });

            setApplications(prev =>
                prev.map(app =>
                    app._id === applicationId
                        ? { ...app, status: newStatus }
                        : app
                )
            );

            showAlert(`Application status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating application status:', error);
            showAlert('Error updating application status', 'danger');
        }
    };

    const deleteApplication = async (applicationId) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await api.delete(`/user/partner-applications/${applicationId}`);
                setApplications(prev => prev.filter(app => app._id !== applicationId));
                showAlert('Application deleted successfully');
            } catch (error) {
                console.error('Error deleting application:', error);
                showAlert('Error deleting application', 'danger');
            }
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'reviewed': return 'info';
            case 'accepted': return 'success';
            case 'rejected': return 'danger';
            default: return 'secondary';
        }
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <h2 className="mb-4">Partner Management</h2>

                    {alert.show && (
                        <Alert variant={alert.variant} className="mb-4">
                            {alert.message}
                        </Alert>
                    )}

                    <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                        <Nav variant="tabs" className="mb-4">
                            <Nav.Item>
                                <Nav.Link eventKey="content">Content Management</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="applications">
                                    Partner Applications ({applications.length})
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            {/* Content Management Tab */}
                            <Tab.Pane eventKey="content">
                                <Row>
                                    <Col lg={8}>
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Page Heading</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="heading"
                                                    value={partnerPost.heading}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter page heading"
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Thought</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="thought"
                                                    value={partnerPost.thought}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter your thought"
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>Description</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={6}
                                                    name="description"
                                                    value={partnerPost.description}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter page description"
                                                    required
                                                />
                                            </Form.Group>

                                            <Button
                                                type="submit"
                                                variant="primary"
                                                disabled={loading}
                                                className="mb-4"
                                            >
                                                {loading ? 'Saving...' : (postId ? 'Update Content' : 'Create Content')}
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Tab.Pane>

                            {/* Applications Tab */}
                            <Tab.Pane eventKey="applications">
                                <div className="table-responsive">
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th>Service Name</th>
                                                <th>Person Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Message</th>
                                                <th>Status</th>
                                                <th>Submitted</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center">No applications found</td>
                                                </tr>
                                            ) : (
                                                applications.map((application) => (
                                                    <tr key={application._id}>
                                                        <td>{application.serviceName}</td>
                                                        <td>{application.personName}</td>
                                                        <td>{application.email}</td>
                                                        <td>{application.phone}</td>
                                                        <td>
                                                            <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                                {application.message}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <span className={`badge bg-${getStatusVariant(application.status)}`}>
                                                                {application.status}
                                                            </span>
                                                        </td>
                                                        <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                                                        <td>
                                                            <div className="d-flex gap-1 flex-wrap">
                                                                <select
                                                                    className="form-select form-select-sm"
                                                                    value={application.status}
                                                                    onChange={(e) => updateApplicationStatus(application._id, e.target.value)}
                                                                    style={{ minWidth: '100px' }}
                                                                >
                                                                    <option value="pending">Pending</option>
                                                                    <option value="reviewed">Reviewed</option>
                                                                    <option value="accepted">Accepted</option>
                                                                    <option value="rejected">Rejected</option>
                                                                </select>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    onClick={() => deleteApplication(application._id)}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>
        </Container>
    );
}

export default AdminPartner;
