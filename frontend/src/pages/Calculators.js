import React, { useState, useEffect } from 'react';
import { calculatorPagesAPI } from '../services/api';

const Calculators = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [name, setName] = useState('');
    const [editName, setEditName] = useState('');
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editLoading, setEditLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState('');
    const [calculatorPages, setCalculatorPages] = useState([]);

    useEffect(() => {
        fetchCalculatorPages();
    }, [showDeleteModal, showAddModal]);

    const fetchCalculatorPages = async () => {
        try {
            const response = await calculatorPagesAPI.getAll();
            setCalculatorPages(response.data.data || []);
        } catch {
            setCalculatorPages([]);
        }
    };

    const handleAddCalculator = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await calculatorPagesAPI.create({ name });
            setSuccess('Calculator added successfully!');
            setName('');
            setShowAddModal(false);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to add calculator');
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (id, name) => {
        setEditId(id);
        setEditName(name);
        setShowEditModal(true);
        setError('');
        setSuccess('');
    };

    const handleEditCalculator = async (e) => {
        e.preventDefault();
        setEditLoading(true);
        setError('');
        setSuccess('');
        try {
            await calculatorPagesAPI.update(editId, { name: editName });
            setSuccess('Calculator updated successfully!');
            setShowEditModal(false);
            setEditId(null);
            setEditName('');
            fetchCalculatorPages();
        } catch (err) {
            setError('Failed to update calculator');
        } finally {
            setEditLoading(false);
        }
    };

    const handleDeleteCalculator = async (id) => {
        setDeleteLoading(true);
        setDeleteError('');
        try {
            await calculatorPagesAPI.delete(id);
            setCalculatorPages(calculatorPages.filter(page => page._id !== id));
        } catch (err) {
            setDeleteError('Failed to delete calculator');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-2">Calculators</h2>
            <div className="d-flex gap-2 mb-3">
                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                    Add Calculator
                </button>
                <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
                    Delete Calculator
                </button>
            </div>

            {/* Add Calculator Modal */}
            {showAddModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Calculator</h5>
                                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
                            </div>
                            <form onSubmit={handleAddCalculator}>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Calculator Name"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        required
                                        disabled={loading}
                                    />
                                    {error && <div className="text-danger mt-2">{error}</div>}
                                    {success && <div className="text-success mt-2">{success}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={loading || !name}>
                                        {loading ? 'Adding...' : 'Add'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Calculator Modal */}
            {showDeleteModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete Calculator</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                {deleteError && <div className="text-danger mb-2">{deleteError}</div>}
                                {calculatorPages.length === 0 ? (
                                    <div className="text-muted">No calculators found.</div>
                                ) : (
                                    <ul className="list-group">
                                        {calculatorPages.map(page => (
                                            <li key={page._id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>{page.name}</span>
                                                <span className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => handleEditClick(page._id, page.name)}
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleDeleteCalculator(page._id)}
                                                        disabled={deleteLoading}
                                                        title="Delete"
                                                    >
                                                        <i className="bi bi-trash"></i>
                                                    </button>
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Calculator Modal */}
            {showEditModal && (
                <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.3)' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Calculator</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <form onSubmit={handleEditCalculator}>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Calculator Name"
                                        value={editName}
                                        onChange={e => setEditName(e.target.value)}
                                        required
                                        disabled={editLoading}
                                    />
                                    {error && <div className="text-danger mt-2">{error}</div>}
                                    {success && <div className="text-success mt-2">{success}</div>}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary" disabled={editLoading || !editName}>
                                        {editLoading ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calculators;
