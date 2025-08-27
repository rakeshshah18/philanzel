import React, { useEffect, useState } from 'react';
import { getAllSections, createSection, updateSection, deleteSection } from './SectionService';

const SectionManager = ({ showCreateModal: externalShowCreateModal, setShowCreateModal: externalSetShowCreateModal }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const [editSectionId, setEditSectionId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [editFieldSelection, setEditFieldSelection] = useState({
        heading: false,
        description: false,
        subheading: false,
        subdescription: false,
        images: false,
        faqs: false,
    });
    const [editFaqInputs, setEditFaqInputs] = useState([{ question: '', answer: '' }]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [internalShowCreateModal, internalSetShowCreateModal] = useState(false);
    const showCreateModal = typeof externalShowCreateModal === 'boolean' ? externalShowCreateModal : internalShowCreateModal;
    const setShowCreateModal = externalSetShowCreateModal || internalSetShowCreateModal;
    const [formData, setFormData] = useState({
        heading: [''],
        description: [''],
        subheading: [''],
        subdescription: [''],
        images: [''],
        faqs: [{ question: '', answer: '' }],
    });
    const [fieldSelection, setFieldSelection] = useState({
        heading: false,
        description: false,
        subheading: false,
        subdescription: false,
        images: false,
        faqs: false,
    });
    const [faqInputs, setFaqInputs] = useState([{ question: '', answer: '' }]);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        setLoading(true);
        const res = await getAllSections();
        setSections(res.data || []);
        setLoading(false);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await createSection(formData);
        setShowCreateModal(false);
        setFormData({ heading: [''], description: [''], subheading: [''], subdescription: [''], images: [''], faqs: [{ question: '', answer: '' }] });
        fetchSections();
    };

    return (
        <div>
            {loading ? <div>Loading...</div> : (
                <ul className="list-group">
                    {sections.map(section => (
                        <li key={section._id} className="list-group-item">
                            {Array.isArray(section.heading) && section.heading.filter(h => h).length > 0 && (
                                <div><strong>Heading:</strong> {section.heading.filter(h => h).join(', ')}</div>
                            )}
                            {Array.isArray(section.description) && section.description.filter(d => d).length > 0 && (
                                <div><strong>Description:</strong> {section.description.filter(d => d).join(', ')}</div>
                            )}
                            {Array.isArray(section.subheading) && section.subheading.filter(s => s).length > 0 && (
                                <div><strong>Subheading:</strong> {section.subheading.filter(s => s).join(', ')}</div>
                            )}
                            {Array.isArray(section.subdescription) && section.subdescription.filter(s => s).length > 0 && (
                                <div><strong>Subdescription:</strong> {section.subdescription.filter(s => s).join(', ')}</div>
                            )}
                            {Array.isArray(section.images) && section.images.filter(img => img).length > 0 && (
                                <div><strong>Images:</strong> {section.images.filter(img => img).map((img, idx) => (
                                    <img key={idx} src={img} alt="Section" style={{ maxWidth: 80, marginRight: 8 }} />
                                ))}</div>
                            )}
                            {Array.isArray(section.faqs) && section.faqs.filter(faq => faq.question || faq.answer).length > 0 && (
                                <div>
                                    <strong>FAQs:</strong>
                                    <ul>
                                        {section.faqs.filter(faq => faq.question || faq.answer).map((faq, idx) => (
                                            <li key={idx}><strong>Q:</strong> {faq.question} <br /><strong>A:</strong> {faq.answer}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="mt-2">
                                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => {
                                    setEditSectionId(section._id);
                                    setEditFormData({
                                        heading: section.heading || '',
                                        description: section.description || '',
                                        subheading: section.subheading || '',
                                        subdescription: section.subdescription || '',
                                        images: section.images || [],
                                        faqs: section.faqs || [],
                                    });
                                    setEditFieldSelection({
                                        heading: !!section.heading,
                                        description: !!section.description,
                                        subheading: !!section.subheading,
                                        subdescription: !!section.subdescription,
                                        images: !!(section.images && section.images.length),
                                        faqs: !!(section.faqs && section.faqs.length),
                                    });
                                    setEditFaqInputs(section.faqs && section.faqs.length ? section.faqs : [{ question: '', answer: '' }]);
                                    setShowEditModal(true);
                                }}>Edit</button>
                                {showEditModal && (
                                    <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">Edit Section</h5>
                                                    <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                                                </div>
                                                <form onSubmit={async e => {
                                                    e.preventDefault();
                                                    const data = {};
                                                    Object.keys(editFieldSelection).forEach(key => {
                                                        if (editFieldSelection[key]) {
                                                            if (key === 'faqs') {
                                                                data.faqs = editFaqInputs.filter(faq => faq.question || faq.answer);
                                                            } else if (key === 'images') {
                                                                data.images = editFormData.images.filter(img => img);
                                                            } else {
                                                                data[key] = editFormData[key];
                                                            }
                                                        }
                                                    });
                                                    await updateSection(editSectionId, data);
                                                    setShowEditModal(false);
                                                    setEditSectionId(null);
                                                    setEditFormData({});
                                                    setEditFieldSelection({ heading: false, description: false, subheading: false, subdescription: false, images: false, faqs: false });
                                                    setEditFaqInputs([{ question: '', answer: '' }]);
                                                    fetchSections();
                                                }} className="modal-body">
                                                    <div className="mb-3">
                                                        <label className="form-label">Add Fields to Edit:</label>
                                                        <div className="d-flex flex-wrap">
                                                            {Object.keys(editFieldSelection).map(key => (
                                                                !editFieldSelection[key] ? (
                                                                    <button key={key} type="button" className="btn btn-outline-success btn-sm m-1 d-flex align-items-center" onClick={() => setEditFieldSelection({ ...editFieldSelection, [key]: true })}>
                                                                        <span className="me-1">+</span> {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                                    </button>
                                                                ) : null
                                                            ))}
                                                        </div>
                                                        <div className="d-flex flex-wrap">
                                                            {Object.keys(editFieldSelection).map(key => (
                                                                editFieldSelection[key] ? (
                                                                    <span key={key} className="badge bg-primary m-1 d-flex align-items-center">
                                                                        {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                                                        <button type="button" className="btn btn-sm btn-close ms-2" aria-label="Remove" onClick={() => setEditFieldSelection({ ...editFieldSelection, [key]: false })}></button>
                                                                    </span>
                                                                ) : null
                                                            ))}
                                                        </div>
                                                    </div>
                                                    {editFieldSelection.heading && (
                                                        <input type="text" className="form-control mb-2" placeholder="Heading" value={editFormData.heading} onChange={e => setEditFormData({ ...editFormData, heading: e.target.value })} />
                                                    )}
                                                    {editFieldSelection.description && (
                                                        <textarea className="form-control mb-2" placeholder="Description" value={editFormData.description} onChange={e => setEditFormData({ ...editFormData, description: e.target.value })} />
                                                    )}
                                                    {editFieldSelection.subheading && (
                                                        <input type="text" className="form-control mb-2" placeholder="Subheading" value={editFormData.subheading} onChange={e => setEditFormData({ ...editFormData, subheading: e.target.value })} />
                                                    )}
                                                    {editFieldSelection.subdescription && (
                                                        <textarea className="form-control mb-2" placeholder="Subdescription" value={editFormData.subdescription} onChange={e => setEditFormData({ ...editFormData, subdescription: e.target.value })} />
                                                    )}
                                                    {editFieldSelection.images && (
                                                        <div className="mb-2">
                                                            <label>Images (comma separated URLs):</label>
                                                            <input type="text" className="form-control" value={editFormData.images ? editFormData.images.join(',') : ''} onChange={e => setEditFormData({ ...editFormData, images: e.target.value.split(',') })} />
                                                        </div>
                                                    )}
                                                    {editFieldSelection.faqs && (
                                                        <div className="mb-2">
                                                            <label>FAQs:</label>
                                                            {editFaqInputs.map((faq, idx) => (
                                                                <div key={idx} className="d-flex mb-1">
                                                                    <input type="text" className="form-control me-1" placeholder="Question" value={faq.question} onChange={e => {
                                                                        const updated = [...editFaqInputs];
                                                                        updated[idx].question = e.target.value;
                                                                        setEditFaqInputs(updated);
                                                                    }} />
                                                                    <input type="text" className="form-control" placeholder="Answer" value={faq.answer} onChange={e => {
                                                                        const updated = [...editFaqInputs];
                                                                        updated[idx].answer = e.target.value;
                                                                        setEditFaqInputs(updated);
                                                                    }} />
                                                                    <button type="button" className="btn btn-danger btn-sm ms-1" onClick={() => setEditFaqInputs(editFaqInputs.filter((_, i) => i !== idx))}>Remove</button>
                                                                </div>
                                                            ))}
                                                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditFaqInputs([...editFaqInputs, { question: '', answer: '' }])}>Add FAQ</button>
                                                        </div>
                                                    )}
                                                    <button type="submit" className="btn btn-success">Update</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <button className="btn btn-outline-danger btn-sm" onClick={async () => {
                                    if (window.confirm('Delete this section?')) {
                                        await deleteSection(section._id);
                                        fetchSections();
                                    }
                                }}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Section</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <form onSubmit={e => {
                                e.preventDefault();
                                createSection(formData);
                                setShowCreateModal(false);
                                setFormData({
                                    heading: [''],
                                    description: [''],
                                    subheading: [''],
                                    subdescription: [''],
                                    images: [''],
                                    faqs: [{ question: '', answer: '' }]
                                });
                                fetchSections();
                            }} className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Fields:</label>
                                    {/* Heading */}
                                    <label>Heading:</label>
                                    {formData.heading.map((val, idx) => (
                                        <div key={idx} className="input-group mb-2">
                                            <input type="text" className="form-control" placeholder="Heading" value={val} onChange={e => {
                                                const arr = [...formData.heading];
                                                arr[idx] = e.target.value;
                                                setFormData({ ...formData, heading: arr });
                                            }} />
                                            <button type="button" className="btn btn-outline-success" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} onClick={() => setFormData({ ...formData, heading: [...formData.heading, ''] })}><i className="bi bi-plus-lg"></i></button>
                                            <button type="button" className="btn btn-outline-danger" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} onClick={() => setFormData({ ...formData, heading: formData.heading.filter((_, i) => i !== idx) })} disabled={formData.heading.length === 1}><i className="bi bi-dash-lg"></i></button>
                                        </div>
                                    ))}
                                    {/* Description */}
                                    <label>Description:</label>
                                    {formData.description.map((val, idx) => (
                                        <div key={idx} className="input-group mb-2">
                                            <textarea className="form-control" placeholder="Description" value={val} onChange={e => {
                                                const arr = [...formData.description];
                                                arr[idx] = e.target.value;
                                                setFormData({ ...formData, description: arr });
                                            }} />
                                            <button type="button" className="btn btn-outline-success" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} onClick={() => setFormData({ ...formData, description: [...formData.description, ''] })}><i className="bi bi-plus-lg"></i></button>
                                            <button type="button" className="btn btn-outline-danger" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} onClick={() => setFormData({ ...formData, description: formData.description.filter((_, i) => i !== idx) })} disabled={formData.description.length === 1}><i className="bi bi-dash-lg"></i></button>
                                        </div>
                                    ))}
                                    {/* Subheading */}
                                    <label>Subheading:</label>
                                    {formData.subheading.map((val, idx) => (
                                        <div key={idx} className="input-group mb-2">
                                            <input type="text" className="form-control" placeholder="Subheading" value={val} onChange={e => {
                                                const arr = [...formData.subheading];
                                                arr[idx] = e.target.value;
                                                setFormData({ ...formData, subheading: arr });
                                            }} />
                                            <button type="button" className="btn btn-outline-success" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} onClick={() => setFormData({ ...formData, subheading: [...formData.subheading, ''] })}><i className="bi bi-plus-lg"></i></button>
                                            <button type="button" className="btn btn-outline-danger" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} onClick={() => setFormData({ ...formData, subheading: formData.subheading.filter((_, i) => i !== idx) })} disabled={formData.subheading.length === 1}><i className="bi bi-dash-lg"></i></button>
                                        </div>
                                    ))}
                                    {/* Subdescription */}
                                    <label>Subdescription:</label>
                                    {formData.subdescription.map((val, idx) => (
                                        <div key={idx} className="input-group mb-2">
                                            <textarea className="form-control" placeholder="Subdescription" value={val} onChange={e => {
                                                const arr = [...formData.subdescription];
                                                arr[idx] = e.target.value;
                                                setFormData({ ...formData, subdescription: arr });
                                            }} />
                                            <button type="button" className="btn btn-outline-success" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} onClick={() => setFormData({ ...formData, subdescription: [...formData.subdescription, ''] })}><i className="bi bi-plus-lg"></i></button>
                                            <button type="button" className="btn btn-outline-danger" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} onClick={() => setFormData({ ...formData, subdescription: formData.subdescription.filter((_, i) => i !== idx) })} disabled={formData.subdescription.length === 1}><i className="bi bi-dash-lg"></i></button>
                                        </div>
                                    ))}
                                    {/* Images */}
                                    <label>Images:</label>
                                    {formData.images.map((val, idx) => (
                                        <div key={idx} className="input-group mb-2">
                                            <input type="text" className="form-control" placeholder="Image URL" value={val} onChange={e => {
                                                const arr = [...formData.images];
                                                arr[idx] = e.target.value;
                                                setFormData({ ...formData, images: arr });
                                            }} />
                                            <button type="button" className="btn btn-outline-success" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} onClick={() => setFormData({ ...formData, images: [...formData.images, ''] })}><i className="bi bi-plus-lg"></i></button>
                                            <button type="button" className="btn btn-outline-danger" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })} disabled={formData.images.length === 1}><i className="bi bi-dash-lg"></i></button>
                                        </div>
                                    ))}
                                    {/* FAQs */}
                                    <label>FAQs:</label>
                                    {formData.faqs.map((faq, idx) => (
                                        <div key={idx} className="input-group mb-2">
                                            <input type="text" className="form-control" placeholder="Question" value={faq.question} onChange={e => {
                                                const arr = [...formData.faqs];
                                                arr[idx].question = e.target.value;
                                                setFormData({ ...formData, faqs: arr });
                                            }} />
                                            <input type="text" className="form-control" placeholder="Answer" value={faq.answer} onChange={e => {
                                                const arr = [...formData.faqs];
                                                arr[idx].answer = e.target.value;
                                                setFormData({ ...formData, faqs: arr });
                                            }} />
                                            <button type="button" className="btn btn-outline-success" style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }} onClick={() => setFormData({ ...formData, faqs: [...formData.faqs, { question: '', answer: '' }] })}><i className="bi bi-plus-lg"></i></button>
                                            <button type="button" className="btn btn-outline-danger" style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} onClick={() => setFormData({ ...formData, faqs: formData.faqs.filter((_, i) => i !== idx) })} disabled={formData.faqs.length === 1}><i className="bi bi-dash-lg"></i></button>
                                        </div>
                                    ))}
                                    {/* ExtraSubheading */}
                                </div>
                                <button type="submit" className="btn btn-success">Create</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionManager;
