import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ServicePage = () => {
    const { serviceId } = useParams();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showAddSectionModal, setShowAddSectionModal] = useState(false);
    const [availableSections, setAvailableSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [addingSection, setAddingSection] = useState(false);

    // Fetch available AboutService sections for modal
    useEffect(() => {
        if (showAddSectionModal) {
            axios.get('/api/admin/services-sections/about-service')
                .then(res => setAvailableSections(res.data.data || []))
                .catch(() => setAvailableSections([]));
        }
    }, [showAddSectionModal]);
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/services/slug/${serviceId}`)
            .then(res => {
                console.log('API response:', res.data);
                console.log('Service object:', res.data.data);
                setService(res.data.data || null);
                setLoading(false);
            })
            .catch((err) => {
                console.log('API error:', err);
                setService(null);
                setLoading(false);
            });
    }, [serviceId]);

    if (loading) return <div>Loading...</div>;
    if (!service) return <div>Service not found.</div>;

    return (
        <div>
            <h1>{service.name}</h1>
            {/* <p>{service.description}</p> */}
            <button className="btn btn-success mb-3" onClick={() => setShowAddSectionModal(true)}>
                Add Section
            </button>
            {service.sections && service.sections.length > 0 && (
                <div>
                    <h2>Sections</h2>
                    {service.sections.map((section, idx) => (
                        <div key={section._id || idx} style={{ marginBottom: '1.5rem', border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
                            <h3>{section.title}</h3>
                            <p>{section.content}</p>
                            {section.image && (
                                <img src={section.image} alt={section.title} style={{ maxWidth: 200, marginTop: 8 }} />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Add Section Modal */}
            {showAddSectionModal && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Section to Add</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddSectionModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {availableSections.length === 0 ? (
                                    <div>No sections available.</div>
                                ) : (
                                    <select className="form-select" value={selectedSectionId} onChange={e => setSelectedSectionId(e.target.value)}>
                                        <option value="">-- Select Section --</option>
                                        {availableSections.map(section => (
                                            <option key={section._id} value={section._id}>{section.heading}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowAddSectionModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-primary" disabled={!selectedSectionId || addingSection} onClick={async () => {
                                    if (!selectedSectionId) return;
                                    setAddingSection(true);
                                    try {
                                        await axios.post(`/api/services/${serviceId}/add-section`, { sectionId: selectedSectionId });
                                        setShowAddSectionModal(false);
                                        setSelectedSectionId('');
                                        setAddingSection(false);
                                        // Refresh service data
                                        setLoading(true);
                                        const res = await axios.get(`/api/services/slug/${serviceId}`);
                                        setService(res.data.data || null);
                                        setLoading(false);
                                    } catch (err) {
                                        alert('Failed to add section: ' + (err?.response?.data?.message || err.message));
                                        setAddingSection(false);
                                    }
                                }}>Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicePage;