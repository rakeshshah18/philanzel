import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ServicesSections = () => {
    // Detect dark mode
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

    const [sections, setSections] = useState([]);
    const [showEditSectionModal, setShowEditSectionModal] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
    const [newSection, setNewSection] = useState({ name: '', heading: [''], description: [''], subheading: [''], subdescription: [''], points: [''], images: [''], faqs: [{ question: '', answer: '' }] });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');

    const handleEditSection = (section) => {
        setEditingSection({ ...section }); // ensure a new object reference
        setShowEditSectionModal(true);
    };

    const handleEditFieldChange = (field, value) => {
        setEditingSection(prev => ({ ...prev, [field]: value }));
    };

    const handleEditArrayFieldChange = (field, idx, value) => {
        setEditingSection(prev => {
            const arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
            arr[idx] = value;
            return { ...prev, [field]: arr };
        });
    };

    const handleEditModalClose = () => {
        setShowEditSectionModal(false);
        setEditingSection(null);
    };

    const handleEditModalSave = async () => {
        if (!editingSection || !editingSection._id) return;
        try {
            const res = await fetch(`http://localhost:8000/api/sections/${editingSection._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingSection),
            });
            if (res.ok) {
                setShowEditSectionModal(false);
                setEditingSection(null);
                fetchSections();
            } else {
                alert('Failed to update section');
            }
        } catch (err) {
            alert('Error updating section');
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            // TODO: Implement section delete API call
            alert(`Delete section with ID: ${sectionId}`);
        }
    };

    const handleCreateSection = () => {
        setShowCreateSectionModal(true);
        setNewSection({ name: '', heading: [''], description: [''], subheading: [''], subdescription: [''], points: [''], images: [''], faqs: [{ question: '', answer: '' }] });
        setCreateError('');
    };

    const handleCreateFieldChange = (field, value) => {
        setNewSection(prev => ({ ...prev, [field]: value }));
    };
    const handleCreateArrayFieldChange = (field, idx, value) => {
        setNewSection(prev => {
            const arr = Array.isArray(prev[field]) ? [...prev[field]] : [];
            arr[idx] = value;
            return { ...prev, [field]: arr };
        });
    };
    const handleCreateFaqChange = (idx, key, value) => {
        setNewSection(prev => {
            const faqs = Array.isArray(prev.faqs) ? [...prev.faqs] : [];
            faqs[idx] = { ...faqs[idx], [key]: value };
            return { ...prev, faqs };
        });
    };
    const handleCreateModalClose = () => {
        setShowCreateSectionModal(false);
        setCreateError('');
    };
    const handleCreateModalSave = async () => {
        setCreateLoading(true);
        setCreateError('');
        try {
            const res = await fetch('http://localhost:8000/api/sections', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSection)
            });
            if (res.ok) {
                setShowCreateSectionModal(false);
                fetchSections();
            } else {
                setCreateError('Failed to create section');
            }
        } catch {
            setCreateError('Error creating section');
        } finally {
            setCreateLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/sections');
            const data = await res.json();
            // Deduplicate by _id
            const uniqueSections = [];
            const seenIds = new Set();
            for (const section of (data.data || [])) {
                if (!seenIds.has(section._id)) {
                    uniqueSections.push(section);
                    seenIds.add(section._id);
                }
            }
            setSections(uniqueSections);
        } catch {
            setSections([]);
        }
    };
    // Helper functions for dynamic fields
    const addArrayField = (section, field) => {
        return { ...section, [field]: [...section[field], ''] };
    };
    const removeArrayField = (section, field, idx) => {
        return { ...section, [field]: section[field].filter((_, i) => i !== idx) };
    };
    const addFaqField = section => {
        return { ...section, faqs: [...section.faqs, { question: '', answer: '' }] };
    };
    const removeFaqField = (section, idx) => {
        return { ...section, faqs: section.faqs.filter((_, i) => i !== idx) };
    };
    return (
        <React.Fragment>
            <div className="container-fluid py-4">
                <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: isDarkMode ? '#23272f' : '#f8fafc', border: 'none', boxShadow: isDarkMode ? '0 2px 12px #0006' : '0 2px 12px #e0e7ef' }}>
                    <div className="dashboard-card-header px-4 py-3 d-flex justify-content-between align-items-center" style={{ background: isDarkMode ? '#1e293b' : '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                        <h2 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>Service Sections</h2>
                        <button className="btn btn-light btn-sm ms-1" onClick={handleCreateSection}>
                            <i className="fas fa-plus me-1"></i> Create Section
                        </button>
                    </div>
                    <div className="dashboard-card-body px-4 py-4">
                        <div className="row mb-4 g-4" style={{ marginRight: 0, marginLeft: 0 }}>
                            {sections.length === 0 ? (
                                <div className="text-center text-muted">No sections found.</div>
                            ) : (
                                sections.map(section => (
                                    <div className="col-md-4 mb-4" key={section._id} style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
                                        <div className="dashboard-card h-100 border-0 shadow-sm d-flex flex-column" style={{ background: isDarkMode ? '#23272f' : '#f8fafc', borderRadius: 16, boxShadow: isDarkMode ? '0 2px 12px #0006' : '0 2px 12px #e0e7ef', transition: 'box-shadow 0.2s' }}>
                                            <div className="dashboard-card-header px-3 py-2 d-flex justify-content-between align-items-center" style={{ background: isDarkMode ? '#1e293b' : '#1565c0', color: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}>
                                                <h5 className="card-title mb-0 fw-bold" style={{ fontSize: '1.15rem', letterSpacing: 1 }}>
                                                    <span style={{ marginRight: 8, color: '#fff' }}><i className="bi bi-grid-3x3-gap"></i></span>
                                                    {section.name}
                                                </h5>
                                                <div>
                                                    <button className="btn btn-sm btn-light border me-2" style={{ borderRadius: '20px' }} onClick={() => handleEditSection(section)}>
                                                        <i className="bi bi-pencil text-primary"></i>
                                                    </button>
                                                    <button className="btn btn-sm btn-light border" style={{ borderRadius: '20px' }} onClick={() => handleDeleteSection(section._id)}>
                                                        <i className="bi bi-trash text-danger"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="dashboard-card-body p-3 flex-grow-1 d-flex flex-column" style={{ fontFamily: 'Roboto, Arial, sans-serif', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, background: isDarkMode ? '#23272f' : '#f8fafc' }}>
                                                <div className="d-flex justify-content-between align-items-center mb-3">
                                                    <h5 className="card-title mb-0 fw-bold" style={{
                                                        fontSize: '1.15rem',
                                                        background: isDarkMode ? '#222' : '#928abcff',
                                                        color: isDarkMode ? '#ffffffff' : '#212529',
                                                        borderRadius: '8px',
                                                        padding: '6px 12px',
                                                        display: 'inline-block'
                                                    }}>
                                                        <span style={{ marginRight: 8, color: '#6366f1' }}><i className="bi bi-grid-3x3-gap"></i></span>
                                                        <span style={{
                                                            color: isDarkMode ? '#f4ececff' : '#212529',
                                                            background: isDarkMode ? '#222' : '#b6b0e3ff',
                                                            borderRadius: '8px',
                                                            padding: '6px 12px',
                                                            display: 'inline-block'
                                                        }}>{section.name}</span>
                                                    </h5>
                                                    <div>
                                                        <button className="btn btn-sm btn-light border me-2" style={{ borderRadius: '20px' }} onClick={() => handleEditSection(section)}>
                                                            <i className="bi bi-pencil text-primary"></i>
                                                        </button>
                                                        <button className="btn btn-sm btn-light border" style={{ borderRadius: '20px' }} onClick={() => handleDeleteSection(section._id)}>
                                                            <i className="bi bi-trash text-danger"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                {/* Limited content rendering */}
                                                {/* Render all content directly, no expand/collapse logic */}
                                                {(() => {
                                                    // Helper to limit text (not used anymore)
                                                    return (
                                                        <>
                                                            <div className="mb-2 pb-2 border-bottom">
                                                                {Array.isArray(section.heading) && section.heading.length > 0 && (
                                                                    <div className="mb-1"><span className="fw-semibold text-muted"><i className="bi bi-type-bold me-1"></i>Heading:</span> <span className="text-dark">{Array.from(new Set(section.heading.filter(h => h))).join(', ')}</span></div>
                                                                )}
                                                                {Array.isArray(section.description) && section.description.length > 0 && (
                                                                    <div className="mb-1">
                                                                        <span className="fw-semibold text-muted"><i className="bi bi-card-text me-1"></i>Description:</span>
                                                                        {Array.from(new Set(section.description.filter(d => d))).map((d, idx) => (
                                                                            <div key={idx} className="text-dark" dangerouslySetInnerHTML={{ __html: d }} />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Group: Sub Info */}
                                                            {(Array.isArray(section.subheading) && section.subheading.filter(s => s).length > 0) || (Array.isArray(section.subdescription) && section.subdescription.filter(s => s).length > 0) ? (
                                                                <div className="mb-2 pb-2 border-bottom">
                                                                    {Array.isArray(section.subheading) && section.subheading.filter(s => s).length > 0 && (
                                                                        <div className="mb-1"><span className="fw-semibold text-muted"><i className="bi bi-list-ul me-1"></i>Subheading:</span>
                                                                            <ul className="list-unstyled mb-0 ms-2">
                                                                                {Array.from(new Set(section.subheading.filter(s => s))).map((s, idx) => (
                                                                                    <li key={idx} className="text-dark">{s}</li>
                                                                                ))}
                                                                            </ul>
                                                                        </div>
                                                                    )}
                                                                    {Array.isArray(section.subdescription) && section.subdescription.filter(s => s).length > 0 && (
                                                                        <div className="mb-1">
                                                                            <span className="fw-semibold text-muted"><i className="bi bi-list-ul me-1"></i>Subdescription:</span>
                                                                            {Array.from(new Set(section.subdescription.filter(s => s))).map((s, idx) => (
                                                                                <div key={idx} className="text-dark" dangerouslySetInnerHTML={{ __html: s }} />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : null}
                                                            {/* Group: Points & Images */}
                                                            {(Array.isArray(section.points) && section.points.filter(p => p).length > 0) || (Array.isArray(section.images) && section.images.length > 0) ? (
                                                                <div className="mb-2 pb-2 border-bottom">
                                                                    {Array.isArray(section.points) && section.points.filter(p => p).length > 0 && (
                                                                        <div className="mb-1">
                                                                            <span className="fw-semibold text-muted"><i className="bi bi-check2-square me-1"></i>Points:</span>
                                                                            {Array.from(new Set(section.points.filter(p => p))).map((p, idx) => (
                                                                                <div key={idx} className="text-dark" dangerouslySetInnerHTML={{ __html: p }} />
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    {Array.isArray(section.images) && section.images.length > 0 && (
                                                                        <div className="mb-1"><span className="fw-semibold text-muted"><i className="bi bi-image me-1"></i>Images:</span>
                                                                            <div className="d-flex flex-wrap gap-2 ms-2">
                                                                                {Array.from(new Set(section.images.filter(img => img))).map((img, idx) => (
                                                                                    <img key={idx} src={img} alt="Section" className="img-fluid mt-2 rounded-2 border" style={{ maxHeight: 70, maxWidth: 70, background: '#fff' }} />
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ) : null}
                                                            {/* Group: FAQs */}
                                                            {Array.isArray(section.faqs) && section.faqs.filter(faq => faq.question || faq.answer).length > 0 && (
                                                                <div className="mb-2">
                                                                    <span className="fw-semibold text-muted"><i className="bi bi-question-circle me-1"></i>FAQs:</span>
                                                                    <ul className="list-unstyled mb-0 ms-2">
                                                                        {Array.from(new Set(section.faqs.filter(faq => faq.question || faq.answer).map(faq => JSON.stringify(faq)))).map((faqStr, idx) => {
                                                                            const faq = JSON.parse(faqStr);
                                                                            return <li key={idx} className="text-dark"><span className="fw-bold">Q:</span> {faq.question} <br /><span className="fw-bold">A:</span> <span dangerouslySetInnerHTML={{ __html: faq.answer }} /></li>;
                                                                        })}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Edit Section Modal */}
            <Modal
                show={Boolean(showEditSectionModal)}
                onHide={handleEditModalClose}
                centered
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <div style={{ width: '100%', maxWidth: '1200px' }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Section</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ padding: '2rem' }}>
                            {editingSection && (
                                <form style={{ maxWidth: '100%', width: '100%', padding: '2rem' }}>
                                    <div className="mb-3">
                                        <label className="form-label">Name</label>
                                        <input type="text" className="form-control" value={editingSection.name || ''} onChange={e => handleEditFieldChange('name', e.target.value)} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Heading</label>
                                        {Array.isArray(editingSection.heading) ? (
                                            editingSection.heading.map((h, idx) => (
                                                <input key={idx} type="text" className="form-control mb-1" value={h} onChange={e => handleEditArrayFieldChange('heading', idx, e.target.value)} />
                                            ))
                                        ) : null}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        {Array.isArray(editingSection.description) ? (
                                            editingSection.description.map((d, idx) => (
                                                <ReactQuill
                                                    key={idx}
                                                    theme="snow"
                                                    value={d}
                                                    onChange={value => handleEditArrayFieldChange('description', idx, value)}
                                                    className="mb-2"
                                                    style={{ minHeight: 80, width: '100%' }}
                                                />
                                            ))
                                        ) : null}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Subheading</label>
                                        {Array.isArray(editingSection.subheading) && editingSection.subheading.map((s, idx) => (
                                            <div key={idx} className="d-flex align-items-center mb-1">
                                                <input type="text" className="form-control" value={s} onChange={e => handleEditArrayFieldChange('subheading', idx, e.target.value)} />
                                                <button type="button" className="btn btn-light ms-2" onClick={() => setEditingSection(removeArrayField(editingSection, 'subheading', idx))}><i className="bi bi-dash"></i></button>
                                                {idx === editingSection.subheading.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setEditingSection(addArrayField(editingSection, 'subheading'))}><i className="bi bi-plus"></i></button>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Subdescription</label>
                                        {Array.isArray(editingSection.subdescription) && editingSection.subdescription.map((s, idx) => (
                                            <div key={idx} className="d-flex align-items-center mb-1">
                                                <ReactQuill theme="snow" value={s} onChange={value => handleEditArrayFieldChange('subdescription', idx, value)} className="mb-2" style={{ minHeight: 80, width: '100%' }} />
                                                <button type="button" className="btn btn-light ms-2" onClick={() => setEditingSection(removeArrayField(editingSection, 'subdescription', idx))}><i className="bi bi-dash"></i></button>
                                                {idx === editingSection.subdescription.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setEditingSection(addArrayField(editingSection, 'subdescription'))}><i className="bi bi-plus"></i></button>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Points</label>
                                        {Array.isArray(editingSection.points) && editingSection.points.map((p, idx) => (
                                            <div key={idx} className="d-flex align-items-center mb-1">
                                                <ReactQuill theme="snow" value={p} onChange={value => handleEditArrayFieldChange('points', idx, value)} className="mb-2" style={{ minHeight: 80, width: '100%' }} />
                                                <button type="button" className="btn btn-light ms-2" onClick={() => setEditingSection(removeArrayField(editingSection, 'points', idx))}><i className="bi bi-dash"></i></button>
                                                {idx === editingSection.points.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setEditingSection(addArrayField(editingSection, 'points'))}><i className="bi bi-plus"></i></button>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Images</label>
                                        {Array.isArray(editingSection.images) && editingSection.images.map((img, idx) => (
                                            <div key={idx} className="d-flex align-items-center mb-1">
                                                <input type="text" className="form-control" value={img} onChange={e => handleEditArrayFieldChange('images', idx, e.target.value)} />
                                                <button type="button" className="btn btn-light ms-2" onClick={() => setEditingSection(removeArrayField(editingSection, 'images', idx))}><i className="bi bi-dash"></i></button>
                                                {idx === editingSection.images.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setEditingSection(addArrayField(editingSection, 'images'))}><i className="bi bi-plus"></i></button>}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">FAQs</label>
                                        {Array.isArray(editingSection.faqs) && editingSection.faqs.map((faq, idx) => (
                                            <div key={idx} className="mb-2 p-2 border rounded">
                                                <div className="d-flex align-items-center mb-1">
                                                    <input type="text" className="form-control mb-1" placeholder="Question" value={faq.question || ''} onChange={e => {
                                                        const newFaqs = [...editingSection.faqs];
                                                        newFaqs[idx] = { ...newFaqs[idx], question: e.target.value };
                                                        setEditingSection(prev => ({ ...prev, faqs: newFaqs }));
                                                    }} />
                                                    <button type="button" className="btn btn-light ms-2" onClick={() => setEditingSection(removeFaqField(editingSection, idx))}><i className="bi bi-dash"></i></button>
                                                    {idx === editingSection.faqs.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setEditingSection(addFaqField(editingSection))}><i className="bi bi-plus"></i></button>}
                                                </div>
                                                <ReactQuill theme="snow" value={faq.answer || ''} onChange={value => {
                                                    setEditingSection(prev => {
                                                        const newFaqs = Array.isArray(prev.faqs) ? [...prev.faqs] : [];
                                                        newFaqs[idx] = { ...newFaqs[idx], answer: value };
                                                        return { ...prev, faqs: newFaqs };
                                                    });
                                                }} className="mb-2" style={{ minHeight: 80, width: '100%' }} />
                                            </div>
                                        ))}
                                    </div>
                                </form>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-secondary" onClick={handleEditModalClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleEditModalSave}>Save</button>
                        </Modal.Footer>
                    </div>
                </div>
            </Modal>
            {/* Create Section Modal */}
            <Modal
                show={Boolean(showCreateSectionModal)}
                onHide={handleCreateModalClose}
                centered
            >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <div style={{ width: '100%', maxWidth: '3200px' }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Section</Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{ padding: '2rem' }}>
                            <form style={{ maxWidth: '100%', width: '100%', padding: '2rem' }}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input type="text" className="form-control" value={newSection.name} onChange={e => handleCreateFieldChange('name', e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Heading</label>
                                    {Array.isArray(newSection.heading) && newSection.heading.map((h, idx) => (
                                        <input key={idx} type="text" className="form-control mb-1" value={h} onChange={e => handleCreateArrayFieldChange('heading', idx, e.target.value)} />
                                    ))}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    {Array.isArray(newSection.description) && newSection.description.map((d, idx) => (
                                        <ReactQuill
                                            key={idx}
                                            theme="snow"
                                            value={d}
                                            onChange={value => handleCreateArrayFieldChange('description', idx, value)}
                                            className="mb-2"
                                            style={{ minHeight: 80, width: '100%' }}
                                        />
                                    ))}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Subheading</label>
                                    {Array.isArray(newSection.subheading) && newSection.subheading.map((s, idx) => (
                                        <div key={idx} className="d-flex align-items-center mb-1">
                                            <input type="text" className="form-control" value={s} onChange={e => handleCreateArrayFieldChange('subheading', idx, e.target.value)} />
                                            <button type="button" className="btn btn-light ms-2" onClick={() => setNewSection(removeArrayField(newSection, 'subheading', idx))}><i className="bi bi-dash"></i></button>
                                            {idx === newSection.subheading.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setNewSection(addArrayField(newSection, 'subheading'))}><i className="bi bi-plus"></i></button>}
                                        </div>
                                    ))}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Subdescription</label>
                                    {Array.isArray(newSection.subdescription) && newSection.subdescription.map((s, idx) => (
                                        <div key={idx} className="d-flex align-items-center mb-1">
                                            <ReactQuill theme="snow" value={s} onChange={value => handleCreateArrayFieldChange('subdescription', idx, value)} className="mb-2" style={{ minHeight: 80, width: '100%' }} />
                                            <button type="button" className="btn btn-light ms-2" onClick={() => setNewSection(removeArrayField(newSection, 'subdescription', idx))}><i className="bi bi-dash"></i></button>
                                            {idx === newSection.subdescription.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setNewSection(addArrayField(newSection, 'subdescription'))}><i className="bi bi-plus"></i></button>}
                                        </div>
                                    ))}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Points</label>
                                    {Array.isArray(newSection.points) && newSection.points.map((p, idx) => (
                                        <div key={idx} className="d-flex align-items-center mb-1">
                                            <ReactQuill theme="snow" value={p} onChange={value => handleCreateArrayFieldChange('points', idx, value)} className="mb-2" style={{ minHeight: 80, width: '100%' }} />
                                            <button type="button" className="btn btn-light ms-2" onClick={() => setNewSection(removeArrayField(newSection, 'points', idx))}><i className="bi bi-dash"></i></button>
                                            {idx === newSection.points.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setNewSection(addArrayField(newSection, 'points'))}><i className="bi bi-plus"></i></button>}
                                        </div>
                                    ))}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Images</label>
                                    {Array.isArray(newSection.images) && newSection.images.map((img, idx) => (
                                        <div key={idx} className="d-flex align-items-center mb-1">
                                            <input type="text" className="form-control" value={img} onChange={e => handleCreateArrayFieldChange('images', idx, e.target.value)} />
                                            <button type="button" className="btn btn-light ms-2" onClick={() => setNewSection(removeArrayField(newSection, 'images', idx))}><i className="bi bi-dash"></i></button>
                                            {idx === newSection.images.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setNewSection(addArrayField(newSection, 'images'))}><i className="bi bi-plus"></i></button>}
                                        </div>
                                    ))}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">FAQs</label>
                                    {Array.isArray(newSection.faqs) && newSection.faqs.map((faq, idx) => (
                                        <div key={idx} className="mb-2 p-2 border rounded">
                                            <div className="d-flex align-items-center mb-1">
                                                <input type="text" className="form-control mb-1" placeholder="Question" value={faq.question || ''} onChange={e => handleCreateFaqChange(idx, 'question', e.target.value)} />
                                                <button type="button" className="btn btn-light ms-2" onClick={() => setNewSection(removeFaqField(newSection, idx))}><i className="bi bi-dash"></i></button>
                                                {idx === newSection.faqs.length - 1 && <button type="button" className="btn btn-light ms-1" onClick={() => setNewSection(addFaqField(newSection))}><i className="bi bi-plus"></i></button>}
                                            </div>
                                            <ReactQuill theme="snow" value={faq.answer || ''} onChange={value => handleCreateFaqChange(idx, 'answer', value)} className="mb-2" style={{ minHeight: 80, width: '100%' }} />
                                        </div>
                                    ))}
                                </div>
                                {createError && <div className="alert alert-danger mt-2">{createError}</div>}
                            </form>
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-secondary" onClick={handleCreateModalClose}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleCreateModalSave} disabled={createLoading}>Create</button>
                        </Modal.Footer>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default ServicesSections;

