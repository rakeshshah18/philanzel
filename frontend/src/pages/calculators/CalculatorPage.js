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
        // Fetch calculator page info by slug
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
            // API call to associate section with page using id
            await calculatorPagesAPI.addSectionToPage(pageInfo._id, selectedSectionId);
            setShowModal(false);
            setSelectedSectionId('');
            // Refresh page sections
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
            // Refresh page sections
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
        <div className="container-fluid py-4 ps-2" style={{ paddingLeft: 0, marginLeft: 0 }}>
            <h2>{pageInfo ? pageInfo.name : 'Calculator Page'}</h2>
            <button className="btn btn-success mb-3" onClick={handleAddSectionClick}>
                Add Section
            </button>
            {error && <div className="alert alert-danger">{error}</div>}
            {/* Sections List */}
            <div>
                <h4>Sections</h4>
                {pageSections.length === 0 ? (
                    <div>No sections added yet.</div>
                ) : (
                    <ul>
                        {pageSections.map(section => (
                            <li key={section._id} className="mb-3">
                                <strong>{section.sectionName}</strong><br />
                                {section.heading && <span>{section.heading}</span>}<br />
                                {section.content && <div dangerouslySetInnerHTML={{ __html: section.content }} />}
                                <button className="btn btn-sm btn-outline-info me-2" onClick={() => openEditModal(section)}>
                                    Edit
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteSection(section._id)}>
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
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
                                                {section.sectionName} - {section.heading}
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
