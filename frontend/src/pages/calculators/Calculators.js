import React, { useState, useEffect } from 'react';
import { calculatorPagesAPI, calculatorSectionsAPI } from '../../services/api';
import CalcSection from "./calcSection";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Calculators.css';
import 'katex/dist/katex.min.css';

const Calculators = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showSectionModal, setShowSectionModal] = useState(false);
    const [name, setName] = useState('');
    const [editName, setEditName] = useState('');
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [calculatorPages, setCalculatorPages] = useState([]);
    const [sectionName, setSectionName] = useState("");
    const [sections, setSections] = useState([]);
    const [loadingSections, setLoadingSections] = useState(false);
    const [sectionError, setSectionError] = useState("");
    const [editSectionModal, setEditSectionModal] = useState(false);
    const [editSectionForm, setEditSectionForm] = useState({ sectionName: '', heading: '', content: '', faqs: [] });
    const [editSectionId, setEditSectionId] = useState(null);
    const [editSectionError, setEditSectionError] = useState("");
    const [editSectionLoading, setEditSectionLoading] = useState(false);
    const [newSectionForm, setNewSectionForm] = useState({ sectionName: '', heading: '', content: '', faqs: [] });

    useEffect(() => {
        fetchCalculatorPages();
    }, [showDeleteModal, showAddModal]);

    // Fetch all sections for display below buttons
    const fetchSections = async () => {
        setLoadingSections(true);
        try {
            const res = await calculatorSectionsAPI.getAll();
            setSections(res.data);
            setSectionError("");
        } catch (err) {
            setSectionError("Failed to fetch sections");
        } finally {
            setLoadingSections(false);
        }
    };

    const fetchCalculatorPages = async () => {
        try {
            const response = await calculatorPagesAPI.getAll();
            setCalculatorPages(response.data.data || []);
        } catch {
            setCalculatorPages([]);
        }
    };

    const handleAddCalculator = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await calculatorPagesAPI.create({ name });
            setSuccess('Calculator added successfully!');
            setName('');
            setShowAddModal(false);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to add calculator');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id, name) => {
        setEditId(id);
        setEditName(name);
        setShowEditModal(true);
        setError('');
        setSuccess('');
    };

    const handleEditCalculator = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setError('');
        setSuccess('');
        try {
            await calculatorPagesAPI.update(editId, { name: editName });
            setSuccess('Calculator updated successfully!');
            setShowEditModal(false);
            setEditId(null);
            setEditName('');
            fetchCalculatorPages();
        } catch (err) {
            setError('Failed to update calculator');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteCalculator = async (id) => {
        setDeleteLoading(true);
        setDeleteError('');
        try {
            await calculatorPagesAPI.delete(id);
            setCalculatorPages(calculatorPages.filter(page => page._id !== id));
        } catch (err) {
            setDeleteError('Failed to delete calculator');
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        fetchSections();
    }, []);

    // Add handlers for edit and delete
    const handleEditSection = (section) => {
        setEditSectionId(section._id);
        setEditSectionForm({
            sectionName: section.sectionName,
            heading: section.heading,
            content: section.content,
            faqs: section.faqs || []
        });
        setEditSectionModal(true);
        setEditSectionError("");
    };

    const handleEditSectionSubmit = async (e) => {
        e.preventDefault();
        setEditSectionLoading(true);
        setEditSectionError("");
        try {
            await calculatorSectionsAPI.update(editSectionId, editSectionForm);
            setEditSectionModal(false);
            setEditSectionId(null);
            setEditSectionForm({ sectionName: '', heading: '', content: '', faqs: [] });
            fetchSections();
        } catch (err) {
            setEditSectionError(err?.response?.data?.error || "Failed to update section");
        } finally {
            setEditSectionLoading(false);
        }
    };

    const handleSubmitSection = async (e) => {
        e.preventDefault();
        setLoadingSections(true);
        setSectionError("");
        try {
            await calculatorSectionsAPI.create(newSectionForm);
            fetchSections();
            setNewSectionForm({ sectionName: '', heading: '', content: '', faqs: [] });
        } catch (err) {
            setSectionError(err?.response?.data?.error || "Failed to save section");
        } finally {
            setLoadingSections(false);
        }
    };

    const handleDeleteSection = async (id) => {
        if (!window.confirm("Delete this section?")) return;
        try {
            await calculatorSectionsAPI.delete(id);
            fetchSections();
        } catch (err) {
            setSectionError("Failed to delete section");
        }
    };

    // Helper to check if content is HTML
    const isHtmlContent = content => /<\/?[a-z][\s\S]*>/i.test(content);

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-2">Calculators</h2>
            <div className="d-flex gap-2 mb-3">
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    Add Calculator
                </button>
                <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                    Delete Calculator
                </button>
                <button className="btn btn-success" onClick={() => setShowSectionModal(true)}>
                    Add Section
                </button>
            </div>

            {/* Section List Below Buttons */}
            <div className="mt-4">
                <h4>Calculator Sections</h4>
                {sectionError && <div className="alert alert-danger">{sectionError}</div>}
                {loadingSections ? (
                    <div>Loading sections...</div>
                ) : (
                    <div>
                        {sections.length === 0 ? (
                            <div>No sections found.</div>
                        ) : (
                            <div className="row">
                                {sections.map(section => {
                                    const htmlContent = isHtmlContent(section.content);
                                    return (
                                        <div className="col-md-6 mb-3" key={section._id}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">{section.sectionName || 'No name'}</h5>
                                                    {section.heading && (
                                                        <h6 className="card-subtitle mb-2 text-muted">{section.heading}</h6>
                                                    )}
                                                    {htmlContent ? (
                                                        <div className="card-text" dangerouslySetInnerHTML={{ __html: section.content }} />
                                                    ) : (
                                                        <p className="card-text" style={{ whiteSpace: 'pre-line' }}>{section.content}</p>
                                                    )}
                                                    {section.faqs && section.faqs.length > 0 && (
                                                        <div>
                                                            <strong>FAQs:</strong> <br />
                                                            <ul>
                                                                {section.faqs.map((faq, idx) => (
                                                                    <li key={idx}><strong>{faq.question}</strong>: {faq.description}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    <div className="mt-3 d-flex gap-2">
                                                        <button type="button" className="btn btn-sm btn-outline-info" onClick={() => handleEditSection(section)} title="Edit">
                                                            <i className="bi bi-pencil-square"></i> Edit
                                                        </button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSection(section._id)} title="Delete">
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Add Calculator Modal */}
            {showAddModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Calculator</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <form onSubmit={handleAddCalculator}>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Calculator Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    {error && <div className="text-danger mt-2">{error}</div>}
                                    {success && <div className="text-success mt-2">{success}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading || !name}>
                                        {loading ? 'Adding...' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Calculator Modal */}
            {showDeleteModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Calculator</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {deleteError && <div className="text-danger mb-2">{deleteError}</div>}
                                {calculatorPages.length === 0 ? (
                                    <div className="text-muted">No calculators found.</div>
                                ) : (
                                    <ul className="list-group">
                                        {calculatorPages.map(page => (
                                            <li key={page._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>{page.name}</span>
                                                <span className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleEditClick(page._id, page.name)}
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDeleteCalculator(page._id)}
                                                        disabled={deleteLoading}
                                                        title="Delete"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Calculator Modal */}
            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Calculator</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <form onSubmit={handleEditCalculator}>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Calculator Name"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        required
                                        disabled={editLoading}
                                    />
                                    {error && <div className="text-danger mt-2">{error}</div>}
                                    {success && <div className="text-success mt-2">{success}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={editLoading || !editName}>
                                        {editLoading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Section Modal */}
            {showSectionModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Calculator Section</h5>
                                <button type="button" className="btn-close" onClick={() => setShowSectionModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <CalcSection onSaved={() => { setShowSectionModal(false); fetchCalculatorPages(); }} hideSectionList={true} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Section Modal */}
            {editSectionModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Calculator Section</h5>
                                <button type="button" className="btn-close" onClick={() => setEditSectionModal(false)}></button>
                            </div>
                            <form onSubmit={handleEditSectionSubmit}>
                                <div className="modal-body">
                                    <div className="mb-2">
                                        <label>Section Name</label>
                                        <input name="sectionName" value={editSectionForm.sectionName} onChange={e => setEditSectionForm({ ...editSectionForm, sectionName: e.target.value })} className="form-control" required />
                                    </div>
                                    <div className="mb-2">
                                        <label>Heading</label>
                                        <input name="heading" value={editSectionForm.heading} onChange={e => setEditSectionForm({ ...editSectionForm, heading: e.target.value })} className="form-control" required />
                                    </div>
                                    <div className="mb-2">
                                        <label>Content</label>
                                        <ReactQuill
                                            value={editSectionForm.content}
                                            onChange={value => setEditSectionForm({ ...editSectionForm, content: value })}
                                            modules={{
                                                toolbar: [
                                                    [{ 'header': [1, 2, false] }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'script': 'sub' }, { 'script': 'super' }], // Subscript & Superscript
                                                    ['formula'], // Math formula button using KaTeX
                                                    ['link', 'image'],
                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                    ['clean']
                                                ]
                                            }}
                                            className="mb-2"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label>FAQs</label>
                                        {editSectionForm.faqs.map((faq, idx) => (
                                            <div key={idx} className="mb-2 border p-2 rounded">
                                                <input
                                                    type="text"
                                                    placeholder="Question"
                                                    value={faq.question}
                                                    onChange={e => {
                                                        const faqs = [...editSectionForm.faqs];
                                                        faqs[idx].question = e.target.value;
                                                        setEditSectionForm({ ...editSectionForm, faqs });
                                                    }}
                                                    className="form-control mb-1"
                                                />
                                                <textarea
                                                    placeholder="Description"
                                                    value={faq.description}
                                                    onChange={e => {
                                                        const faqs = [...editSectionForm.faqs];
                                                        faqs[idx].description = e.target.value;
                                                        setEditSectionForm({ ...editSectionForm, faqs });
                                                    }}
                                                    className="form-control mb-1"
                                                />
                                                <button type="button" className="btn btn-danger btn-sm" onClick={() => {
                                                    const faqs = editSectionForm.faqs.filter((_, i) => i !== idx);
                                                    setEditSectionForm({ ...editSectionForm, faqs });
                                                }}>
                                                    Remove FAQ
                                                </button>
                                            </div>
                                        ))}
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditSectionForm({ ...editSectionForm, faqs: [...editSectionForm.faqs, { question: "", description: "" }] })}>
                                            Add FAQ
                                        </button>
                                    </div>
                                    {editSectionError && <div className="alert alert-danger mt-2">{editSectionError}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setEditSectionModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={editSectionLoading}>
                                        {editSectionLoading ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calculators;
