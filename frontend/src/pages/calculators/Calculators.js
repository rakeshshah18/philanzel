import React, { useState, useEffect } from 'react';
import { calculatorPagesAPI, calculatorSectionsAPI } from '../../services/api';
import CalcSection from "./calcSection";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Calculators.css';
import 'katex/dist/katex.min.css';

const Calculators = () => {
    // Utility to check if content is HTML
    const isHtmlContent = content => /<\/?[a-z][\s\S]*>/i.test(content);

    // Delete a section
    const handleDeleteSection = async (id) => {
        if (!window.confirm('Delete this section?')) return;
        setLoadingSections(true);
        setSectionError("");
        try {
            await calculatorSectionsAPI.delete(id);
            fetchSections();
        } catch (err) {
            setSectionError('Failed to delete section');
        } finally {
            setLoadingSections(false);
        }
    };
    // Fetch all calculator pages
    const fetchCalculatorPages = async () => {
        try {
            const res = await calculatorPagesAPI.getAll();
            console.log('Full API response:', res); // Debug log
            console.log('res.data:', res.data); // Debug log
            console.log('res.data.data:', res.data?.data); // Debug log
            
            // Extract the actual data array from the response
            let pages = [];
            if (res.data && res.data.success && Array.isArray(res.data.data)) {
                pages = res.data.data;
            } else if (Array.isArray(res.data)) {
                pages = res.data;
            } else if (Array.isArray(res)) {
                pages = res;
            }
            
            console.log('Pages to set:', pages); // Debug log
            console.log('Is pages array?', Array.isArray(pages)); // Debug log
            console.log('Pages length:', pages.length); // Debug log
            setCalculatorPages(pages);
        } catch (err) {
            console.error('Fetch calculators error:', err);
            setError('Failed to fetch calculators');
            setCalculatorPages([]); // Ensure it stays an array
        }
    };

    // Fetch all calculator sections
    const fetchSections = async () => {
        setLoadingSections(true);
        setSectionError("");
        try {
            const res = await calculatorSectionsAPI.getAll();
            setSections(res.data || []);
        } catch (err) {
            setSectionError('Failed to fetch sections');
        } finally {
            setLoadingSections(false);
        }
    };

    // Add a new calculator
    const handleAddCalculator = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            await calculatorPagesAPI.create({ name });
            setSuccess('Calculator added');
            setShowAddModal(false);
            setName("");
            fetchCalculatorPages();
        } catch (err) {
            setError('Failed to add calculator');
        } finally {
            setLoading(false);
        }
    };

    // Edit calculator name (open modal)
    const handleEditClick = (id, name) => {
        setEditId(id);
        setEditName(name);
        setShowEditModal(true);
    };

    // Save edited calculator name
    const handleEditCalculator = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setError("");
        setSuccess("");
        try {
            await calculatorPagesAPI.update(editId, { name: editName });
            setSuccess('Calculator updated');
            setShowEditModal(false);
            setEditId(null);
            setEditName("");
            fetchCalculatorPages();
        } catch (err) {
            setError('Failed to update calculator');
        } finally {
            setEditLoading(false);
        }
    };

    // Delete a calculator
    const handleDeleteCalculator = async (id, name) => {
        if (!window.confirm(`Delete "${name}" calculator?`)) return;
        setDeleteLoading(true);
        setDeleteError("");
        try {
            console.log('Deleting calculator with ID:', id);
            const deleteResult = await calculatorPagesAPI.delete(id);
            console.log('Delete result:', deleteResult);
            setDeleteError("");
            fetchCalculatorPages();
        } catch (err) {
            console.error('Delete calculator error:', err);
            setDeleteError(`Failed to delete calculator: ${err.message || err.toString()}`);
        } finally {
            setDeleteLoading(false);
        }
    };

    // Edit a section (open modal)
    const handleEditSection = (section) => {
        setEditSectionId(section._id);
        setEditSectionForm({
            sectionName: section.sectionName || '',
            heading: section.heading || '',
            content: section.content || '',
            faqs: section.faqs || [],
        });
        setEditSectionModal(true);
    };

    // Save edited section
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
            setEditSectionError('Failed to update section');
        } finally {
            setEditSectionLoading(false);
        }
    };
    // ...existing state and effect hooks...
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
    const [sections, setSections] = useState([]);
    const [loadingSections, setLoadingSections] = useState(false);
    const [sectionError, setSectionError] = useState("");
    const [editSectionModal, setEditSectionModal] = useState(false);
    const [editSectionForm, setEditSectionForm] = useState({ sectionName: '', heading: '', content: '', faqs: [] });
    const [editSectionId, setEditSectionId] = useState(null);
    const [editSectionError, setEditSectionError] = useState("");
    const [editSectionLoading, setEditSectionLoading] = useState(false);
    // Removed unused newSectionForm state

    useEffect(() => {
        fetchCalculatorPages();
    }, [showDeleteModal, showAddModal]);
    useEffect(() => {
        fetchSections();
    }, []);

    return (
        <div className="container-fluid py-4" style={{ background: isDarkMode ? '#181818' : 'linear-gradient(135deg, #b6b2efff 0%, #dfccf0ff 100%)', minHeight: '100vh' }}>
            <h2 className="mb-4" style={{ fontWeight: 700, background: isDarkMode ? '#222' : '#c5bde5ff', color: isDarkMode ? '#dfd0d0ff' : '#212529', borderRadius: '12px', padding: '0.75rem 2rem', display: 'inline-block', boxShadow: '0 2px 8px #b6b2ef44' }}>Calculators</h2>
            <div className="d-flex gap-2 mb-3">
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    <i className="bi bi-plus-circle me-1"></i> Add Calculator
                </button>
                <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                    <i className="bi bi-trash me-1"></i> Delete Calculator
                </button>
                <button className="btn btn-success" onClick={() => setShowSectionModal(true)}>
                    <i className="bi bi-plus-square me-1"></i> Create Section
                </button>
                <button className="btn btn-outline-secondary" onClick={fetchSections} title="Refresh Sections">
                    <i className="bi bi-arrow-clockwise"></i>
                </button>
            </div>
            <div className="mt-4">
                <h4 style={{ fontWeight: 700, background: isDarkMode ? '#222' : '#e9e6f7', color: isDarkMode ? '#fff' : '#212529', borderRadius: '8px', padding: '0.5rem 1rem', display: 'inline-block', marginBottom: '1rem' }}>Calculator Sections</h4>
                {sectionError && <div className="alert alert-danger">{sectionError}</div>}
                {loadingSections ? (
                    <div>Loading sections...</div>
                ) : (
                    <div>
                        {sections.length === 0 ? (
                            <div>No sections found.</div>
                        ) : (
                            <div className="row justify-content-center">
                                {sections.map(section => {
                                    const htmlContent = isHtmlContent(section.content);
                                    return (
                                        <div className="col-12 col-sm-6 mb-4 d-flex justify-content-center" key={section._id}>
                                            <div className="dashboard-card shadow-sm h-100 w-100" style={{
                                                borderRadius: '16px',
                                                background: isDarkMode ? '#23272f' : '#fff',
                                                color: isDarkMode ? '#fff' : '#23272f',
                                                minWidth: 340,
                                                maxWidth: 800,
                                                boxShadow: isDarkMode ? '0 2px 12px #0006' : '0 2px 12px #e0e7ef',
                                                border: isDarkMode ? '1px solid #444' : '1px solid #e0e7ef',
                                                padding: 0
                                            }}>
                                                <div className="d-flex align-items-center justify-content-between" style={{
                                                    borderTopLeftRadius: '16px',
                                                    borderTopRightRadius: '16px',
                                                    background: 'none',
                                                    padding: '1rem 1.25rem 1rem 1.25rem',
                                                    borderBottom: isDarkMode ? '1px solid #444' : '1px solid #e0e7ef',
                                                    marginBottom: 0
                                                }}>
                                                    <h5 className="card-title mb-0" style={{
                                                        fontWeight: 800,
                                                        fontSize: '1.35rem',
                                                        letterSpacing: 0.5,
                                                        color: isDarkMode ? '#f8fafc' : '#23272f',
                                                        background: isDarkMode ? '#23272f' : '#f3f4fa',
                                                        borderRadius: '8px',
                                                        marginBottom: 0,
                                                        padding: '0.6rem 1.2rem',
                                                        borderLeft: isDarkMode ? '6px solid #b6b2ef' : '6px solid #7c3aed',
                                                        boxShadow: isDarkMode ? '0 1px 4px #0004' : '0 1px 4px #b6b2ef22',
                                                        transition: 'background 0.3s, color 0.3s'
                                                    }}>{section.sectionName || 'No name'}</h5>
                                                    <span style={{ marginLeft: 12, whiteSpace: 'nowrap' }}>
                                                        <button type="button" className="btn btn-sm btn-outline-info me-2" onClick={() => handleEditSection(section)} title="Edit">
                                                            <i className="bi bi-pencil-square"></i> Edit
                                                        </button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSection(section._id)} title="Delete">
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </span>
                                                </div>
                                                <div className="card-body d-flex flex-column" style={{ color: isDarkMode ? '#fff' : '#23272f', padding: '1.25rem 1.25rem' }}>
                                                    {section.heading && (
                                                        <h6 className="card-subtitle mb-2" style={{ color: isDarkMode ? '#fff' : '#6c757d', fontWeight: 600 }}>{section.heading}</h6>
                                                    )}
                                                    {htmlContent ? (
                                                        <div className="card-text" style={{ color: isDarkMode ? '#fff' : '#212529' }} dangerouslySetInnerHTML={{ __html: section.content }} />
                                                    ) : (
                                                        <p className="card-text" style={{ whiteSpace: 'pre-line', color: isDarkMode ? '#fff' : '#212529' }}>{section.content}</p>
                                                    )}
                                                    {section.faqs && section.faqs.length > 0 && (
                                                        <div className="mt-2">
                                                            <strong style={{ color: isDarkMode ? '#fff' : '#212529' }}>FAQs:</strong> <br />
                                                            <ul className="ps-3 mb-0">
                                                                {section.faqs.map((faq, idx) => (
                                                                    <li key={idx} style={{ color: isDarkMode ? '#fff' : '#212529' }}><strong>{faq.question}</strong>: {faq.description}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                    <div className="mt-auto d-flex gap-2">
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
                                {(!Array.isArray(calculatorPages) || calculatorPages.length === 0) ? (
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
                                                        onClick={() => handleDeleteCalculator(page._id, page.name)}
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
                                                    [{ 'script': 'sub' }, { 'script': 'super' }],
                                                    ['formula'],
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
    // ...existing code for modals and forms is included in the main return above...
}
export default Calculators;
