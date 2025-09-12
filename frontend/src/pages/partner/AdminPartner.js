import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Nav, Tab, Table, Button, Form, Alert, Card, Badge, Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import api from '../../services/api';
import OurProcess from './OurProcess';

function SafeOurProcess() {
    const [error, setError] = useState(null);
    return (
        <>
            <OurProcess onError={setError} />
            {error && <Alert variant="danger">Process feature is currently unavailable.</Alert>}
        </>
    );
}

function AdminPartner() {
    // -------------------- UI State --------------------
    const [alert, setAlert] = useState({ show: false, variant: 'success', message: '' });
    const [activeTab, setActiveTab] = useState('content');

    // Partner Page Content
    const [partnerPost, setPartnerPost] = useState({ heading: '', thought: '', description: '' });
    const [postId, setPostId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Applications
    const [applications, setApplications] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [searchTerm, setSearchTerm] = useState('');

    // Partner Association Images (local to this page)
    const [partnerImages, setPartnerImages] = useState([]);
    const [partnerImagesLoading, setPartnerImagesLoading] = useState(false);
    const [partnerImagesError, setPartnerImagesError] = useState('');
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImageAlt, setNewImageAlt] = useState('');

    // -------------------- Helpers --------------------
    const showAlert = (message, variant = 'success', timeout = 3000) => {
        setAlert({ show: true, variant, message });
        if (timeout) {
            setTimeout(() => setAlert({ show: false, variant: 'success', message: '' }), timeout);
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'reviewed': return 'info';
            case 'approved': return 'success';
            case 'rejected': return 'danger';
            default: return 'secondary';
        }
    };

    const handleSort = (key) => {
        setSortConfig((prev) => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const filteredApplications = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        let data = Array.isArray(applications) ? [...applications] : [];

        if (term) {
            data = data.filter((a) => (
                (a.serviceName || '').toLowerCase().includes(term) ||
                (a.personName || '').toLowerCase().includes(term) ||
                (a.email || '').toLowerCase().includes(term) ||
                (a.phone || '').toString().includes(term) ||
                (a.message || '').toLowerCase().includes(term) ||
                (a.status || '').toLowerCase().includes(term)
            ));
        }

        const { key, direction } = sortConfig;
        data.sort((a, b) => {
            const va = a?.[key];
            const vb = b?.[key];
            if (va == null && vb == null) return 0;
            if (va == null) return direction === 'asc' ? -1 : 1;
            if (vb == null) return direction === 'asc' ? 1 : -1;

            // date sort for createdAt
            if (key === 'createdAt') {
                const da = new Date(va).getTime();
                const db = new Date(vb).getTime();
                return direction === 'asc' ? da - db : db - da;
            }

            // default string/number compare
            if (typeof va === 'number' && typeof vb === 'number') {
                return direction === 'asc' ? va - vb : vb - va;
            }
            return direction === 'asc'
                ? String(va).localeCompare(String(vb))
                : String(vb).localeCompare(String(va));
        });

        return data;
    }, [applications, searchTerm, sortConfig]);

    // -------------------- Data Fetchers --------------------
    const fetchPartnerPost = async () => {
        try {
            const response = await api.get('/admin/partner-posts');
            const list = response.data?.data || response.data || [];
            if (Array.isArray(list) && list.length > 0) {
                const post = list[0];
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
            setApplications(response.data?.data || response.data || []);
        } catch (error) {
            console.error('Error fetching applications:', error);
            setApplications([]);
        }
    };

    // Partner Association Images
    const fetchImages = async () => {
        setPartnerImagesLoading(true);
        setPartnerImagesError('');
        try {
            // FIX: Use correct endpoint for partner association images
            const response = await api.get('/partner');
            setPartnerImages(response.data?.data || []);
        } catch (err) {
            setPartnerImagesError('Failed to load images');
        } finally {
            setPartnerImagesLoading(false);
        }
    };

    useEffect(() => {
        fetchPartnerPost();
        fetchApplications();
        fetchImages();
    }, []);

    // -------------------- Handlers --------------------
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPartnerPost((prev) => ({ ...prev, [name]: value }));
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

            let response;
            if (postId) {
                response = await api.put(`/admin/partner-posts/${postId}`, requestData);
            } else {
                response = await api.post('/admin/partner-posts', requestData);
            }

            if (response.data && response.data.data) {
                const savedData = response.data.data;
                setPartnerPost({
                    heading: savedData.heading || '',
                    thought: savedData.thought || '',
                    description: savedData.description || ''
                });
                setPostId(savedData._id);
                setShowEditModal(false);
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
            await api.put(`/user/partner-applications/${applicationId}/status`, { status: newStatus });
            setApplications((prev) =>
                prev.map((app) => (app._id === applicationId ? { ...app, status: newStatus } : app))
            );
            showAlert(`Application status updated to ${newStatus}`);
        } catch (error) {
            console.error('Error updating application status:', error);
            showAlert('Error updating application status', 'danger');
        }
    };

    const deleteApplication = async (applicationId) => {
        if (!window.confirm('Are you sure you want to delete this application?')) return;
        try {
            await api.delete(`/user/partner-applications/${applicationId}`);
            setApplications((prev) => prev.filter((app) => app._id !== applicationId));
            showAlert('Application deleted successfully');
        } catch (error) {
            console.error('Error deleting application:', error);
            showAlert('Error deleting application', 'danger');
        }
    };

    // Partner Association Image Handlers
    const handleAddImage = async (e) => {
        e.preventDefault();
        if (!newImageFile) return;
        setPartnerImagesLoading(true);
        setPartnerImagesError('');
        try {
            const formData = new FormData();
            formData.append('image', newImageFile);
            formData.append('alt', newImageAlt);
            // FIX: Use correct endpoint for image upload
            await api.post('/partner', formData);
            setNewImageFile(null);
            setNewImageAlt('');
            await fetchImages();
        } catch (err) {
            setPartnerImagesError('Failed to add image');
        } finally {
            setPartnerImagesLoading(false);
        }
    };
    const handleDeleteImage = async (id) => {
        if (!window.confirm('Delete this image?')) return;
        setPartnerImagesLoading(true);
        setPartnerImagesError('');
        try {
            // FIX: Use correct endpoint for image delete
            await api.delete(`/partner/${id}`);
            setPartnerImages((prev) => prev.filter((img) => img._id !== id));
        } catch (err) {
            setPartnerImagesError('Failed to delete image');
        } finally {
            setPartnerImagesLoading(false);
        }
    };

    // -------------------- Render --------------------
    return (
        <Container fluid className="py-4">
            <Row>
                <Col>
                    <h2 className="mb-4">Partner Management</h2>

                    {alert.show && (
                        <Alert variant={alert.variant} className="mb-4">{alert.message}</Alert>
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
                            {/* -------------------- Content Management Tab -------------------- */}
                            <Tab.Pane eventKey="content">
                                <Row>
                                    <Col>
                                        {/* Content Display Card */}
                                        <Card className="mb-4 shadow-sm dashboard-card" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                                            <Card.Header className="dashboard-card-header px-4 py-3 d-flex justify-content-between align-items-center" style={{ background: '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                                                <h5 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
                                                    <i className="fas fa-file-alt me-2"></i>
                                                    Partner Page Content
                                                </h5>
                                                <div>
                                                    <Badge bg={postId ? 'success' : 'warning'} className="me-2" style={{ fontSize: 14, borderRadius: 8 }}>
                                                        {postId ? 'Published' : 'Draft'}
                                                    </Badge>
                                                    <Button variant="light" size="sm" onClick={() => setShowEditModal(true)} style={{ fontWeight: 600, color: '#1565c0' }}>
                                                        <i className="fas fa-edit me-1"></i>
                                                        {postId ? 'Edit Content' : 'Create Content'}
                                                    </Button>
                                                </div>
                                            </Card.Header>
                                            <Card.Body className="dashboard-card-body px-4 py-4">
                                                {partnerPost.heading || partnerPost.thought || partnerPost.description ? (
                                                    <div>
                                                        <div className="mb-3">
                                                            <h6 className="text-muted mb-2">Page Heading</h6>
                                                            <h4 className="text-primary">{partnerPost.heading || 'No heading set'}</h4>
                                                        </div>

                                                        <div className="mb-3">
                                                            <h6 className="text-muted mb-2">Thought</h6>
                                                            <div className="text-secondary fst-italic">
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: partnerPost.thought || '<em>No thought set</em>'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="mb-3">
                                                            <h6 className="text-muted mb-2">Description</h6>
                                                            <div className="border-start border-primary border-3 ps-3">
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: partnerPost.description || '<em>No description set</em>'
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-5">
                                                        <i className="fas fa-file-plus fa-3x text-muted mb-3"></i>
                                                        <h5 className="text-muted">No Content Created</h5>
                                                        <p className="text-muted mb-3">Get started by creating your partner page content.</p>
                                                        <Button variant="primary" onClick={() => setShowEditModal(true)}>
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
                                        <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                                            <div className="dashboard-card-header px-4 py-3" style={{ background: '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                                                <h5 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
                                                    <i className="fas fa-handshake me-2"></i>
                                                    Our Association
                                                </h5>
                                            </div>
                                            <div className="dashboard-card-body px-4 py-4">
                                                {partnerImagesError && <Alert variant="danger">{partnerImagesError}</Alert>}
                                                {partnerImagesLoading ? (
                                                    <div className="text-center py-3">
                                                        <span className="spinner-border text-primary" role="status"></span>
                                                    </div>
                                                ) : (
                                                    <div className="d-flex flex-row align-items-center overflow-auto" style={{ gap: '1rem' }}>
                                                        {partnerImages.map((img) => (
                                                            <div key={img._id} className="position-relative dashboard-card p-2 d-flex align-items-center justify-content-center" style={{ minWidth: '120px', minHeight: '120px', background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #bae6fd' }}>
                                                                <img
                                                                    src={img.url?.startsWith('http') ? img.url : `${process.env.NODE_ENV === 'production' ? 'https://philanzel-backend.vercel.app' : 'http://localhost:8000'}${img.url}`}
                                                                    alt={img.alt || 'Association'}
                                                                    style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #ddd' }}
                                                                />
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    className="position-absolute"
                                                                    style={{ top: '8px', right: '8px', zIndex: 10, borderRadius: '50%', padding: '6px', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                                                                    onClick={() => handleDeleteImage(img._id)}
                                                                >
                                                                    <i className="bi bi-trash"></i>
                                                                </Button>
                                                            </div>
                                                        ))}
                                                        {/* Inline Upload Field */}
                                                        <form onSubmit={handleAddImage} className="d-flex flex-column align-items-center dashboard-card p-2" style={{ minWidth: '120px', background: '#e3fcec', borderRadius: 10, boxShadow: '0 2px 8px #bae6fd' }}>
                                                            <input type="file" accept="image/*" onChange={(e) => setNewImageFile(e.target.files[0])} style={{ marginBottom: '0.5rem' }} />
                                                            <input
                                                                type="text"
                                                                className="form-control form-control-sm mb-2"
                                                                placeholder="Alt text (optional)"
                                                                value={newImageAlt}
                                                                onChange={(e) => setNewImageAlt(e.target.value)}
                                                            />
                                                            <Button type="submit" variant="success" size="sm" disabled={!newImageFile || partnerImagesLoading}>
                                                                <i className="fas fa-plus"></i> Add
                                                            </Button>
                                                        </form>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>

                                {/* OurProcess CRUD UI (only when content tab is active) */}
                                {activeTab === 'content' && (
                                    <Row className="mb-4">
                                        <Col>
                                            <SafeOurProcess />
                                        </Col>
                                    </Row>
                                )}

                                {/* Edit Content Modal */}
                                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" backdrop="static">
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
                                                    onChange={(content) => setPartnerPost((prev) => ({ ...prev, thought: content }))}
                                                    placeholder="Enter a compelling thought or tagline"
                                                    style={{ backgroundColor: 'white' }}
                                                    modules={{
                                                        toolbar: [
                                                            ['bold', 'italic', 'underline'],
                                                            ['link'],
                                                            [{ list: 'ordered' }, { list: 'bullet' }],
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
                                                    onChange={(content) => setPartnerPost((prev) => ({ ...prev, description: content }))}
                                                    placeholder="Provide detailed information about your partnership program, benefits, requirements, etc."
                                                    style={{ backgroundColor: 'white', height: '200px', marginBottom: '50px' }}
                                                    modules={{
                                                        toolbar: [
                                                            [{ header: [1, 2, 3, false] }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            [{ color: [] }, { background: [] }],
                                                            ['blockquote', 'code-block'],
                                                            [{ list: 'ordered' }, { list: 'bullet' }],
                                                            [{ indent: '-1' }, { indent: '+1' }],
                                                            ['link', 'image'],
                                                            ['clean']
                                                        ]
                                                    }}
                                                />
                                            </Form.Group>
                                        </Form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={loading}>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
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

                            {/* -------------------- Applications Tab -------------------- */}
                            <Tab.Pane eventKey="applications">
                                <div className="mb-3">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search applications..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="table-responsive">
                                    <Table striped bordered hover>
                                        <thead>
                                            <tr>
                                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('serviceName')}>
                                                    Service Name {sortConfig.key === 'serviceName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                                </th>
                                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('personName')}>
                                                    Person Name {sortConfig.key === 'personName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                                </th>
                                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('email')}>
                                                    Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                                </th>
                                                <th>Phone</th>
                                                <th>Message</th>
                                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('status')}>
                                                    Status {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                                </th>
                                                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                                                    Submitted {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                                                </th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredApplications.length === 0 ? (
                                                <tr>
                                                    <td colSpan="8" className="text-center">No applications found</td>
                                                </tr>
                                            ) : (
                                                filteredApplications.map((application) => (
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
                                                        <td>{application.createdAt ? new Date(application.createdAt).toLocaleDateString() : ''}</td>
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
                                                                    <option value="approved">Approved</option>
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
            <style>{`
        .active-partner-tab {
          color: #6c757d !important;
          background-color: #666060ff !important;
          border-color: #555758ff #75797eff #696767ff !important;
          font-weight: 600 !important;
          border-bottom: 1px solid #696565ff !important;
        }
        .inactive-partner-tab {
          color: #495057 !important;
          background-color: transparent !important;
          border-color: #646668ff !important;
          font-weight: 400 !important;
        }
        .active-partner-tab:hover,
        .active-partner-tab:focus {
          color: #262b30ff !important;
          background-color: #b4b0b0ff !important;
        }
        .inactive-partner-tab:hover,
        .inactive-partner-tab:focus {
          color: #495057 !important;
          background-color: #636464ff !important;
          border-color: #696a6bff !important;
        }
      `}</style>
        </Container>
    );
}

export default AdminPartner;
