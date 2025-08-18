import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../../services/api';
import WhyChoosePhilanzel from './WhyChoosePhilanzel';

const apiUrl = '/partner/potential-growth';

const PotentialGrowth = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        commonHeading: '',
        commonDescription: '',
        solutions: []
    });
    const [solutionForm, setSolutionForm] = useState({ heading: '', description: '', icon: '' });
    const [showSolutionForm, setShowSolutionForm] = useState(false);
    const [editSolutionIdx, setEditSolutionIdx] = useState(null);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await API.get(apiUrl);
            setData(res.data[0] || null);
            setForm(res.data[0] || { commonHeading: '', commonDescription: '', solutions: [] });
            setError('');
        } catch (err) {
            setError('Failed to fetch data');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSolutionChange = (e) => {
        if (e.target.name === 'icon' && e.target.files && e.target.files[0]) {
            // Handle image upload
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('image', file);
            API.post('/upload', formData)
                .then(res => {
                    setSolutionForm({ ...solutionForm, icon: res.data.url });
                })
                .catch(() => {
                    setError('Failed to upload image');
                });
        } else {
            setSolutionForm({ ...solutionForm, [e.target.name]: e.target.value });
        }
    };


    // Add New Solution handler for the form
    const handleAddSolution = async (e) => {
        e.preventDefault();
        const updatedForm = { ...form, solutions: [...form.solutions, solutionForm] };
        setForm(updatedForm);
        setSolutionForm({ heading: '', description: '', icon: '' });
        setShowSolutionForm(false);
        try {
            if (data && data._id) {
                await API.put(`${apiUrl}/${data._id}`, updatedForm);
            } else {
                await API.post(apiUrl, updatedForm);
            }
            fetchData();
        } catch (err) {
            setError('Failed to save new solution');
        }
    };
    // Edit Solution handler
    const handleEditSolution = (idx) => {
        setEditSolutionIdx(idx);
        setSolutionForm(form.solutions[idx]);
    };

    const handleUpdateSolution = async (e) => {
        e.preventDefault();
        const updatedSolutions = form.solutions.map((sol, idx) => idx === editSolutionIdx ? solutionForm : sol);
        const updatedForm = { ...form, solutions: updatedSolutions };
        setForm(updatedForm);
        setEditSolutionIdx(null);
        setSolutionForm({ heading: '', description: '', icon: '' });
        try {
            if (data && data._id) {
                await API.put(`${apiUrl}/${data._id}`, updatedForm);
            } else {
                await API.post(apiUrl, updatedForm);
            }
            fetchData();
        } catch (err) {
            setError('Failed to update solution');
        }
    };

    // Delete Solution handler
    const handleDeleteSolution = async (idx) => {
        const updatedSolutions = form.solutions.filter((_, i) => i !== idx);
        const updatedForm = { ...form, solutions: updatedSolutions };
        setForm(updatedForm);
        try {
            if (data && data._id) {
                await API.put(`${apiUrl}/${data._id}`, updatedForm);
            } else {
                await API.post(apiUrl, updatedForm);
            }
            fetchData();
        } catch (err) {
            setError('Failed to delete solution');
        }
    };

    const removeSolution = (idx) => {
        setForm({ ...form, solutions: form.solutions.filter((_, i) => i !== idx) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (data && data._id) {
                await API.put(`${apiUrl}/${data._id}`, form);
            } else {
                await API.post(apiUrl, form);
            }
            setEditMode(false);
            fetchData();
        } catch (err) {
            setError('Failed to save');
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (data && data._id) {
            setLoading(true);
            try {
                await API.delete(`${apiUrl}/${data._id}`);
                setData(null);
                setForm({ commonHeading: '', commonDescription: '', solutions: [] });
                setEditMode(false);
                fetchData();
            } catch (err) {
                setError('Failed to delete');
            }
            setLoading(false);
        }
    };


    return (
        <div className="card mt-4">
            <div className="card-header bg-primary text-white">
                <h5>Potential Growth</h5>
            </div>
            <div className="card-body">
                <div className="d-flex mb-3">
                    <button className="btn btn-outline-secondary me-2" onClick={fetchData}>Refresh</button>
                    <button className="btn btn-success" onClick={() => setShowSolutionForm(true)}>Add New Solution</button>
                </div>
                {loading && <div>Loading...</div>}
                {error && <div className="alert alert-danger">{error}</div>}
                {!editMode && data && (
                    <>
                        <div className="d-flex align-items-center justify-content-between mb-2">
                            <div>
                                <h6 className="mb-0">{data.commonHeading}</h6>
                                <p className="mb-0">{data.commonDescription}</p>
                            </div>
                            <div>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => setEditMode(true)} title="Edit Common Heading & Description">
                                    <i className="bi bi-pencil-square"></i> Edit
                                </button>
                                <button className="btn btn-danger btn-sm" onClick={handleDelete} title="Delete All">
                                    <i className="bi bi-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                        <h6>Solutions</h6>
                        <div className="row">
                            {data.solutions.map((sol, idx) => (
                                <div key={idx} className="col-lg-3 col-md-4 col-sm-6 mb-3">
                                    <div className="card h-100 shadow-sm border-0" style={{ background: 'linear-gradient(135deg, #fbfbfcff 0%, #dbe0e6ff 100%)' }}>
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            {editSolutionIdx === idx ? (
                                                <form onSubmit={handleUpdateSolution}>
                                                    <input type="text" name="heading" placeholder="Heading" className="form-control mb-2" value={solutionForm.heading} onChange={handleSolutionChange} required />
                                                    <ReactQuill theme="snow" value={solutionForm.description} onChange={value => setSolutionForm({ ...solutionForm, description: value })} className="mb-2" />
                                                    <input type="file" name="icon" accept="image/*" className="form-control mb-2" onChange={handleSolutionChange} required />
                                                    {solutionForm.icon && (
                                                        <img src={solutionForm.icon.startsWith('/uploads') ? (process.env.NODE_ENV === 'production' ? solutionForm.icon : `http://localhost:8000${solutionForm.icon}`) : solutionForm.icon} alt="icon preview" style={{ maxWidth: '40px', maxHeight: '40px', marginBottom: '8px' }} />
                                                    )}
                                                    <button type="submit" className="btn btn-primary btn-sm me-2">Save</button>
                                                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setEditSolutionIdx(null); setSolutionForm({ heading: '', description: '', icon: '' }); }}>Cancel</button>
                                                </form>
                                            ) : (
                                                <div>
                                                    <div className="d-flex align-items-center mb-2 justify-content-between">
                                                        <div className="d-flex align-items-center">
                                                            {sol.icon && sol.icon.startsWith('/uploads') ? (
                                                                <img src={process.env.NODE_ENV === 'production' ? sol.icon : `http://localhost:8000${sol.icon}`} alt="icon" style={{ maxWidth: '40px', maxHeight: '40px', marginRight: '8px' }} />
                                                            ) : (
                                                                <span className="me-2" style={{ fontSize: '2rem' }}>{sol.icon}</span>
                                                            )}
                                                            <h5 className="card-title mb-0" style={{ fontWeight: 600 }}>{sol.heading}</h5>
                                                        </div>
                                                        <div>
                                                            <span
                                                                className="me-2 text-primary"
                                                                style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                                                                title="Edit"
                                                                onClick={() => handleEditSolution(idx)}
                                                            >
                                                                <i className="bi bi-pencil-square"></i>
                                                            </span>
                                                            <span
                                                                className="text-danger"
                                                                style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                                                                title="Delete"
                                                                onClick={() => handleDeleteSolution(idx)}
                                                            >
                                                                <i className="bi bi-trash"></i>
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <p className="card-text" style={{ color: '#333', fontSize: '1rem' }}>{sol.description}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Add New Solution button moved above next to Refresh */}
                        {/* Edit and Delete buttons moved above to only affect common heading and description */}
                    </>
                )}
                {showSolutionForm && (
                    <form onSubmit={handleAddSolution} className="mt-2 p-2 border rounded bg-light">
                        <input type="text" name="heading" placeholder="Heading" className="form-control mb-2" value={solutionForm.heading} onChange={handleSolutionChange} required />
                        <ReactQuill theme="snow" value={solutionForm.description} onChange={value => setSolutionForm({ ...solutionForm, description: value })} className="mb-2" />
                        <input type="file" name="icon" accept="image/*" className="form-control mb-2" onChange={handleSolutionChange} required />
                        {solutionForm.icon && (
                            <img src={solutionForm.icon.startsWith('/uploads') ? (process.env.NODE_ENV === 'production' ? solutionForm.icon : `http://localhost:8000${solutionForm.icon}`) : solutionForm.icon} alt="icon preview" style={{ maxWidth: '40px', maxHeight: '40px', marginBottom: '8px' }} />
                        )}
                        <button type="submit" className="btn btn-primary me-2">Add Solution</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowSolutionForm(false)}>Cancel</button>
                    </form>
                )}
                {editMode && (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label>Common Heading</label>
                            <input type="text" name="commonHeading" className="form-control" value={form.commonHeading} onChange={handleChange} required />
                        </div>
                        <div className="mb-2">
                            <label>Common Description</label>
                            <ReactQuill theme="snow" value={form.commonDescription} onChange={value => setForm({ ...form, commonDescription: value })} className="mb-2" />
                        </div>
                        <button type="submit" className="btn btn-primary me-2">Save</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>
                )}
                {!data && !editMode && (
                    <button className="btn btn-success" onClick={() => setEditMode(true)}>Add Potential Growth</button>
                )}
            </div>
        </div>
    );
};


// Display WhyChoosePhilanzel below Potential Growth
export default function PotentialGrowthWithWhyChoosePhilanzel() {
    return (
        <>
            <PotentialGrowth />
            <WhyChoosePhilanzel />
        </>
    );
}
