import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

const OurProcess = () => {
    const [processes, setProcesses] = useState([]);
    const [form, setForm] = useState({ heading: '', description: '', steps: [{ name: '', heading: '', description: '', icon: null }] });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProcesses();
    }, []);

    const fetchProcesses = async () => {
        const res = await axios.get('/partner/our-process');
        setProcesses(res.data.data || []);
    };

    const handleChange = (e, idx, field) => {
        if (field) {
            const steps = [...form.steps];
            if (e.target.type === 'file') {
                steps[idx][field] = e.target.files[0];
            } else {
                steps[idx][field] = e.target.value;
            }
            setForm({ ...form, steps });
        } else {
            setForm({ ...form, [e.target.name]: e.target.value });
        }
    };

    const addStep = () => {
        setForm({ ...form, steps: [...form.steps, { name: '', heading: '', description: '', icon: null }] });
    };

    const removeStep = (idx) => {
        const steps = form.steps.filter((_, i) => i !== idx);
        setForm({ ...form, steps });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('heading', form.heading);
        data.append('description', form.description);
        data.append('steps', JSON.stringify(form.steps.map(s => ({ ...s, icon: undefined }))));
        form.steps.forEach((step, idx) => {
            if (step.icon) data.append('icon', step.icon);
        });
        if (editingId) {
            await axios.put(`/partner/our-process/${editingId}`, data);
        } else {
            await axios.post('/partner/our-process', data);
        }
        setForm({ heading: '', description: '', steps: [{ name: '', heading: '', description: '', icon: null }] });
        setEditingId(null);
        fetchProcesses();
    };

    const handleEdit = (proc) => {
        setEditingId(proc._id);
        setForm({
            heading: proc.heading,
            description: proc.description,
            steps: proc.steps.map(s => ({ ...s, icon: s.icon }))
        });
    };

    const handleDelete = async (id) => {
        await axios.delete(`/partner/ourProcess/${id}`);
        fetchProcesses();
    };

    return (
        <div className="mb-5">
            <h3>Our Process</h3>
            <form onSubmit={handleSubmit} className="mb-4">
                <input name="heading" value={form.heading} onChange={handleChange} placeholder="Heading" className="form-control mb-2" required />
                <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="form-control mb-2" required />
                <h5>Steps</h5>
                {form.steps.map((step, idx) => (
                    <div key={idx} className="border p-2 mb-2">
                        <input value={step.name} onChange={e => handleChange(e, idx, 'name')} placeholder="Step Name" className="form-control mb-1" required />
                        <input value={step.heading} onChange={e => handleChange(e, idx, 'heading')} placeholder="Step Heading" className="form-control mb-1" required />
                        <textarea value={step.description} onChange={e => handleChange(e, idx, 'description')} placeholder="Step Description" className="form-control mb-1" required />
                        <input type="file" accept="image/*" onChange={e => handleChange(e, idx, 'icon')} className="form-control mb-1" />
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeStep(idx)} disabled={form.steps.length === 1}>Remove Step</button>
                    </div>
                ))}
                <button type="button" className="btn btn-secondary mb-2" onClick={addStep}>Add Step</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Update' : 'Create'} Process</button>
                {editingId && <button type="button" className="btn btn-warning ms-2" onClick={() => { setEditingId(null); setForm({ heading: '', description: '', steps: [{ name: '', heading: '', description: '', icon: null }] }); }}>Cancel Edit</button>}
            </form>
            <h5>Existing Processes</h5>
            <ul className="list-group">
                {processes.map(proc => (
                    <li key={proc._id} className="list-group-item">
                        <strong>{proc.heading}</strong> - {proc.description}
                        <ul>
                            {proc.steps.map((step, idx) => (
                                <li key={idx}>
                                    {step.icon && <img src={step.icon.startsWith('/uploads/images/') ? `http://localhost:8000${step.icon}` : step.icon} alt="icon" style={{ width: 32, height: 32, marginRight: 8 }} />}
                                    <b>{step.name}</b>: {step.heading} - {step.description}
                                </li>
                            ))}
                        </ul>
                        <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(proc)}>Edit</button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(proc._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OurProcess;
