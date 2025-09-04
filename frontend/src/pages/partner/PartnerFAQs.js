import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export default function PartnerFAQs() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ heading: '', description: '' });
    const [faqEditMode, setFaqEditMode] = useState({}); // { [faqId]: true/false }
    const [faqItemsForm, setFaqItemsForm] = useState({}); // { [faqId]: [{question, answer}] }
    const [faqAddMode, setFaqAddMode] = useState({}); // { [faqId]: true/false }
    const [newFaqItem, setNewFaqItem] = useState({ question: '', answer: '' });

    useEffect(() => {
        fetchFaqs();
        // eslint-disable-next-line
    }, []);

    const fetchFaqs = () => {
        axios.get(`${API_BASE}/admin/partner-faqs`)
            .then(res => {
                setFaqs(res.data.data || []);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    };

    const handleEditClick = (faq) => {
        setEditingId(faq._id);
        setEditForm({ heading: faq.heading, description: faq.description });
    };

    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleQuillChange = (value) => {
        setEditForm({ ...editForm, description: value });
    };

    const handleEditSave = async (faq) => {
        try {
            await axios.put(`${API_BASE}/admin/partner-faqs/${faq._id}`, {
                ...faq,
                heading: editForm.heading,
                description: editForm.description
            });
            setEditingId(null);
            fetchFaqs();
        } catch (err) {
            setError('Failed to update FAQ');
        }
    };

    // FAQ items edit logic
    // Handler to start editing a specific FAQ item (only one at a time)
    const handleFaqItemEdit = (faqId, idx) => {
        setFaqItemsForm(prev => ({
            ...prev,
            [faqId]: prev[faqId]
                ? prev[faqId].map((item, i) =>
                    i === idx
                        ? { ...item, editing: true }
                        : { ...item, editing: false }
                )
                : faqs.find(f => f._id === faqId).faqs.map((item, i) =>
                    i === idx
                        ? { ...item, editing: true }
                        : { ...item, editing: false }
                )
        }));
    };

    // Handler to save an edited FAQ item
    const handleFaqItemSave = async (faqId, idx) => {
        const faq = faqs.find(f => f._id === faqId);
        const updatedItems = faqItemsForm[faqId].map((item, i) => ({ question: item.question, answer: item.answer }));
        try {
            await axios.put(`${API_BASE}/admin/partner-faqs/${faqId}`, {
                ...faq,
                faqs: updatedItems
            });
            fetchFaqs();
            setFaqItemsForm(prev => ({
                ...prev,
                [faqId]: prev[faqId].map(item => ({ ...item, editing: false }))
            }));
        } catch (err) {
            setError('Failed to update FAQ item');
        }
    };

    // Handler to cancel editing an FAQ item
    const handleFaqItemCancel = (faqId, idx) => {
        setFaqItemsForm(prev => ({
            ...prev,
            [faqId]: prev[faqId].map(item => ({ ...item, editing: false }))
        }));
    };
    const handleFaqEditClick = (faq) => {
        setFaqEditMode({ ...faqEditMode, [faq._id]: true });
        setFaqItemsForm({ ...faqItemsForm, [faq._id]: faq.faqs.map(item => ({ question: item.question, answer: item.answer })) });
    };

    const handleFaqItemChange = (faqId, idx, field, value) => {
        setFaqItemsForm(prev => {
            const updated = { ...prev };
            updated[faqId][idx][field] = value;
            return updated;
        });
    };

    const handleFaqItemDelete = async (faq, idx) => {
        const updatedFaqs = faq.faqs.filter((_, i) => i !== idx);
        try {
            await axios.put(`${API_BASE}/admin/partner-faqs/${faq._id}`, {
                ...faq,
                faqs: updatedFaqs
            });
            fetchFaqs();
            setFaqEditMode({ ...faqEditMode, [faq._id]: false });
        } catch (err) {
            setError('Failed to delete FAQ item');
        }
    };

    const handleFaqItemsSave = async (faq) => {
        try {
            await axios.put(`${API_BASE}/admin/partner-faqs/${faq._id}`, {
                ...faq,
                faqs: faqItemsForm[faq._id]
            });
            fetchFaqs();
            setFaqEditMode({ ...faqEditMode, [faq._id]: false });
        } catch (err) {
            setError('Failed to update FAQ items');
        }
    };

    const handleFaqItemsCancel = (faq) => {
        setFaqEditMode({ ...faqEditMode, [faq._id]: false });
        setFaqItemsForm({ ...faqItemsForm, [faq._id]: [] });
    };

    // FAQ item add logic
    const handleFaqAddClick = (faq) => {
        setFaqAddMode({ ...faqAddMode, [faq._id]: true });
        setNewFaqItem({ question: '', answer: '' });
    };

    const handleNewFaqItemChange = (field, value) => {
        setNewFaqItem(prev => ({ ...prev, [field]: value }));
    };

    const handleFaqItemAddSave = async (faq) => {
        const updatedFaqs = [...(faq.faqs || []), { question: newFaqItem.question, answer: newFaqItem.answer }];
        try {
            await axios.put(`${API_BASE}/admin/partner-faqs/${faq._id}`, {
                ...faq,
                faqs: updatedFaqs
            });
            fetchFaqs();
            setFaqAddMode({ ...faqAddMode, [faq._id]: false });
            setNewFaqItem({ question: '', answer: '' });
        } catch (err) {
            setError('Failed to add FAQ item');
        }
    };

    const handleFaqItemAddCancel = (faq) => {
        setFaqAddMode({ ...faqAddMode, [faq._id]: false });
        setNewFaqItem({ question: '', answer: '' });
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditForm({ heading: '', description: '' });
    };

    if (loading) return <div>Loading FAQs...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container-fluid mt-4 px-0">
            <style>{`
                body.dark-mode .faq-text {
                    color: #f8f9fa !important;
                }
            `}</style>
            <h2>Partner FAQs</h2>
            {faqs.length === 0 ? (
                <div>No FAQs found.</div>
            ) : (
                faqs.map(faq => (
                    <div key={faq._id} className="card mb-3">
                        <div className="card-body">
                            <>
                                <h4>{faq.heading}</h4>
                                <div dangerouslySetInnerHTML={{ __html: faq.description }} />
                            </>
                            {/* FAQ items section */}
                            <div className="mt-3">
                                <div className="d-flex mb-2">
                                    <Button variant="outline-success" size="sm" onClick={() => handleFaqAddClick(faq)}>Add Question</Button>
                                </div>
                                {/* Add FAQ item */}
                                {faqAddMode[faq._id] && (
                                    <Form className="mb-3">
                                        <Form.Group className="mb-2">
                                            <Form.Label>Question</Form.Label>
                                            <ReactQuill theme="snow" value={newFaqItem.question} onChange={value => handleNewFaqItemChange('question', value)} />
                                        </Form.Group>
                                        <Form.Group className="mb-2">
                                            <Form.Label>Answer</Form.Label>
                                            <ReactQuill theme="snow" value={newFaqItem.answer} onChange={value => handleNewFaqItemChange('answer', value)} />
                                        </Form.Group>
                                        <Button variant="success" size="sm" onClick={() => handleFaqItemAddSave(faq)}>Save</Button>{' '}
                                        <Button variant="secondary" size="sm" onClick={() => handleFaqItemAddCancel(faq)}>Cancel</Button>
                                    </Form>
                                )}
                                {/* Edit FAQ items */}
                                {faq.faqs && faq.faqs.length > 0 && (
                                    <ul className="list-unstyled">
                                        {(faqItemsForm[faq._id] || faq.faqs).map((item, idx) => (
                                            <li key={idx} className="d-flex align-items-center mb-2">
                                                <div style={{ flex: 1 }}>
                                                    {item.editing ? (
                                                        <Form className="mb-2">
                                                            <Form.Label>Question</Form.Label>
                                                            <ReactQuill theme="snow" value={item.question} onChange={value => handleFaqItemChange(faq._id, idx, 'question', value)} />
                                                            <Form.Label>Answer</Form.Label>
                                                            <ReactQuill theme="snow" value={item.answer} onChange={value => handleFaqItemChange(faq._id, idx, 'answer', value)} />
                                                            <Button variant="success" size="sm" className="me-2" onClick={() => handleFaqItemSave(faq._id, idx)}>Save</Button>
                                                            <Button variant="secondary" size="sm" onClick={() => handleFaqItemCancel(faq._id, idx)}>Cancel</Button>
                                                        </Form>
                                                    ) : (
                                                        <>
                                                            <div className="faq-text" style={{ color: '#626364ff' }}><strong dangerouslySetInnerHTML={{ __html: item.question }} /></div>
                                                            <div className="faq-text" style={{ color: '#575858ff' }}><span dangerouslySetInnerHTML={{ __html: item.answer }} /></div>
                                                            <hr />
                                                        </>
                                                    )}
                                                </div>
                                                {!item.editing && (
                                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleFaqItemEdit(faq._id, idx)} title="Edit">
                                                        Edit
                                                    </Button>
                                                )}
                                                <Button variant="outline-danger" size="sm" className="ms-2" onClick={() => handleFaqItemDelete(faq, idx)} title="Delete">
                                                    &times;
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
