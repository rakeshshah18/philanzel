import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' ? '/api/contact-us/forms' : 'http://localhost:8000/api/contact-us/forms';

const ContactFormTable = () => {
    // Manual refresh handler
    const handleRefresh = () => {
        setSearch({ term: '', date: '' });
        setSortConfig({ key: 'createdAt', direction: 'desc' });
    };
    const [formSubmissions, setFormSubmissions] = useState([]);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [search, setSearch] = useState({ term: '', date: '' });

    // Fetch submissions with search filters
    useEffect(() => {
        const params = {};
        if (search.term) params.term = search.term;
        if (search.date) {
            // Accept both YYYY-MM-DD and MM/DD/YYYY
            let dateParam = search.date;
            if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(search.date)) {
                // Convert MM/DD/YYYY to YYYY-MM-DD
                const [month, day, year] = search.date.split('/');
                dateParam = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            params.date = dateParam;
        }
        axios.get(API_URL, { params })
            .then(res => {
                setFormSubmissions(res.data);
                setError('');
            })
            .catch(() => setError('Failed to fetch contact form submissions'));
    }, [search]);
    const sortedSubmissions = React.useMemo(() => {
        let sortable = [...formSubmissions];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                if (sortConfig.key === 'createdAt') {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);
                    return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
                } else {
                    const valA = (a[sortConfig.key] || '').toLowerCase();
                    const valB = (b[sortConfig.key] || '').toLowerCase();
                    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
                    return 0;
                }
            });
        }
        return sortable;
    }, [formSubmissions, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };
    // ...existing code...

    return (
        <div className="container mt-4" style={{ marginLeft: '2rem' }}>
            <div className="d-flex align-items-center mb-2">
                <h4 className="me-3 mb-0">Contact Form Submissions</h4>
                <button className="btn btn-outline-primary btn-sm" onClick={handleRefresh} title="Refresh table">
                    &#x21bb; Refresh
                </button>
            </div>
            <div className="row mb-3">
                <div className="col-8">
                    <input type="text" className="form-control" placeholder="Search Name, Email, or Service Type" value={search.term} onChange={e => setSearch(s => ({ ...s, term: e.target.value }))} />
                </div>
                <div className="col-4">
                    <input type="date" className="form-control" value={search.date} onChange={e => setSearch(s => ({ ...s, date: e.target.value }))} />
                </div>
            </div>
            {error && formSubmissions.length === 0 && <div className="alert alert-danger">{error}</div>}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                            Name {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th>Email</th>
                        <th>Message</th>
                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('servicesType')}>
                            Service Type {sortConfig.key === 'servicesType' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                        <th style={{ cursor: 'pointer' }} onClick={() => handleSort('createdAt')}>
                            Date {sortConfig.key === 'createdAt' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedSubmissions.length === 0 ? (
                        <tr><td colSpan="5" className="text-center">No submissions found.</td></tr>
                    ) : (
                        sortedSubmissions.map(sub => (
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

export default ContactFormTable;
