import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import EmpoweringIndividual from './empoweringIndividual';
import PotentialGrowth from './potentialGrowth';

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
        <div className="dashboard-card shadow-sm mb-5" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef' }}>
            <div className="dashboard-card-header px-4 py-3" style={{ background: '#1565c0', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
                <h4 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>
                    <i className="fas fa-cogs me-2"></i>
                    Our Process
                </h4>
            </div>
            <div className="dashboard-card-body px-4 py-4">
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Heading *</label>
                            <input name="heading" value={form.heading} onChange={handleChange} placeholder="Heading" className="form-control" required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Description *</label>
                            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="form-control" required />
                        </div>
                    </div>
                    <h5 className="mt-3">Steps</h5>
                    {form.steps.map((step, idx) => (
                        <div key={idx} className="dashboard-card p-3 mb-3" style={{ background: '#e0f2fe', borderRadius: 12, boxShadow: '0 2px 8px #bae6fd' }}>
                            <div className="row align-items-end">
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Step Name *</label>
                                    <input value={step.name} onChange={e => handleChange(e, idx, 'name')} placeholder="Step Name" className="form-control" required />
                                </div>
                                <div className="col-md-3 mb-2">
                                    <label className="form-label">Step Heading *</label>
                                    <input value={step.heading} onChange={e => handleChange(e, idx, 'heading')} placeholder="Step Heading" className="form-control" required />
                                </div>
                                <div className="col-md-4 mb-2">
                                    <label className="form-label">Step Description *</label>
                                    <textarea value={step.description} onChange={e => handleChange(e, idx, 'description')} placeholder="Step Description" className="form-control" required />
                                </div>
                                <div className="col-md-2 mb-2">
                                    <label className="form-label">Icon</label>
                                    <input type="file" accept="image/*" onChange={e => handleChange(e, idx, 'icon')} className="form-control" />
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                                <button type="button" className="btn btn-danger btn-sm" onClick={() => removeStep(idx)} disabled={form.steps.length === 1}>Remove Step</button>
                            </div>
                        </div>
                    ))}
                    <div className='d-flex gap-3'>
                        <button type="button" className="btn btn-secondary mb-2" onClick={addStep}>Add Step</button>
                        <button type="submit" className="btn btn-primary mb-2">{editingId ? 'Update' : 'Create'} Process</button>
                        {editingId && <button type="button" className="btn btn-warning ms-2" onClick={() => { setEditingId(null); setForm({ heading: '', description: '', steps: [{ name: '', heading: '', description: '', icon: null }] }); }}>Cancel Edit</button>}
                    </div>
                </form>
                <div className="dashboard-card-header px-3 py-2 mb-3" style={{ background: '#0ea5e9', color: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-list-alt me-2"></i>
                    <h5 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>Existing Processes</h5>
                </div>
                <div className="row mb-4">
                    {processes.map(proc => (
                        <div key={proc._id} className="col-12 mb-3">
                            <div className="dashboard-card shadow-sm" style={{ borderRadius: 14, background: '#e0f2fe', border: 'none', boxShadow: '0 2px 8px #bae6fd' }}>
                                <div className="dashboard-card-header px-3 py-2 d-flex align-items-center" style={{ background: '#0ea5e9', color: '#fff', borderTopLeftRadius: 14, borderTopRightRadius: 14 }}>
                                    <i className="fas fa-cog me-2"></i>
                                    <h5 className="mb-0" style={{ fontWeight: 600, letterSpacing: 1 }}>{proc.heading}</h5>
                                </div>
                                <div className="dashboard-card-body px-3 py-3">
                                    <div className="mb-2 text-muted">{proc.description}</div>
                                    <ul className="mb-3">
                                        {proc.steps.map((step, idx) => (
                                            <li key={idx} className="mb-2 d-flex align-items-center">
                                                {step.icon && <img src={step.icon.startsWith('/uploads/images/') ? `http://localhost:8000${step.icon}` : step.icon} alt="icon" style={{ width: 32, height: 32, marginRight: 8, borderRadius: 6, border: '1px solid #ddd' }} />}
                                                <div>
                                                    <b>{step.name}</b>: <span className="fw-semibold">{step.heading}</span> - {step.description}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-info" onClick={() => handleEdit(proc)}>
                                            <i className="fas fa-edit me-1"></i>Edit
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => handleDelete(proc._id)}>
                                            <i className="bi bi-trash me-1"></i>Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Render Empowering Individuals below Existing Processes */}
                <EmpoweringIndividual />
                {/* Potential Growth is part of Become a Partner, so render here only for /partner */}
                <PotentialGrowth />
            </div>
        </div>
    );
};

export default OurProcess;
