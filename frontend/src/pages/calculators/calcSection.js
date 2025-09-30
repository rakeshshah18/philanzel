import React, { useEffect, useState } from "react";
import { calculatorSectionsAPI } from "../../services/api";
const CalcSection = ({ onSaved, hideSectionList = false }) => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({ sectionName: "", heading: "", content: "", faqs: [] });
    const [editingId, setEditingId] = useState(null);
    const fetchSections = async () => {
        setLoading(true);
        try {
            const res = await calculatorSectionsAPI.getAll();
            setSections(res.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch sections");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!hideSectionList) {
            fetchSections();
        }
    }, [hideSectionList]);
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleFaqChange = (idx, field, value) => {
        const faqs = [...form.faqs];
        faqs[idx][field] = value;
        setForm({ ...form, faqs });
    };
    const addFaq = () => {
        setForm({ ...form, faqs: [...form.faqs, { question: "", description: "" }] });
    };
    const removeFaq = (idx) => {
        const faqs = form.faqs.filter((_, i) => i !== idx);
        setForm({ ...form, faqs });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await calculatorSectionsAPI.update(editingId, form);
            } else {
                await calculatorSectionsAPI.create(form);
            }
            setForm({ sectionName: "", heading: "", content: "", faqs: [] });
            setEditingId(null);
            if (!hideSectionList) fetchSections();
            if (onSaved) onSaved();
        } catch (err) {
            setError("Failed to save section");
        }
    };
    const handleEdit = (section) => {
        setForm({ sectionName: section.sectionName, heading: section.heading, content: section.content, faqs: section.faqs || [] });
        setEditingId(section._id);
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this section?")) return;
        try {
            await calculatorSectionsAPI.delete(id);
            if (!hideSectionList) fetchSections();
        } catch (err) {
            setError("Failed to delete section");
        }
    };
    return (
        <div className="container mt-2">
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <label>Section Name</label>
                    <input name="sectionName" value={form.sectionName} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-2">
                    <label>Heading</label>
                    <input name="heading" value={form.heading} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-2">
                    <label>Content</label>
                    <textarea name="content" value={form.content} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-2">
                    <label>FAQs</label>
                    {form.faqs.map((faq, idx) => (
                        <div key={idx} className="mb-2 border p-2 rounded">
                            <input
                                type="text"
                                placeholder="Question"
                                value={faq.question}
                                onChange={e => handleFaqChange(idx, "question", e.target.value)}
                                className="form-control mb-1"
                            />
                            <textarea
                                placeholder="Description"
                                value={faq.description}
                                onChange={e => handleFaqChange(idx, "description", e.target.value)}
                                className="form-control mb-1"
                            />
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removeFaq(idx)}>
                                Remove FAQ
                            </button>
                        </div>
                    ))}
                    <button type="button" className="btn btn-secondary btn-sm" onClick={addFaq}>
                        Add FAQ
                    </button>
                </div>
                <button type="submit" className="btn btn-primary">
                    {editingId ? "Update Section" : "Add Section"}
                </button>
                {editingId && (
                    <button type="button" className="btn btn-warning ms-2" onClick={() => { setForm({ sectionName: "", heading: "", content: "", faqs: [] }); setEditingId(null); }}>
                        Cancel Edit
                    </button>
                )}
            </form>
            {!hideSectionList && <>
                <hr />
                {loading ? (
                    <div>Loading...</div>
                ) : (
                    <div>
                        {sections.length === 0 ? (
                            <div>No sections found.</div>
                        ) : (
                            <div className="row">
                                {sections.map(section => (
                                    <div className="col-12 mb-3" key={section._id}>
                                        <div className="card">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start">
                                                    <div>
                                                        <h5 className="card-title">{section.sectionName || section.heading}</h5>
                                                        <p className="card-text">{section.content}</p>
                                                        {section.faqs && section.faqs.length > 0 && (
                                                            <div>
                                                                <strong>FAQs:</strong>
                                                                <ul>
                                                                    {section.faqs.map((faq, idx) => (
                                                                        <li key={idx}><strong>{faq.question}</strong>: {faq.description}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ms-3 d-flex flex-column gap-2">
                                                        <button type="button" className="btn btn-sm btn-outline-info" onClick={() => handleEdit(section)} title="Edit">
                                                            <i className="bi bi-pencil-square"></i> Edit
                                                        </button>
                                                        <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(section._id)} title="Delete">
                                                            <i className="bi bi-trash"></i> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </>}
        </div>
    );
};

export default CalcSection;
