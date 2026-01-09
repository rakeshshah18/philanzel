import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
const API_BASE = process.env.REACT_APP_API_URL || 'https://philanzel-backend.onrender.com/api';
export default function PartnerFAQs() {
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [faqEditMode, setFaqEditMode] = useState({});
    const [faqItemsForm, setFaqItemsForm] = useState({});
    const [faqAddMode, setFaqAddMode] = useState({});
    const [newFaqItem, setNewFaqItem] = useState({ question: '', answer: '' });
    useEffect(() => {
        fetchFaqs();
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
    const handleFaqItemCancel = (faqId, idx) => {
        setFaqItemsForm(prev => ({
            ...prev,
            [faqId]: prev[faqId].map(item => ({ ...item, editing: false }))
        }));
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
    if (loading) return <div>Loading FAQs...</div>;
    if (error) return <div>Error: {error}</div>;
    return (
        <div className="dashboard-card shadow-sm mb-5" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
            <style>{`
                body.dark-mode .faq-text {
                    color: #f8f9fa !important;
                }
            `}</style>
            <div className="dashboard-card-header px-4 py-3" style={{ background: '#0ea5e9', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-question-circle me-2"></i>
                <h2 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>Partner FAQs</h2>
            </div>
            <div className="dashboard-card-body px-4 py-4">
                {faqs.length === 0 ? (
                    <div>No FAQs found.</div>
                ) : (
                    faqs.map(faq => (
                        <div key={faq._id} className="dashboard-card mb-4" style={{ borderRadius: 14, background: '#e0f2fe', border: 'none', boxShadow: '0 2px 8px #bae6fd' }}>
                            <div className="dashboard-card-header px-3 py-2 d-flex align-items-center" style={{ background: '#0ea5e9', color: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                                <i className="fas fa-info-circle me-2"></i>
                                <h4 className="mb-0" style={{ fontWeight: 600, letterSpacing: 1 }}>{faq.heading}</h4>
                            </div>
                            <div className="dashboard-card-body p-3">
                                <div dangerouslySetInnerHTML={{ __html: faq.description }} />
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
        </div>
    );
}
