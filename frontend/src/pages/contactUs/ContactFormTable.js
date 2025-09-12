import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
    ? 'https://philanzel-backend.vercel.app/api/contact-us/forms'
    : 'http://localhost:8000/api/contact-us/forms';

const ContactFormTable = () => {
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage, setRecordsPerPage] = useState(10);
    // Selection state
    const [selectedRows, setSelectedRows] = useState([]);
    // Table/filter/sort/search state
    const [formSubmissions, setFormSubmissions] = useState([]);
    const [error, setError] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    const [search, setSearch] = useState({ term: '', date: '' });
    // Memoized sorted submissions
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
    // Pagination logic (must be after sortedSubmissions)
    const totalPages = Math.ceil(sortedSubmissions.length / recordsPerPage);
    const paginatedSubmissions = sortedSubmissions.slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage);
    // Select all logic
    const isAllSelected = paginatedSubmissions.length > 0 && paginatedSubmissions.every(sub => selectedRows.includes(sub._id));
    const handleSelectAll = () => {
        if (isAllSelected) {
            setSelectedRows(selectedRows.filter(id => !paginatedSubmissions.some(sub => sub._id === id)));
        } else {
            setSelectedRows([...new Set([...selectedRows, ...paginatedSubmissions.map(sub => sub._id)])]);
        }
    };
    const handleSelectRow = (id) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
    };
    // Delete selected handler
    const handleDeleteSelected = async () => {
        if (selectedRows.length === 0) return;
        if (!window.confirm('Are you sure you want to delete the selected submissions?')) return;
        try {
            await axios.delete(API_URL, { data: { ids: selectedRows } });
            setSelectedRows([]);
            // Re-fetch submissions to ensure UI matches database
            const params = {};
            if (search.term) params.term = search.term;
            if (search.date) params.date = search.date;
            const res = await axios.get(API_URL, { params });
            setFormSubmissions(res.data);
            setError('');
        } catch {
            setError('Failed to delete selected submissions');
        }
    };
    // Export to Excel handler
    const handleExportExcel = () => {
        const data = sortedSubmissions.map(sub => ({
            Name: sub.name,
            Email: sub.email,
            Message: sub.message,
            'Service Type': sub.servicesType,
            Date: new Date(sub.createdAt).toLocaleString()
        }));
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ContactForms');
        XLSX.writeFile(workbook, 'Contact users.xlsx');
    };
    // Manual refresh handler
    const handleRefresh = () => {
        setSearch({ term: '', date: '' });
        setSortConfig({ key: 'createdAt', direction: 'desc' });
        setSelectedRows([]);
    };

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

    // Pagination logic (must be after sortedSubmissions)
    // ...existing code...

    const handleSort = (key) => {
        setSortConfig(prev => {
            if (prev.key === key) {
                return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };
    // ...existing code...

    // Reset to first page on search/filter/sort
    useEffect(() => { setCurrentPage(1); }, [search, sortConfig]);

    return (
        <div className="dashboard-card shadow-sm mb-5" style={{ borderRadius: 18, background: '#f8fafc', border: 'none', boxShadow: '0 2px 12px #e0e7ef', marginLeft: '2rem' }}>
            <div className="dashboard-card-header px-4 py-3" style={{ background: '#0ea5e9', color: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, display: 'flex', alignItems: 'center' }}>
                <i className="fas fa-table me-2"></i>
                <h3 className="mb-0" style={{ fontWeight: 700, letterSpacing: 1 }}>Contact Form Submissions</h3>
            </div>
            <div className="dashboard-card-body px-4 py-4">
                <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                    <div className="d-flex align-items-center">
                        <label htmlFor="recordsPerPage" className="me-2 mb-0">Show</label>
                        <select
                            id="recordsPerPage"
                            className="form-select form-select-sm me-2"
                            style={{ width: 'auto' }}
                            value={recordsPerPage}
                            onChange={e => {
                                setRecordsPerPage(Number(e.target.value));
                                setCurrentPage(1);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={15}>15</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="mb-0">records per page</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <button className="btn btn-outline-primary btn-sm" onClick={handleRefresh} title="Refresh table">
                            &#x21bb; Refresh
                        </button>
                        <button className="btn btn-outline-success btn-sm" onClick={handleExportExcel} title="Export to Excel">
                            &#x1F4C3; Export to Excel
                        </button>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-2">
                        <button className="btn btn-danger btn-sm" onClick={handleDeleteSelected} disabled={selectedRows.length === 0}>
                            Delete Selected
                        </button>
                        <div style={{ fontSize: '0.95rem', marginTop: '0.25rem', color: '#555' }}>
                            {selectedRows.length > 0 ? `${selectedRows.length} row${selectedRows.length > 1 ? 's' : ''} selected` : 'No rows selected'}
                        </div>
                    </div>
                    <div className="col-6">
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
                            <th>
                                <input type="checkbox" checked={isAllSelected} onChange={handleSelectAll} />
                            </th>
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
                        {paginatedSubmissions.length === 0 ? (
                            <tr><td colSpan="6" className="text-center">No submissions found.</td></tr>
                        ) : (
                            paginatedSubmissions.map(sub => (
                                <tr key={sub._id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(sub._id)}
                                            onChange={() => handleSelectRow(sub._id)}
                                        />
                                    </td>
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
                {/* Pagination controls */}
                {totalPages > 1 && (
                    <nav>
                        <ul className="pagination justify-content-center">
                            <li className={`page-item${currentPage === 1 ? ' disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>&laquo;</button>
                            </li>
                            {[...Array(totalPages)].map((_, idx) => (
                                <li key={idx + 1} className={`page-item${currentPage === idx + 1 ? ' active' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item${currentPage === totalPages ? ' disabled' : ''}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>&raquo;</button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </div>
    );
};

export default ContactFormTable;
