import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminInquiries = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const response = await api.get('/inquiries/all');
            setInquiries(response.data.data || []);
        } catch (error) {
            setError('Failed to fetch inquiries');
            console.error('Error fetching inquiries:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="container-fluid py-4">
                <div className="d-flex justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h3 className="card-title">User Inquiries</h3>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={fetchInquiries}
                            >
                                Refresh
                            </button>
                        </div>
                        <div className="card-body">
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            {inquiries.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No inquiries found</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Service Type</th>
                                                <th>Message</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inquiries.map((inquiry) => (
                                                <tr key={inquiry._id}>
                                                    <td>{inquiry.name}</td>
                                                    <td>{inquiry.email}</td>
                                                    <td>{inquiry.phone}</td>
                                                    <td>
                                                        <span className="badge bg-primary">
                                                            {inquiry.serviceType}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div style={{ maxWidth: '200px' }}>
                                                            {inquiry.message?.length > 50
                                                                ? `${inquiry.message.substring(0, 50)}...`
                                                                : inquiry.message
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>{formatDate(inquiry.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInquiries;
