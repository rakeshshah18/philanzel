import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from '../../services/api';

const EmpoweringIndividual = () => {
    // Helper to strip HTML tags from a string
    // Helper to decode HTML entities
    const decodeHtmlEntities = (str) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    };
    const stripHtmlTags = (str) => str ? str.replace(/<[^>]*>?/gm, '') : '';
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        commonDescription: '',
        content: [{ heading: '', description: '', image: null }]
    });
    const [editingId, setEditingId] = useState(null);

    // Fetch all empowering individuals
    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/partner/empowering-individuals');
            setData(res.data.data || []);
        } catch (err) {
            setError('Failed to fetch data');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle form field changes
    const handleChange = (e, idx) => {
        const { name, value, files } = e.target;
        if (name === 'commonDescription') {
            setFormData({ ...formData, commonDescription: value });
        } else {
            const updatedContent = [...formData.content];
            if (name === 'image') {
                updatedContent[idx][name] = files[0];
            } else {
                updatedContent[idx][name] = value;
            }
            setFormData({ ...formData, content: updatedContent });
        }
    };

    // Add new content item
    const addContentItem = () => {
        setFormData({
            ...formData,
            content: [...formData.content, { heading: '', description: '', image: null }]
        });
    };

    // Remove content item
    const removeContentItem = (idx) => {
        const updatedContent = formData.content.filter((_, i) => i !== idx);
        setFormData({ ...formData, content: updatedContent });
    };

    // Submit form (create or update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const form = new FormData();
            form.append('commonDescription', formData.commonDescription);
            form.append('content', JSON.stringify(formData.content.map(item => ({
                heading: item.heading,
                description: item.description,
                image: (item.image && typeof item.image === 'string') ? item.image : ''
            }))));
            formData.content.forEach((item, idx) => {
                if (item.image && typeof item.image !== 'string') {
                    form.append('images', item.image);
                }
            });
            if (editingId) {
                await axios.put(`/partner/empowering-individuals/${editingId}`, form);
            } else {
                await axios.post('/partner/empowering-individuals', form);
            }
            setShowForm(false);
            setEditingId(null);
            setFormData({ commonDescription: '', content: [{ heading: '', description: '', image: null }] });
            fetchData();
        } catch (err) {
            setError('Failed to save data');
        }
        setLoading(false);
    };

    // Edit handler
    const handleEdit = (item) => {
        setEditingId(item._id);
        setFormData({
            commonDescription: item.commonDescription,
            content: item.content.map(c => ({
                heading: c.heading,
                description: c.description,
                image: c.image // image path
            }))
        });
        setShowForm(true);
    };

    // Delete handler
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this entry?')) return;
        setLoading(true);
        try {
            await axios.delete(`/partner/empowering-individuals/${id}`);
            fetchData();
        } catch (err) {
            setError('Failed to delete');
        }
        setLoading(false);
    };

    // Cancel form
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ commonDescription: '', content: [{ heading: '', description: '', image: null }] });
    };

    // Helper for image src
    const getImageSrc = (img) => {
        if (!img) return '';
        return img.startsWith('/uploads/empowering-individuals/')
            ? `http://localhost:8000${img}`
            : img;
    };

    return (
        <div className="mt-5">
            <h3 className="mb-3">Empowering Individuals</h3>
            {loading && <div>Loading...</div>}
            {error && <div className="text-danger">{error}</div>}
            {!showForm && (
                <div>
                    {data.length === 0 ? (
                        <div>No Empowering Individuals found.</div>
                    ) : (
                        data.map(item => (
                            <div key={item._id} className="card mb-4">
                                <div className="card-body">
                                    <h5 className="card-title" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(item.commonDescription) }} />
                                    <div className="row">
                                        {item.content.map((c, idx) => (
                                            <div key={idx} className="col-md-4 mb-3">
                                                <div className="card h-100">
                                                    {c.image && typeof c.image === 'string' ? (
                                                        <img src={getImageSrc(c.image)} alt={c.heading} className="card-img-top" style={{ height: '180px', objectFit: 'cover' }} onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }} />
                                                    ) : (
                                                        <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '180px' }}>
                                                            <span className="text-muted">No Image</span>
                                                        </div>
                                                    )}
                                                    <div className="card-body">
                                                        <h6 className="card-title">{c.heading}</h6>
                                                        <div className="card-text" dangerouslySetInnerHTML={{ __html: c.description }} />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2">
                                        <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(item)}>Edit</button>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                    <button className="btn btn-success" onClick={() => setShowForm(true)}>Add New</button>
                </div>
            )}
            {showForm && (
                <form onSubmit={handleSubmit} className="card p-3 mb-4">
                    <div className="mb-3">
                        <label className="form-label">Common Description</label>
                        <ReactQuill
                            theme="snow"
                            value={formData.commonDescription}
                            onChange={value => setFormData({ ...formData, commonDescription: value })}
                            className="mb-2"
                        />
                    </div>
                    {formData.content.map((c, idx) => (
                        <div key={idx} className="border rounded p-2 mb-2">
                            <div className="mb-2">
                                <label className="form-label">Heading</label>
                                <input type="text" name="heading" className="form-control" value={c.heading} onChange={e => handleChange(e, idx)} required />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Description</label>
                                <ReactQuill
                                    theme="snow"
                                    value={c.description}
                                    onChange={value => {
                                        const updatedContent = [...formData.content];
                                        updatedContent[idx].description = value;
                                        setFormData({ ...formData, content: updatedContent });
                                    }}
                                    className="mb-2"
                                />
                            </div>
                            <div className="mb-2">
                                <label className="form-label">Image</label>
                                <input type="file" name="image" className="form-control" onChange={e => handleChange(e, idx)} accept="image/*" />
                                {c.image && typeof c.image === 'string' && (
                                    <img src={getImageSrc(c.image)} alt="preview" style={{ width: 80, marginTop: 8 }} />
                                )}
                            </div>
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => removeContentItem(idx)} disabled={formData.content.length === 1}>Remove</button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-outline-primary mb-3" onClick={addContentItem}>Add Content Item</button>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={loading}>{editingId ? 'Update' : 'Create'}</button>
                        <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={loading}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default EmpoweringIndividual;
