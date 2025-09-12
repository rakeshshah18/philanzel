import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../../services/api';
import PartnerFAQs from './PartnerFAQs';

const apiUrl = '/partner/why-choose-philanzel';

const WhyChoosePhilanzel = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingCommon, setEditingCommon] = useState(false);
    const [editForm, setEditForm] = useState({ heading: '', description: '' });
    const [editImage, setEditImage] = useState(null);
    const [editingPoints, setEditingPoints] = useState(false);
    const [editPointsForm, setEditPointsForm] = useState([]);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await API.get(apiUrl);
            setItems(res.data.data || res.data || []);
            setError('');
        } catch (err) {
            setError('Failed to fetch Why Choose Philanzel data');
        }
        setLoading(false);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;
    if (!items.length) return <div>No Why Choose Philanzel data found.</div>;

    // Common heading/description edit
    const handleCommonEdit = (item) => {
        setEditingCommon(true);
        setEditForm({ heading: item.heading, description: item.description });
        setEditImage(null);
    };

    const handleCommonChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleCommonSave = async (item) => {
        try {
            let formData;
            if (editImage) {
                formData = new FormData();
                formData.append('heading', editForm.heading);
                formData.append('description', editForm.description);
                formData.append('image', editImage);
                // Add points if needed
                if (item.points) {
                    formData.append('points', JSON.stringify(item.points));
                }
                await API.put(`${apiUrl}/${item._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await API.put(`${apiUrl}/${item._id}`, { ...item, ...editForm });
            }
            setEditingCommon(false);
            fetchItems();
        } catch (err) {
            setError('Failed to update');
        }
    };

    // Edit all points
    const handleEditPointsClick = (item) => {
        setEditingPoints(true);
        setEditPointsForm(item.points.map(p => p.description));
    };

    const handleEditPointsChange = (idx, value) => {
        setEditPointsForm(prev => {
            const updated = [...prev];
            updated[idx] = value;
            return updated;
        });
    };

    const handleEditPointsSave = async (item) => {
        const updatedPoints = editPointsForm.map(desc => ({ description: desc }));
        try {
            await API.put(`${apiUrl}/${item._id}`, { ...item, points: updatedPoints });
            setEditingPoints(false);
            fetchItems();
        } catch (err) {
            setError('Failed to update points');
        }
    };


    return (
        <>
            <section className="why-choose-philanzel mt-4">
                <div className="dashboard-card shadow-sm mb-4" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
                    <div className="dashboard-card-header px-4 py-3" style={{ background: '#0ea5e9', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-thumbs-up me-2"></i>
                        <h3 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>Why Choose Philanzel</h3>
                    </div>
                    <div className="dashboard-card-body px-4 py-4">
                        <div className="row">
                            {items.map((item) => (
                                <div className="col-md-6 mb-3" key={item._id}>
                                    <div className="dashboard-card h-100" style={{ borderRadius: 14, background: '#e0f2fe', border: 'none', boxShadow: '0 2px 8px #bae6fd' }}>
                                        {item.image && (
                                            <img
                                                src={`http://localhost:8000/uploads/images/${item.image}`}
                                                alt={item.heading}
                                                className="card-img-top"
                                                style={{ width: '100%', height: 'auto', objectFit: 'contain', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}
                                            />
                                        )}
                                        <div className="dashboard-card-header px-3 py-2 d-flex align-items-center" style={{ background: '#0ea5e9', color: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                                            <i className="fas fa-star me-2"></i>
                                            <h5 className="mb-0" style={{ fontWeight: 600, letterSpacing: 1 }}>{item.heading}</h5>
                                        </div>
                                        <div className="dashboard-card-body p-3">
                                            {editingCommon ? (
                                                <React.Fragment>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Heading</Form.Label>
                                                        <Form.Control name="heading" value={editForm.heading} onChange={handleCommonChange} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Description</Form.Label>
                                                        <ReactQuill theme="snow" value={editForm.description} onChange={value => setEditForm({ ...editForm, description: value })} />
                                                    </Form.Group>
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>Image</Form.Label>
                                                        <Form.Control type="file" accept="image/*" onChange={e => setEditImage(e.target.files[0])} />
                                                        <small className="form-text text-muted">Upload a new image to update</small>
                                                    </Form.Group>
                                                    <Button variant="success" size="sm" onClick={() => handleCommonSave(item)}>Save</Button>{' '}
                                                    <Button variant="secondary" size="sm" onClick={() => setEditingCommon(false)}>Cancel</Button>
                                                </React.Fragment>
                                            ) : (
                                                <React.Fragment>
                                                    <Button variant="outline-primary" size="sm" onClick={() => handleCommonEdit(item)}>Edit</Button>
                                                    <h5 className="card-title">{item.heading}</h5>
                                                    <div className="card-text" dangerouslySetInnerHTML={{ __html: item.description }} />

                                                </React.Fragment>
                                            )}
                                            {item.points && Array.isArray(item.points) && (
                                                <React.Fragment>
                                                    {editingPoints ? (
                                                        <Form>
                                                            <ul>
                                                                {editPointsForm.map((desc, idx) => (
                                                                    <li key={idx} className="mb-2 d-flex align-items-center">
                                                                        <ReactQuill
                                                                            theme="snow"
                                                                            value={desc}
                                                                            onChange={value => handleEditPointsChange(idx, value)}
                                                                            className="flex-grow-1"
                                                                        />
                                                                        <Button
                                                                            variant="outline-danger"
                                                                            size="sm"
                                                                            className="ms-2"
                                                                            onClick={() => {
                                                                                const updated = [...editPointsForm];
                                                                                updated.splice(idx, 1);
                                                                                setEditPointsForm(updated);
                                                                            }}
                                                                            title="Delete Point"
                                                                        >
                                                                            <span aria-hidden="true">&times;</span>
                                                                        </Button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                            <Button variant="outline-success" size="sm" onClick={() => setEditPointsForm([...editPointsForm, ""])}>+ Add Point</Button>{' '}
                                                            <Button variant="success" size="sm" onClick={() => handleEditPointsSave(item)}>Save Points</Button>{' '}
                                                            <Button variant="secondary" size="sm" onClick={() => setEditingPoints(false)}>Cancel</Button>
                                                        </Form>
                                                    ) : (
                                                        <React.Fragment>
                                                            <ul>
                                                                {item.points.map((point, idx) => (
                                                                    <li key={idx}>{point.description}</li>
                                                                ))}
                                                            </ul>
                                                            <Button variant="outline-primary" size="sm" onClick={() => handleEditPointsClick(item)}>Edit Points</Button>
                                                        </React.Fragment>
                                                    )}
                                                </React.Fragment>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <PartnerFAQs />
        </>
    );
};

export default WhyChoosePhilanzel;
