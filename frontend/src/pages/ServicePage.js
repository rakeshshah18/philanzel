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

    // Edit/Delete logic
    const [editingSectionIdx, setEditingSectionIdx] = useState(null);
    const [editingSectionData, setEditingSectionData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const handleEditSection = (idx) => {
        setEditingSectionIdx(idx);
        setEditingSectionData({ ...service.sections[idx] });
        setShowEditModal(true);
    };

    const handleEditFieldChange = (field, value) => {
        setEditingSectionData(prev => ({ ...prev, [field]: value }));
    };

    const handleEditArrayFieldChange = (field, i, value) => {
        setEditingSectionData(prev => {
            const arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
            arr[i] = value;
            return { ...prev, [field]: arr };
        });
    };

    const handleEditModalSave = async () => {
        if (editingSectionIdx === null) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.put(`http://localhost:8000/api/services/${service._id}/sections/${editingSectionIdx}`, editingSectionData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowEditModal(false);
            setEditingSectionIdx(null);
            setEditingSectionData(null);
            // Refresh service data
            setLoading(true);
            const res = await axios.get(`/api/services/slug/${serviceId}`);
            setService(res.data.data || null);
            setLoading(false);
        } catch (err) {
            alert('Failed to update section: ' + (err?.response?.data?.message || err.message));
        }
    };

    const handleEditModalClose = () => {
        setShowEditModal(false);
        setEditingSectionIdx(null);
        setEditingSectionData(null);
    };

    const handleDeleteSection = async (idx) => {
        if (!window.confirm('Are you sure you want to delete this section?')) return;
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`http://localhost:8000/api/services/${service._id}/sections/${idx}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Refresh service data
            setLoading(true);
            const res = await axios.get(`/api/services/slug/${serviceId}`);
            setService(res.data.data || null);
            setLoading(false);
        } catch (err) {
            alert('Failed to delete section: ' + (err?.response?.data?.message || err.message));
        }
    };

    // Fetch available AboutService sections for modal
    useEffect(() => {
        if (showAddSectionModal) {
            axios.get('http://localhost:8000/api/sections')
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
                        <div key={section._id || idx} style={{ marginBottom: '1.5rem', border: '1px solid #eee', padding: '1rem', borderRadius: '8px', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 8 }}>
                                <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditSection(idx)} title="Edit"><i className="bi bi-pencil"></i></button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSection(idx)} title="Delete"><i className="bi bi-trash"></i></button>
                            </div>
                            <h3>{section.title}</h3>
                            {/* Heading */}
                            {Array.isArray(section.heading) && section.heading.length > 0 && (
                                <div><strong>Heading:</strong> {section.heading.join(', ')}</div>
                            )}
                            {/* Description */}
                            {Array.isArray(section.description) && section.description.length > 0 && (
                                <div><strong>Description:</strong> {section.description.map((d, i) => (
                                    <div key={i} dangerouslySetInnerHTML={{ __html: d }} />
                                ))}</div>
                            )}
                            {/* Subheading */}
                            {Array.isArray(section.subheading) && section.subheading.length > 0 && (
                                <div><strong>Subheading:</strong> {section.subheading.join(', ')}</div>
                            )}
                            {/* Subdescription */}
                            {Array.isArray(section.subdescription) && section.subdescription.length > 0 && (
                                <div><strong>Subdescription:</strong> {section.subdescription.map((sd, i) => (
                                    <div key={i} dangerouslySetInnerHTML={{ __html: sd }} />
                                ))}</div>
                            )}
                            {/* Points */}
                            {Array.isArray(section.points) && section.points.length > 0 && (
                                <div><strong>Points:</strong>
                                    <ul>
                                        {section.points.map((p, i) => (
                                            <li key={i} dangerouslySetInnerHTML={{ __html: p }} />
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {/* Images */}
                            {Array.isArray(section.images) && section.images.length > 0 && (
                                <div><strong>Images:</strong>
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {section.images.map((img, i) => img && (
                                            <img key={i} src={img} alt={`Section ${i}`} style={{ maxWidth: 120, maxHeight: 120, borderRadius: 6, border: '1px solid #ccc' }} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {/* FAQs */}
                            {Array.isArray(section.faqs) && section.faqs.length > 0 && (
                                <div><strong>FAQs:</strong>
                                    <ul>
                                        {section.faqs.map((faq, i) => (
                                            <li key={i}><strong>Q:</strong> {faq.question}<br /><strong>A:</strong> <span dangerouslySetInnerHTML={{ __html: faq.answer }} /></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Edit Section Modal */}
                    {showEditModal && editingSectionData && (
                        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-lg">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Section</h5>
                                        <button type="button" className="btn-close" onClick={handleEditModalClose}></button>
                                    </div>
                                    <div className="modal-body">
                                        <form>
                                            <div className="mb-3">
                                                <label className="form-label">Title</label>
                                                <input type="text" className="form-control" value={editingSectionData.title || ''} onChange={e => handleEditFieldChange('title', e.target.value)} />
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Heading</label>
                                                {Array.isArray(editingSectionData.heading) ? (
                                                    editingSectionData.heading.map((h, i) => (
                                                        <input key={i} type="text" className="form-control mb-1" value={h} onChange={e => handleEditArrayFieldChange('heading', i, e.target.value)} />
                                                    ))
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Description</label>
                                                {Array.isArray(editingSectionData.description) ? (
                                                    editingSectionData.description.map((d, i) => (
                                                        <textarea key={i} className="form-control mb-1" value={d} onChange={e => handleEditArrayFieldChange('description', i, e.target.value)} />
                                                    ))
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Subheading</label>
                                                {Array.isArray(editingSectionData.subheading) ? (
                                                    editingSectionData.subheading.map((s, i) => (
                                                        <input key={i} type="text" className="form-control mb-1" value={s} onChange={e => handleEditArrayFieldChange('subheading', i, e.target.value)} />
                                                    ))
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Subdescription</label>
                                                {Array.isArray(editingSectionData.subdescription) ? (
                                                    editingSectionData.subdescription.map((sd, i) => (
                                                        <textarea key={i} className="form-control mb-1" value={sd} onChange={e => handleEditArrayFieldChange('subdescription', i, e.target.value)} />
                                                    ))
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Points</label>
                                                {Array.isArray(editingSectionData.points) ? (
                                                    editingSectionData.points.map((p, i) => (
                                                        <textarea key={i} className="form-control mb-1" value={p} onChange={e => handleEditArrayFieldChange('points', i, e.target.value)} />
                                                    ))
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Images</label>
                                                {Array.isArray(editingSectionData.images) ? (
                                                    editingSectionData.images.map((img, i) => (
                                                        <input key={i} type="text" className="form-control mb-1" value={img} onChange={e => handleEditArrayFieldChange('images', i, e.target.value)} />
                                                    ))
                                                ) : null}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">FAQs</label>
                                                {Array.isArray(editingSectionData.faqs) ? (
                                                    editingSectionData.faqs.map((faq, i) => (
                                                        <div key={i} className="mb-2 p-2 border rounded">
                                                            <input type="text" className="form-control mb-1" placeholder="Question" value={faq.question || ''} onChange={e => {
                                                                const newFaqs = [...editingSectionData.faqs];
                                                                newFaqs[i] = { ...newFaqs[i], question: e.target.value };
                                                                setEditingSectionData(prev => ({ ...prev, faqs: newFaqs }));
                                                            }} />
                                                            <textarea className="form-control mb-1" placeholder="Answer" value={faq.answer || ''} onChange={e => {
                                                                const newFaqs = [...editingSectionData.faqs];
                                                                newFaqs[i] = { ...newFaqs[i], answer: e.target.value };
                                                                setEditingSectionData(prev => ({ ...prev, faqs: newFaqs }));
                                                            }} />
                                                        </div>
                                                    ))
                                                ) : null}
                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" onClick={handleEditModalClose}>Cancel</button>
                                        <button className="btn btn-primary" onClick={handleEditModalSave}>Save</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
                                            <option key={section._id} value={section._id}>{section.name}</option>
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
                                        const token = localStorage.getItem('adminToken');
                                        const headers = {
                                            Authorization: `Bearer ${token}`,
                                        };
                                        console.log('DEBUG: Add Section Request Headers:', headers);
                                        console.log('DEBUG: Token value:', token);
                                        await axios.post(`http://localhost:8000/api/services/${service._id}/sections`, { sectionId: selectedSectionId }, {
                                            headers,
                                        });
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
}

export default ServicePage;