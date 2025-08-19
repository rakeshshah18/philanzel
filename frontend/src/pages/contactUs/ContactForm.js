import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { contactInfoAPI } from '../../services/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ContactForm = () => {
    const [formSubmissions, setFormSubmissions] = useState([]);
    const [contactInfo, setContactInfo] = useState(null);
    const [error, setError] = useState('');
    const [editing, setEditing] = useState({ field: null, index: null });
    const [editValue, setEditValue] = useState('');
    const [newPoint, setNewPoint] = useState('');
    const [showAddPoint, setShowAddPoint] = useState(false);

    useEffect(() => {
        // Fetch contact form submissions
        axios.get('/api/contact-us/forms')
            .then(res => setFormSubmissions(res.data))
            .catch(() => setError('Failed to fetch contact form submissions'));
        // Fetch contact info using service
        contactInfoAPI.getAll()
            .then(res => {
                if (res.data.length > 0) setContactInfo(res.data[0]);
            })
            .catch(() => setError('Failed to fetch contact info'));
    }, []);

    // Add new point
    const handleAddPoint = async () => {
        if (!newPoint.trim()) return;
        const updatedPoints = [...contactInfo.points, newPoint];
        await contactInfoAPI.update(contactInfo._id, { points: updatedPoints });
        setContactInfo({ ...contactInfo, points: updatedPoints });
        setNewPoint('');
    };

    // Edit point
    const handleEditPoint = async (idx) => {
        const updatedPoints = [...contactInfo.points];
        updatedPoints[idx] = editValue;
        await contactInfoAPI.update(contactInfo._id, { points: updatedPoints });
        setContactInfo({ ...contactInfo, points: updatedPoints });
        setEditing({ field: null, index: null });
        setEditValue('');
    };

    // Delete point
    const handleDeletePoint = async (idx) => {
        const updatedPoints = contactInfo.points.filter((_, i) => i !== idx);
        await contactInfoAPI.update(contactInfo._id, { points: updatedPoints });
        setContactInfo({ ...contactInfo, points: updatedPoints });
    };

    // Edit address/contact/email
    const handleEditField = async (field) => {
        await contactInfoAPI.update(contactInfo._id, { [field]: editValue });
        setContactInfo({ ...contactInfo, [field]: editValue });
        setEditing({ field: null, index: null });
        setEditValue('');
    };

    // Delete address/contact/email (set to empty string)
    const handleDeleteField = async (field) => {
        await contactInfoAPI.update(contactInfo._id, { [field]: '' });
        setContactInfo({ ...contactInfo, [field]: '' });
    };

    // Edit heading/description
    const handleEditHeadingDesc = async () => {
        await contactInfoAPI.update(contactInfo._id, {
            heading: contactInfo.heading,
            description: contactInfo.description
        });
        setEditing({ field: null, index: null });
    };

    return (
        <div className="container mt-4">
            <h2>Contact Us</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            {contactInfo && (
                <section className="mb-5 p-3 border rounded bg-light">
                    {/* Edit heading/description */}
                    {editing.field === 'headingDesc' ? (
                        <div>
                            <input
                                type="text"
                                value={contactInfo.heading}
                                onChange={e => setContactInfo({ ...contactInfo, heading: e.target.value })}
                                className="form-control mb-2"
                                placeholder="Heading"
                            />
                            <ReactQuill
                                value={contactInfo.description}
                                onChange={val => setContactInfo({ ...contactInfo, description: val })}
                                className="mb-2"
                            />
                            <button className="btn btn-success btn-sm me-2" onClick={handleEditHeadingDesc}>Save</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setEditing({ field: null, index: null })}>Cancel</button>
                        </div>
                    ) : (
                        <div>
                            <button className="btn btn-primary btn-sm mt-2" onClick={() => setEditing({ field: 'headingDesc' })}>Edit</button>
                            <h3 className="mb-2">{contactInfo.heading}</h3>
                            <div dangerouslySetInnerHTML={{ __html: contactInfo.description }} />

                        </div>
                    )}
                    {/* Points */}
                    <ul className="mb-3">
                        {contactInfo.points.map((point, idx) => (
                            <li key={idx} className="d-flex justify-content-between align-items-center">
                                <span>
                                    <span dangerouslySetInnerHTML={{ __html: point }} />
                                </span>
                                <span>
                                    {editing.field === 'point' && editing.index === idx ? (
                                        <span>
                                            <ReactQuill value={editValue} onChange={setEditValue} />
                                            <button className="btn btn-success btn-sm me-2" onClick={() => handleEditPoint(idx)}>Save</button>
                                            <button className="btn btn-secondary btn-sm" onClick={() => setEditing({ field: null, index: null })}>Cancel</button>
                                        </span>
                                    ) : (
                                        <span>
                                            <button className="btn btn-primary btn-sm ms-2" onClick={() => { setEditing({ field: 'point', index: idx }); setEditValue(point); }}>Edit</button>
                                            <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeletePoint(idx)}>Delete</button>
                                        </span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mb-3">
                        {!showAddPoint ? (
                            <button className="btn btn-success btn-sm" onClick={() => setShowAddPoint(true)}>Add Point</button>
                        ) : (
                            <div>
                                <ReactQuill value={newPoint} onChange={setNewPoint} placeholder="Add new point..." />
                                <button className="btn btn-success btn-sm mt-2" onClick={handleAddPoint}>Save</button>
                                <button className="btn btn-secondary btn-sm mt-2 ms-2" onClick={() => { setShowAddPoint(false); setNewPoint(''); }}>Cancel</button>
                            </div>
                        )}
                    </div>
                    {/* Address, Contact, Email */}
                    {['address', 'contact', 'email'].map(field => (
                        <div className="mb-1 d-flex justify-content-between align-items-center" key={field}>
                            <span><strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> <span className="ms-2">{contactInfo[field]}</span></span>
                            <span>
                                {editing.field === field ? (
                                    <span>
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={e => setEditValue(e.target.value)}
                                            className="form-control d-inline-block w-auto ms-2"
                                        />
                                        <button className="btn btn-success btn-sm ms-2" onClick={() => handleEditField(field)}>Save</button>
                                        <button className="btn btn-secondary btn-sm ms-2" onClick={() => setEditing({ field: null, index: null })}>Cancel</button>
                                    </span>
                                ) : (
                                    <span>
                                        <button className="btn btn-primary btn-sm ms-2" onClick={() => { setEditing({ field }); setEditValue(contactInfo[field]); }}>Edit</button>
                                        <button className="btn btn-danger btn-sm ms-2" onClick={() => handleDeleteField(field)}>Delete</button>
                                    </span>
                                )}
                            </span>
                        </div>
                    ))}
                </section>
            )}
            <h4 className="mt-4">Contact Form Submissions</h4>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Message</th>
                        <th>Service Type</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {formSubmissions.length === 0 ? (
                        <tr><td colSpan="5" className="text-center">No submissions found.</td></tr>
                    ) : (
                        formSubmissions.map(sub => (
                            <tr key={sub._id}>
                                <td>{sub.name}</td>
                                <td>{sub.email}</td>
                                <td>{sub.message}</td>
                                <td>{sub.servicesType}</td>
                                <td>{new Date(sub.createdAt).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ContactForm;
