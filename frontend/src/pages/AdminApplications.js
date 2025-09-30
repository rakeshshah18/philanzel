import React, { useState, useEffect } from 'react';
import { careerAPI } from '../services/api';
const AdminApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        fetchApplications();
    }, []);
    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await careerAPI.getAll();
            setApplications(response.data.data || []);
        } catch (error) {
            setError('Failed to fetch applications');
            console.error('Error fetching applications:', error);
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

    const downloadResume = (resume, applicantName) => {
        if (!resume || !resume.filename) {
            alert('No resume file available');
            return;
        }
        const baseURL = process.env.NODE_ENV === 'production'
            ? 'https://philanzel-backend.vercel.app'
            : 'http://localhost:8000';
        const downloadUrl = `${baseURL}/uploads/${resume.filename}`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${applicantName}_resume_${resume.originalName || resume.filename}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }; if (loading) {
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
                            <h3 className="card-title">Career Applications</h3>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={fetchApplications}
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
                            {applications.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No applications found</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Message</th>
                                                <th>Resume</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {applications.map((application) => (
                                                <tr key={application._id}>
                                                    <td>{application.fullName}</td>
                                                    <td>{application.email}</td>
                                                    <td>{application.phone}</td>
                                                    <td>
                                                        <div style={{ maxWidth: '200px' }}>
                                                            {application.message?.length > 50
                                                                ? `${application.message.substring(0, 50)}...`
                                                                : application.message
                                                            }
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {application.resume ? (
                                                            <button
                                                                className="btn btn-sm btn-outline-primary"
                                                                onClick={() => downloadResume(application.resume, application.fullName)}
                                                            >
                                                                Download Resume
                                                            </button>
                                                        ) : (
                                                            <span className="text-muted">No resume</span>
                                                        )}
                                                    </td>
                                                    <td>{formatDate(application.createdAt)}</td>
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

export default AdminApplications;
