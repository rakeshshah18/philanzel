import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from '../../services/api';
const EmpoweringIndividual = () => {
    const decodeHtmlEntities = (str) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = str;
        return txt.value;
    };
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        commonDescription: '',
        content: [{ heading: '', description: '', image: null }]
    });
    const [editingId, setEditingId] = useState(null);
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
    const addContentItem = () => {
        setFormData({
            ...formData,
            content: [...formData.content, { heading: '', description: '', image: null }]
        });
    };
    const removeContentItem = (idx) => {
        const updatedContent = formData.content.filter((_, i) => i !== idx);
        setFormData({ ...formData, content: updatedContent });
    };
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
                image: c.image
            }))
        });
        setShowForm(true);
    };
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
    const handleCancel = () => {
        setShowForm(false);
        setEditingId(null);
        setFormData({ commonDescription: '', content: [{ heading: '', description: '', image: null }] });
    };
    const getImageSrc = (img) => {
        if (!img) return '';
        return img.startsWith('/uploads/empowering-individuals/')
            ? `https://philanzel-backend.onrender.com${img}`
            : img;
    };
    return (
        <div className="dashboard-card shadow-sm mb-5" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
            <div className="dashboard-card-header px-4 py-3" style={{ background: '#16a34a', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-users me-2"></i>
                <h4 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>Empowering Individuals</h4>
            </div>
            <div className="dashboard-card-body px-4 py-4">
                <button className="btn btn-success pb-sm-2 mb-2" onClick={() => setShowForm(true)}>Add New</button>
                {loading && <div>Loading...</div>}
                {error && <div className="text-danger">{error}</div>}
                {!showForm && (
                    <div>
                        {data.length === 0 ? (
                            <div>No Empowering Individuals found.</div>
                        ) : (
                            data.map(item => (
                                <div key={item._id} className="dashboard-card mb-4" style={{ borderRadius: 14, background: '#e0f2fe', border: 'none', boxShadow: '0 2px 8px #bae6fd' }}>
                                    <div className="dashboard-card-header px-3 py-2 d-flex align-items-center" style={{ background: '#0ea5e9', color: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                                        <i className="fas fa-user-graduate me-2"></i>
                                        <h5 className="mb-0" style={{ fontWeight: 600, letterSpacing: 1 }} dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(item.commonDescription) }} />
                                    </div>
                                    <div className="dashboard-card-body px-3 py-3">
                                        <div className="row">
                                            {item.content.map((c, idx) => (
                                                <div key={idx} className="col-md-4 mb-3">
                                                    <div className="dashboard-card h-100" style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #bae6fd' }}>
                                                        {c.image && typeof c.image === 'string' ? (
                                                            <img src={getImageSrc(c.image)} alt={c.heading} className="card-img-top" style={{ height: '180px', objectFit: 'cover', borderTopLeftRadius: 10, borderTopRightRadius: 10 }} onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }} />
                                                        ) : (
                                                            <div className="card-img-top d-flex align-items-center justify-content-center bg-light" style={{ height: '180px', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
                                                                <span className="text-muted">No Image</span>
                                                            </div>
                                                        )}
                                                        <div className="dashboard-card-body p-3">
                                                            <h6 className="card-title">{c.heading}</h6>
                                                            <div className="card-text" dangerouslySetInnerHTML={{ __html: c.description }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-2">
                                            <button className="btn btn-primary btn-sm me-2" onClick={() => handleEdit(item)}>
                                                <i className="fas fa-edit me-1"></i>Edit
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(item._id)}>
                                                <i className="bi bi-trash me-1"></i>Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                {showForm && (
                    <form onSubmit={handleSubmit} className="dashboard-card p-3 mb-4" style={{ background: '#e3fcec', borderRadius: 14, boxShadow: '0 2px 8px #bae6fd' }}>
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
                            <div key={idx} className="dashboard-card p-2 mb-2" style={{ background: '#fff', borderRadius: 10, boxShadow: '0 2px 8px #bae6fd' }}>
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
        </div>
    );
};

export default EmpoweringIndividual;
