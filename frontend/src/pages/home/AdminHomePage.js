import React, { useState, useEffect } from 'react';
import { homePageAPI } from '../../services/api';

const AdminHomePage = () => {
    const [homePages, setHomePages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHomePages();
    }, []);

    const fetchHomePages = async () => {
        try {
            setLoading(true);
            const response = await homePageAPI.getAll();
            setHomePages(response.data.data || []);
        } catch (error) {
            setError('Failed to fetch homepage content');
            console.error('Error fetching homepage content:', error);
        } finally {
            setLoading(false);
        }
    };

    const deleteHomePage = async (id) => {
        if (!window.confirm('Are you sure you want to delete this homepage content?')) {
            return;
        }

        try {
            await homePageAPI.delete(id);
            setHomePages(homePages.filter(page => page._id !== id));
        } catch (error) {
            setError('Failed to delete homepage content');
            console.error('Error deleting homepage content:', error);
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
                            <h3 className="card-title">Homepage Content Management</h3>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={fetchHomePages}
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

                            {homePages.length === 0 ? (
                                <div className="text-center py-4">
                                    <p className="text-muted">No homepage content found</p>
                                </div>
                            ) : (
                                <div className="row">
                                    {homePages.map((page) => (
                                        <div key={page._id} className="col-md-6 mb-4">
                                            <div className="card h-100">
                                                <div className="card-header d-flex justify-content-between align-items-center">
                                                    <h6 className="card-title mb-0">
                                                        {page.heading.length > 30
                                                            ? `${page.heading.substring(0, 30)}...`
                                                            : page.heading
                                                        }
                                                    </h6>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => deleteHomePage(page._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                                <div className="card-body">
                                                    <h5 className="card-title">{page.heading}</h5>
                                                    <p className="card-text">
                                                        {page.description.length > 100
                                                            ? `${page.description.substring(0, 100)}...`
                                                            : page.description
                                                        }
                                                    </p>

                                                    <div className="mb-2">
                                                        <strong>Button:</strong>
                                                        <a
                                                            href={page.button.link}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-primary ms-2"
                                                        >
                                                            {page.button.text}
                                                        </a>
                                                    </div>

                                                    <div className="mb-2">
                                                        <strong>Image:</strong>
                                                        <div className="mt-1">
                                                            <img
                                                                src={page.image.url}
                                                                alt={page.image.altText}
                                                                className="img-fluid rounded"
                                                                style={{ maxHeight: '150px', maxWidth: '100%' }}
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="card-footer text-muted">
                                                    <small>Created: {formatDate(page.createdAt)}</small>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHomePage;
