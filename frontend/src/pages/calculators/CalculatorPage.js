import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { calculatorSectionsAPI, calculatorPagesAPI } from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import 'katex/dist/katex.min.css';
const CalculatorPage = () => {
    const { slug } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [availableSections, setAvailableSections] = useState([]);
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [pageSections, setPageSections] = useState([]);
    const [pageInfo, setPageInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editSectionData, setEditSectionData] = useState(null);
    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await calculatorPagesAPI.getBySlug(slug);
                setPageInfo(res.data);
                setPageSections(res.data.sections || []);
            } catch (err) {
                setError('Failed to fetch calculator page');
            }
        };
        fetchPage();
    }, [slug]);
    const handleAddSectionClick = async () => {
        setShowModal(true);
        setLoading(true);
        try {
            const res = await calculatorSectionsAPI.getAll();
            setAvailableSections(res.data);
        } catch (err) {
            setError('Failed to fetch sections');
        } finally {
            setLoading(false);
        }
    };
    const handleSectionSelect = (e) => {
        setSelectedSectionId(e.target.value);
    };
    const handleAddSectionToPage = async () => {
        if (!selectedSectionId) return;
        setLoading(true);
        try {
            await calculatorPagesAPI.addSectionToPage(pageInfo._id, selectedSectionId);
            setShowModal(false);
            setSelectedSectionId('');
            const res = await calculatorPagesAPI.getBySlug(slug);
            setPageSections(res.data.sections || []);
        } catch (err) {
            setError('Failed to add section');
        } finally {
            setLoading(false);
        }
    };
    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm('Are you sure you want to delete this section from the page?')) return;
        setLoading(true);
        try {
            await calculatorPagesAPI.deleteSectionFromPage(pageInfo._id, sectionId);
            const res = await calculatorPagesAPI.getBySlug(slug);
            setPageSections(res.data.sections || []);
        } catch (err) {
            setError('Failed to delete section');
        } finally {
            setLoading(false);
        }
    };
    const openEditModal = (section) => {
        setEditSectionData({ ...section });
        setEditModalOpen(true);
    };
    const handleEditFieldChange = (e) => {
        const { name, value } = e.target;
        setEditSectionData(prev => ({ ...prev, [name]: value }));
    };
    const handleEditSectionSave = async () => {
        setLoading(true);
        try {
            await calculatorPagesAPI.editSectionInPage(pageInfo._id, editSectionData._id, {
                sectionName: editSectionData.sectionName,
                heading: editSectionData.heading,
                content: editSectionData.content
            });
            setEditModalOpen(false);
            setEditSectionData(null);
            // Refresh page sections
            const res = await calculatorPagesAPI.getBySlug(slug);
            setPageSections(res.data.sections || []);
        } catch (err) {
            setError('Failed to edit section');
        } finally {
            setLoading(false);
        }
    };
    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript & Superscript
            ['formula'],
            ['link', 'image'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
        ]
    };
    return (
        <div className="container-fluid py-4" style={{ minHeight: '100vh' }}>
            <div className="dashboard-card shadow-sm" style={{ borderRadius: 18, background: document.body.classList.contains('dark-mode') ? '#23272f' : '#f8fafc', border: 'none', boxShadow: document.body.classList.contains('dark-mode') ? '0 2px 12px #0006' : '0 2px 12px #e0e7ef' }}>
                <div className="dashboard-card-header px-4 py-3 d-flex justify-content-between align-items-center" style={{ background: document.body.classList.contains('dark-mode') ? '#1e293b' : '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                    <h1 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>{pageInfo ? pageInfo.name : 'Calculator Page'}</h1>
                    <button className="btn btn-light btn-sm ms-2" onClick={handleAddSectionClick}>
                        <i className="bi bi-plus-circle me-1"></i> Add Section
                    </button>
                </div>
                <div className="dashboard-card-body px-4 py-4">
                    {error && <div className="alert alert-danger">{error}</div>}
                    <h2>Sections</h2>
                    {pageSections.length === 0 ? (
                        <div>No sections added yet.</div>
                    ) : (
                        <div className="row justify-content-center">
                            {pageSections.map(section => (
                                <div className="col-12 col-md-6 d-flex justify-content-center" key={section._id} style={{ paddingLeft: '0.25rem', paddingRight: '0.25rem' }}>
                                    <div className="dashboard-card shadow-sm mb-4 flex-fill" style={{
                                        maxWidth: 800,
                                        minWidth: 380,
                                        borderRadius: 16,
                                        border: 'none',
                                        position: 'relative',
                                        background: document.body.classList.contains('dark-mode') ? '#23272f' : '#f8fafc',
                                        color: document.body.classList.contains('dark-mode') ? '#fff' : '#212529',
                                        margin: '0',
                                        boxShadow: document.body.classList.contains('dark-mode') ? '0 2px 12px #0006' : '0 2px 12px #e0e7ef'
                                    }}>
                                        <div className="dashboard-card-body" style={{ padding: '1.25rem 1rem', borderRadius: 16, background: document.body.classList.contains('dark-mode') ? '#23272f' : '#f8fafc' }}>
                                            <div className="d-flex align-items-center justify-content-between" style={{ marginBottom: 18 }}>
                                                <h3 className="card-title mb-0" style={{
                                                    background: document.body.classList.contains('dark-mode') ? 'linear-gradient(90deg,#23272f 60%,#2d3748 100%)' : 'linear-gradient(90deg,#b6b2ef 60%,#dfccf0 100%)',
                                                    color: document.body.classList.contains('dark-mode') ? '#f8fafc' : '#23272f',
                                                    padding: '0.85rem 1.5rem',
                                                    borderRadius: '12px',
                                                    fontWeight: 700,
                                                    fontSize: '1.35rem',
                                                    letterSpacing: 0.5,
                                                    boxShadow: document.body.classList.contains('dark-mode') ? '0 2px 8px #0008' : '0 2px 8px #b6b2ef44',
                                                    borderBottom: document.body.classList.contains('dark-mode') ? '2px solid #444' : '2px solid #b6b2ef',
                                                    display: 'block',
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    transition: 'background 0.3s, color 0.3s',
                                                    marginBottom: 0
                                                }}>{section.sectionName || 'No name'}</h3>
                                                <span style={{ marginLeft: 12, whiteSpace: 'nowrap' }}>
                                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openEditModal(section)} title="Edit"><i className="bi bi-pencil"></i></button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSection(section._id)} title="Delete"><i className="bi bi-trash"></i></button>
                                                </span>
                                            </div>
                                            {section.heading && (
                                                <div className="mb-2"><strong>Heading:</strong> {section.heading}</div>
                                            )}
                                            {section.content && (
                                                <div className="mb-2"><strong>Content:</strong> <span dangerouslySetInnerHTML={{ __html: section.content }} /></div>
                                            )}
                                            {section.faqs && section.faqs.length > 0 && (
                                                <div className="mt-2">
                                                    <strong>FAQs:</strong> <br />
                                                    <ul className="ps-3 mb-0">
                                                        {section.faqs.map((faq, idx) => (
                                                            <li key={idx}><strong>{faq.question}</strong>: {faq.description}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Modal for section selection */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Select Section to Add</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {loading ? (
                                    <div>Loading sections...</div>
                                ) : (
                                    <select className="form-select" value={selectedSectionId} onChange={handleSectionSelect}>
                                        <option value="">Select a section</option>
                                        {availableSections.map(section => (
                                            <option key={section._id} value={section._id}>
                                                {section.sectionName}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleAddSectionToPage} disabled={!selectedSectionId || loading}>
                                    Add Section
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal for editing section */}
            {editModalOpen && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog" role="document" style={{ maxWidth: '1100px', width: '98%' }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Section</h5>
                                <button type="button" className="btn-close" onClick={() => setEditModalOpen(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-2">
                                    <label>Section Name</label>
                                    <input type="text" className="form-control" name="sectionName" value={editSectionData.sectionName} onChange={handleEditFieldChange} />
                                </div>
                                <div className="mb-2">
                                    <label>Heading</label>
                                    <input type="text" className="form-control" name="heading" value={editSectionData.heading} onChange={handleEditFieldChange} />
                                </div>
                                <div className="mb-2">
                                    <label>Content</label>
                                    <ReactQuill theme="snow" value={editSectionData.content} onChange={value => setEditSectionData(prev => ({ ...prev, content: value }))} modules={quillModules} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>
                                    Cancel
                                </button>
                                <button className="btn btn-primary" onClick={handleEditSectionSave} disabled={loading}>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CalculatorPage;