import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Nav, Tab, Table, Button, Form, Alert, Card, Badge, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../services/api';

function AdminPartner() {
    const [activeTab, setActiveTab] = useState('content');

    // Content Management State
    const [partnerPost, setPartnerPost] = useState({
        heading: '',
        thought: '',
        description: ''
    });
    const [postId, setPostId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

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
                setShowEditModal(false); // Close the modal
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



    // Partner Association Images State (local to Partner page)
    const [partnerImages, setPartnerImages] = useState([]);
    const [partnerImagesLoading, setPartnerImagesLoading] = useState(false);
    const [partnerImagesError, setPartnerImagesError] = useState('');
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImageAlt, setNewImageAlt] = useState('');

    // Fetch images for Partner page only (from /partner-association)
    useEffect(() => {
        const fetchImages = async () => {
            setPartnerImagesLoading(true);
            setPartnerImagesError('');
            try {
                const response = await api.get('/partner');
                setPartnerImages(response.data?.data || []);
            } catch (err) {
                setPartnerImagesError('Failed to load images');
            } finally {
                setPartnerImagesLoading(false);
            }
        };
        fetchImages();
    }, []);

    // Add new image to Partner Association
    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!newImageFile) return;
        setPartnerImagesLoading(true);
        setPartnerImagesError('');
        try {
            const formData = new FormData();
            formData.append('image', newImageFile);
            formData.append('alt', newImageAlt);
            // Save to /admin/partner-association
            await api.post('/partner', formData);
            setNewImageFile(null);
            setNewImageAlt('');
            // Refresh images
            const response = await api.get('/partner');
            setPartnerImages(response.data?.data || []);
        } catch (err) {
            setPartnerImagesError('Failed to add image');
        } finally {
            setPartnerImagesLoading(false);
        }
    };

    // Delete image from Partner Association
    const handleDeleteImage = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        setPartnerImagesLoading(true);
        setPartnerImagesError('');
        try {
            await api.delete(`/partner/${id}`);
            setPartnerImages(prev => prev.filter(img => img._id !== id));
        } catch (err) {
            setPartnerImagesError('Failed to delete image');
        } finally {
            setPartnerImagesLoading(false);
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
                                <Nav.Link
                                    eventKey="content"
                                    className={activeTab === 'content' ? 'active-partner-tab' : 'inactive-partner-tab'}
                                >
                                    Content Management
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link
                                    eventKey="applications"
                                    className={activeTab === 'applications' ? 'active-partner-tab' : 'inactive-partner-tab'}
                                >
                                    Partner Applications ({applications.length})
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            {/* Content Management Tab */}
                            <Tab.Pane eventKey="content">
                                <Row>
                                    <Col>
                                        {/* Content Display Card */}
                                        <Card className="mb-4 shadow-sm">
                                            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                                                <h5 className="mb-0">
                                                    <i className="fas fa-file-alt me-2"></i>
                                                    Partner Page Content
                                                </h5>
                                                <div>
                                                    <Badge bg={postId ? 'success' : 'warning'} className="me-2">
                                                        {postId ? 'Published' : 'Draft'}
                                                    </Badge>
                                                    <Button
                                                        variant="light"
                                                        size="sm"
                                                        onClick={() => setShowEditModal(true)}
                                                    >
                                                        <i className="fas fa-edit me-1"></i>
                                                        Edit Content
                                                    </Button>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                {partnerPost.heading || partnerPost.thought || partnerPost.description ? (
                                                    <div>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted mb-2">Page Heading</h6>
                                                            <h4 className="text-primary">
                                                                {partnerPost.heading || 'No heading set'}
                                                            </h4>
                                                        </div>

                                                        <div className="mb-3">
                                                            <h6 className="text-muted mb-2">Thought</h6>
                                                            <div className="text-secondary fst-italic">
                                                                <div dangerouslySetInnerHTML={{
                                                                    __html: partnerPost.thought || '<em>No thought set</em>'
                                                                }} />
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <h6 className="text-muted mb-2">Description</h6>
                                                            <div className="border-start border-primary border-3 ps-3">
                                                                <div dangerouslySetInnerHTML={{
                                                                    __html: partnerPost.description || '<em>No description set</em>'
                                                                }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-5">
                                                        <i className="fas fa-file-plus fa-3x text-muted mb-3"></i>
                                                        <h5 className="text-muted">No Content Created</h5>
                                                        <p className="text-muted mb-3">
                                                            Get started by creating your partner page content.
                                                        </p>
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => setShowEditModal(true)}
                                                        >
                                                            <i className="fas fa-plus me-2"></i>
                                                            Create Content
                                                        </Button>
                                                    </div>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                {/* Partner Association Images Row */}
                                <Row className="mb-4">
                                    <Col>
                                        <h5 className="mb-3">Our Association</h5>
                                        {partnerImagesError && <Alert variant="danger">{partnerImagesError}</Alert>}
                                        {partnerImagesLoading ? (
                                            <div className="text-center py-3">
                                                <span className="spinner-border text-primary" role="status"></span>
                                            </div>
                                        ) : (
                                            <div className="d-flex flex-row align-items-center overflow-auto" style={{ gap: '1rem' }}>
                                                {partnerImages.map(img => (
                                                    <div key={img._id} className="position-relative">
                                                        <img
                                                            src={img.url?.startsWith('http') ? img.url : `http://localhost:8000${img.url}`}
                                                            alt={img.alt || 'Association'}
                                                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                                                        />
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            className="position-absolute top-0 end-0"
                                                            style={{ zIndex: 2 }}
                                                            onClick={() => handleDeleteImage(img._id)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </Button>
                                                    </div>
                                                ))}
                                                {/* Inline Upload Field */}
                                                <form onSubmit={handleAddImage} className="d-flex flex-column align-items-center" style={{ minWidth: '120px' }}>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={e => setNewImageFile(e.target.files[0])}
                                                        style={{ marginBottom: '0.5rem' }}
                                                    />
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm mb-2"
                                                        placeholder="Alt text (optional)"
                                                        value={newImageAlt}
                                                        onChange={e => setNewImageAlt(e.target.value)}
                                                    />
                                                    <Button type="submit" variant="success" size="sm" disabled={!newImageFile || partnerImagesLoading}>
                                                        <i className="fas fa-plus"></i> Add
                                                    </Button>
                                                </form>
                                            </div>
                                        )}
                                    </Col>
                                </Row>

                                {/* Edit Content Modal */}
                                <Modal
                                    show={showEditModal}
                                    onHide={() => setShowEditModal(false)}
                                    size="lg"
                                    backdrop="static"
                                >
                                    <Modal.Header closeButton>
                                        <Modal.Title>
                                            <i className="fas fa-edit me-2"></i>
                                            {postId ? 'Edit Partner Content' : 'Create Partner Content'}
                                        </Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="fas fa-heading me-2"></i>
                                                    Page Heading
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="heading"
                                                    value={partnerPost.heading}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter an engaging page heading"
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="fas fa-lightbulb me-2"></i>
                                                    Thought/Tagline
                                                </Form.Label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={partnerPost.thought}
                                                    onChange={(content) => setPartnerPost(prev => ({ ...prev, thought: content }))}
                                                    placeholder="Enter a compelling thought or tagline"
                                                    style={{ backgroundColor: 'white' }}
                                                    modules={{
                                                        toolbar: [
                                                            ['bold', 'italic', 'underline'],
                                                            ['link'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['clean']
                                                        ]
                                                    }}
                                                />
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label>
                                                    <i className="fas fa-file-text me-2"></i>
                                                    Description
                                                </Form.Label>
                                                <ReactQuill
                                                    theme="snow"
                                                    value={partnerPost.description}
                                                    onChange={(content) => setPartnerPost(prev => ({ ...prev, description: content }))}
                                                    placeholder="Provide detailed information about your partnership program, benefits, requirements, etc."
                                                    style={{ backgroundColor: 'white', height: '200px', marginBottom: '50px' }}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': [1, 2, 3, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ 'color': [] }, { 'background': [] }],
                                                            ['blockquote', 'code-block'],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                                                            ['link', 'image'],
                                                            ['clean']
                                                        ]
                                                    }}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button
                                            variant="secondary"
                                            onClick={() => setShowEditModal(false)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            onClick={handleSubmit}
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
                                                    {postId ? 'Update Content' : 'Create Content'}
                                                </>
                                            )}
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
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

            {/* Custom CSS for Partner Management Tabs */}
            <style jsx>{`
                .active-partner-tab {
                    color: #6c757d !important;
                    background-color: #fff !important;
                    border-color: #dee2e6 #dee2e6 #fff !important;
                    font-weight: 600 !important;
                    border-bottom: 1px solid #fff !important;
                }
                
                .inactive-partner-tab {
                    color: #495057 !important;
                    background-color: transparent !important;
                    border-color: #dee2e6 !important;
                    font-weight: 400 !important;
                }
                
                .active-partner-tab:hover,
                .active-partner-tab:focus {
                    color: #5a6268 !important;
                    background-color: #fff !important;
                }
                
                .inactive-partner-tab:hover,
                .inactive-partner-tab:focus {
                    color: #495057 !important;
                    background-color: #f8f9fa !important;
                    border-color: #dee2e6 !important;
                }
            `}</style>
        </Container>
    );
}

export default AdminPartner;
