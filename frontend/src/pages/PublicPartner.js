import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import PartnerApplicationForm from '../components/PartnerApplicationForm';
import api from '../services/api';

function PublicPartner() {
    const [partnerData, setPartnerData] = useState({
        heading: '',
        thought: '',
        description: ''
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchPartnerData();
    }, []);
    const fetchPartnerData = async () => {
        try {
            const response = await api.get('/partner-posts');
            if (response.data && response.data.data && response.data.data.length > 0) {
                const post = response.data.data[0];
                setPartnerData({
                    heading: post.heading || 'Become Our Partner',
                    thought: post.thought || 'Building success together',
                    description: post.description || 'Join our partnership network and grow your business with us.'
                });
            }
        } catch (error) {
            console.error('Error fetching partner data:', error);
            setPartnerData({
                heading: 'Become Our Partner',
                thought: 'Building success together',
                description: 'Join our partnership network and grow your business with us.'
            });
        }
    };
    return (
        <div>
            <section className="py-5 bg-light">
                <Container>
                    <Row className="align-items-center justify-content-center">
                        <Col lg={8} className="text-center">
                            <h1 className="display-4 fw-bold mb-3">
                                {partnerData.heading}
                            </h1>
                            <p className="lead text-muted mb-4">
                                {partnerData.thought}
                            </p>
                            <p className="mb-4" style={{ whiteSpace: 'pre-line' }}>
                                {partnerData.description}
                            </p>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => setShowForm(true)}
                            >
                                Apply for Partnership
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="py-5">
                <Container>
                    <Row>
                        <Col lg={12} className="text-center mb-5">
                            <h2 className="mb-4">Partnership Benefits</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4} className="mb-4">
                            <div className="text-center">
                                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fas fa-handshake"></i>
                                </div>
                                <h4>Mutual Growth</h4>
                                <p>Grow your business alongside ours with shared success and mutual benefits.</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="text-center">
                                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fas fa-network-wired"></i>
                                </div>
                                <h4>Extended Network</h4>
                                <p>Access our extensive network of clients and business opportunities.</p>
                            </div>
                        </Col>
                        <Col md={4} className="mb-4">
                            <div className="text-center">
                                <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <h4>Business Support</h4>
                                <p>Get comprehensive support and resources to scale your business effectively.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="py-5 bg-light">
                <Container>
                    <Row>
                        <Col lg={12} className="text-center mb-5">
                            <h2 className="mb-4">Partnership Process</h2>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3} className="mb-4">
                            <div className="text-center">
                                <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                                    <span className="fw-bold">1</span>
                                </div>
                                <h5>Apply</h5>
                                <p>Submit your partnership application with your business details.</p>
                            </div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <div className="text-center">
                                <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                                    <span className="fw-bold">2</span>
                                </div>
                                <h5>Review</h5>
                                <p>Our team will review your application and assess the partnership fit.</p>
                            </div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <div className="text-center">
                                <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                                    <span className="fw-bold">3</span>
                                </div>
                                <h5>Discussion</h5>
                                <p>We'll schedule a meeting to discuss partnership terms and opportunities.</p>
                            </div>
                        </Col>
                        <Col md={3} className="mb-4">
                            <div className="text-center">
                                <div className="bg-secondary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '50px', height: '50px' }}>
                                    <span className="fw-bold">4</span>
                                </div>
                                <h5>Partnership</h5>
                                <p>Begin our successful partnership journey together.</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="py-5 bg-primary text-white">
                <Container>
                    <Row>
                        <Col lg={12} className="text-center">
                            <h2 className="mb-4">Ready to Partner with Us?</h2>
                            <p className="lead mb-4">
                                Take the first step towards a successful partnership. Apply now and let's grow together.
                            </p>
                            <Button
                                variant="light"
                                size="lg"
                                onClick={() => setShowForm(true)}
                            >
                                Start Your Application
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>
            <PartnerApplicationForm
                show={showForm}
                onHide={() => setShowForm(false)}
            />
        </div>
    );
}

export default PublicPartner;
